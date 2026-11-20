import { describe, expect, it } from "vitest";
import { applyMove, applyRoll, createGame, getLegalMoves, rollDice, type GameState } from "./game";

const make = (one: number[], two: number[], turn: "one" | "two" = "one"): GameState => ({
  pieces: { one, two },
  turn,
  status: { kind: "awaiting-roll" },
});
const pad = (p: number[]) => [...p, ...Array(7 - p.length).fill(0)];

describe("rolls", () => {
  it("sums four binary dice", () => {
    expect(rollDice(() => 0.9)).toBe(0);
    expect(rollDice(() => 0.1)).toBe(4);
  });
});

describe("legal moves", () => {
  it("offers one entry move per identical start piece", () => {
    expect(getLegalMoves(createGame(), 2)).toEqual([{ piece: 0, from: 0, to: 2 }]);
  });
  it("returns none for roll 0 or invalid rolls", () => {
    expect(getLegalMoves(createGame(), 0)).toEqual([]);
    expect(getLegalMoves(createGame(), 5)).toEqual([]);
  });
  it("blocks landing on own piece", () => {
    const s = make(pad([2, 4]), pad([]));
    expect(getLegalMoves(s, 2).map((m) => m.from)).toEqual([4]);
    expect(getLegalMoves(s, 2).some((m) => m.from === 2)).toBe(false);
  });
  it("requires exact roll to bear off", () => {
    const s = make(pad([14, 13]), pad([]));
    expect(getLegalMoves(s, 2).map((m) => m.from)).toEqual([13, 0]);
    expect(getLegalMoves(s, 1).map((m) => m.from)).toContain(14);
  });
  it("blocks the occupied central rosette", () => {
    const s = make(pad([6]), pad([8]));
    expect(getLegalMoves(s, 2).some((m) => m.from === 6)).toBe(false);
  });
});

describe("applying moves", () => {
  it("moves a piece and passes the turn", () => {
    const s = applyMove(applyRoll(make(pad([]), pad([])), 3), 0);
    expect(s.pieces.one[0]).toBe(3);
    expect(s.turn).toBe("two");
    expect(s.status).toEqual({ kind: "awaiting-roll" });
  });
  it("grants an extra turn on a rosette", () => {
    const s = applyMove(applyRoll(make(pad([]), pad([])), 4), 0);
    expect(s.pieces.one[0]).toBe(4);
    expect(s.turn).toBe("one");
  });
  it("captures an opponent on the shared lane", () => {
    const s = applyMove(applyRoll(make(pad([5]), pad([7])), 2), 0);
    expect(s.pieces.one[0]).toBe(7);
    expect(s.pieces.two[0]).toBe(0);
  });
  it("does not capture on private squares", () => {
    const s = applyMove(applyRoll(make(pad([2]), pad([3])), 1), 0);
    expect(s.pieces.two).toContain(3);
  });
  it("passes the turn on roll 0 and on no legal move", () => {
    expect(applyRoll(make(pad([]), pad([])), 0).turn).toBe("two");
    expect(applyRoll(make([15, 15, 15, 15, 15, 15, 14], pad([])), 3).turn).toBe("two");
  });
  it("rejects illegal actions", () => {
    const g = make(pad([2, 4]), pad([]));
    expect(() => applyMove(g, 0)).toThrow();
    expect(() => applyRoll(g, 9)).toThrow();
    const rolled = applyRoll(g, 2);
    expect(() => applyMove(rolled, 0)).toThrow(); // 2 -> 4 blocked
    expect(() => applyMove(rolled, 99)).toThrow();
    expect(() => applyRoll(rolled, 1)).toThrow();
  });
});

describe("winning", () => {
  it("marks the winner when the last piece bears off", () => {
    const s = applyMove(applyRoll(make([15, 15, 15, 15, 15, 15, 13], pad([5])), 2), 6);
    expect(s.status).toEqual({ kind: "won", winner: "one" });
    expect(getLegalMoves(s, 1)).toEqual([]);
    expect(() => applyRoll(s, 1)).toThrow();
  });
});
