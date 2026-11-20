import { describe, expect, it } from "vitest";
import { chooseMove } from "./ai";
import { createGame, type GameState } from "./game";
import { moveTurn, rollTurn } from "./turns";

const pad = (p: number[], fill = 0) => [...p, ...Array(7 - p.length).fill(fill)];
const two = (mine: number[], theirs: number[], roll: 1 | 2 | 3 | 4): GameState => ({
  pieces: { one: pad(theirs), two: pad(mine) },
  turn: "two",
  status: { kind: "awaiting-move", roll },
});

describe("chooseMove", () => {
  it("returns undefined when no move is awaited", () => {
    expect(chooseMove(createGame("two"))).toBeUndefined();
  });
  it("prefers the winning move", () => {
    const s = two([13, 15, 15, 15, 15, 15, 15], [], 2);
    const m = chooseMove(s);
    expect(m?.to).toBe(15);
    expect(moveTurn(s, m!.piece).state.status).toEqual({ kind: "won", winner: "two" });
  });
  it("prefers a capture over plain progress", () => {
    const s = two([5, 9], [7], 2); // 5->7 captures, 9->11 just advances
    expect(chooseMove(s)?.to).toBe(7);
  });
  it("prefers a rosette", () => {
    const s = two([2, 5], [], 2); // 2->4 rosette vs 5->7
    expect(chooseMove(s)?.to).toBe(4);
  });
  it("avoids landing in front of an enemy piece when it can", () => {
    const s = two([1, 10], [8], 1); // 10->11 is exposed; 1->2 is safe
    expect(chooseMove(s)?.to).toBe(2);
  });
  it("is deterministic", () => {
    const s = two([0, 3], [], 3);
    expect(chooseMove(s)).toEqual(chooseMove(s));
  });
  it("only ever picks legal moves and finishes a full game against itself", () => {
    let state = createGame("one");
    let seed = 7;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
    for (let i = 0; i < 5000 && state.status.kind !== "won"; i++) {
      state = state.status.kind === "awaiting-roll" ? rollTurn(state, rnd).state : (() => {
        const m = chooseMove(state)!;
        const r = moveTurn(state, m.piece);
        expect(r.rejected).toBe(false);
        return r.state;
      })();
    }
    expect(state.status.kind).toBe("won");
  });
});

describe("computer turn without a legal move", () => {
  it("passes the turn and leaves pieces unchanged", () => {
    const s: GameState = { ...createGame("two") };
    const r = rollTurn(s, () => 0.9); // roll 0
    expect(r.state.turn).toBe("one");
    expect(r.state.pieces).toEqual(s.pieces);
  });
});
