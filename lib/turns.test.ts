import { describe, expect, it } from "vitest";
import { cellFor, isVoidCell } from "./board";
import { createGame, type GameState } from "./game";
import { moveTurn, pendingMoves, rollTurn } from "./turns";

const pad = (p: number[]) => [...p, ...Array(7 - p.length).fill(0)];
const low = () => 0.1; // roll 4
const high = () => 0.9; // roll 0

describe("rollTurn", () => {
  it("shows the roll and exposes legal moves", () => {
    const r = rollTurn(createGame(), low);
    expect(r.state.status).toEqual({ kind: "awaiting-move", roll: 4 });
    expect(r.message).toContain("rolled 4");
    expect(pendingMoves(r.state)).toHaveLength(1);
  });
  it("passes the turn on a zero roll", () => {
    const r = rollTurn(createGame(), high);
    expect(r.state.turn).toBe("two");
    expect(r.message).toContain("Player two");
  });
  it("rejects rolling twice", () => {
    const first = rollTurn(createGame(), low).state;
    const r = rollTurn(first, low);
    expect(r.rejected).toBe(true);
    expect(r.state).toBe(first);
  });
});

describe("moveTurn", () => {
  it("applies a legal move", () => {
    const s = rollTurn(createGame(), low).state;
    const r = moveTurn(s, 0);
    expect(r.rejected).toBe(false);
    expect(r.state.pieces.one[0]).toBe(4);
    expect(r.message).toContain("rosette");
  });
  it("rejects illegal moves and leaves state unchanged", () => {
    const s = rollTurn(createGame(), low).state;
    for (const idx of [-1, 99, 1.5, NaN]) {
      const r = moveTurn(s, idx);
      expect(r.rejected).toBe(true);
      expect(r.state).toBe(s);
    }
    const noRoll = createGame();
    expect(moveTurn(noRoll, 0).state).toBe(noRoll);
  });
  it("announces the winner", () => {
    const s: GameState = {
      pieces: { one: [...Array(6).fill(15), 14], two: pad([]) },
      turn: "one",
      status: { kind: "awaiting-move", roll: 1 },
    };
    const r = moveTurn(s, 6);
    expect(r.state.status).toEqual({ kind: "won", winner: "one" });
    expect(r.message).toBe("Player one wins!");
  });
});

describe("board layout", () => {
  it("maps both lanes onto the shared middle row", () => {
    expect(cellFor("one", 4)).toEqual({ row: 0, col: 0 });
    expect(cellFor("two", 4)).toEqual({ row: 2, col: 0 });
    expect(cellFor("one", 8)).toEqual({ row: 1, col: 3 });
    expect(cellFor("two", 12)).toEqual({ row: 1, col: 7 });
    expect(cellFor("one", 14)).toEqual({ row: 0, col: 6 });
    expect(cellFor("one", 0)).toBeUndefined();
    expect(cellFor("one", 15)).toBeUndefined();
  });
  it("maps every path square to a distinct non-void cell per player", () => {
    for (const p of ["one", "two"] as const) {
      const keys = new Set<string>();
      for (let i = 1; i <= 14; i++) {
        const c = cellFor(p, i)!;
        expect(isVoidCell(c.row, c.col)).toBe(false);
        keys.add(`${c.row},${c.col}`);
      }
      expect(keys.size).toBe(14);
    }
  });
});

describe("rosette cells", () => {
  it("agree with the rules engine rosette positions", async () => {
    const { isRosetteCell } = await import("./board");
    const { isRosette } = await import("./game");
    for (const p of ["one", "two"] as const)
      for (let i = 1; i <= 14; i++) {
        const c = cellFor(p, i)!;
        expect(isRosetteCell(c.row, c.col)).toBe(isRosette(i));
      }
  });
});
