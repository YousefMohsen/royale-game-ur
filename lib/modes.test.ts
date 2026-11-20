import { describe, expect, it } from "vitest";
import { newLocalGame, parseMode, playHref } from "@/lib/modes";

describe("modes", () => {
  it("accepts only known modes", () => {
    expect(parseMode("computer")).toBe("computer");
    expect(parseMode("human")).toBe("human");
    expect(parseMode("online")).toBeUndefined();
    expect(parseMode(undefined)).toBeUndefined();
    expect(parseMode(["human"])).toBeUndefined();
  });

  it("starts a fresh game in the chosen mode", () => {
    const game = newLocalGame("computer");
    expect(game.mode).toBe("computer");
    expect(game.state.status).toEqual({ kind: "awaiting-roll" });
    expect(game.state.turn).toBe("one");
  });

  it("builds play links", () => {
    expect(playHref("human")).toBe("/play?mode=human");
  });
});
