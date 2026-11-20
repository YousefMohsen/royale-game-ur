import { createGame, type GameState } from "@/lib/game";

export const GAME_MODES = ["computer", "human"] as const;
export type GameMode = (typeof GAME_MODES)[number];

export const modeLabels: Record<GameMode, string> = {
  computer: "Human vs Computer",
  human: "Human vs Human",
};

/** Validates untrusted input (e.g. a query parameter); returns undefined when invalid. */
export function parseMode(value: unknown): GameMode | undefined {
  return GAME_MODES.find((mode) => mode === value);
}

export function playHref(mode: GameMode): string {
  return `/play?mode=${mode}`;
}

export interface LocalGame {
  mode: GameMode;
  state: GameState;
}

/** Starts a fresh local game for the chosen mode. */
export function newLocalGame(mode: GameMode): LocalGame {
  return { mode, state: createGame("one") };
}
