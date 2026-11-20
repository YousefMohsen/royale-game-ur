import {
  applyMove,
  applyRoll,
  getLegalMoves,
  rollDice,
  type GameState,
  type Move,
  type Player,
} from "./game";

export interface TurnResult {
  state: GameState;
  /** Human-readable status for the status region. */
  message: string;
  /** True when the action was rejected; `state` is then the unchanged input. */
  rejected: boolean;
}

export function playerName(player: Player): string {
  return player === "one" ? "Player one" : "Player two";
}

/** Legal moves for the pending roll; empty unless a move is awaited. */
export function pendingMoves(state: GameState): Move[] {
  return state.status.kind === "awaiting-move" ? getLegalMoves(state, state.status.roll) : [];
}

/** Rolls for the current player through the rules engine. Never throws. */
export function rollTurn(state: GameState, random?: () => number): TurnResult {
  if (state.status.kind !== "awaiting-roll") {
    return { state, message: "You can't roll right now.", rejected: true };
  }
  const roll = rollDice(random);
  const next = applyRoll(state, roll);
  const who = playerName(state.turn);
  if (next.status.kind === "awaiting-move") {
    return { state: next, message: `${who} rolled ${roll}. Choose a highlighted piece to move.`, rejected: false };
  }
  const reason = roll === 0 ? "rolled 0" : `rolled ${roll} but has no legal move`;
  return { state: next, message: `${who} ${reason}. ${playerName(next.turn)}'s turn to roll.`, rejected: false };
}

/** Moves a piece through the rules engine; illegal actions leave the state unchanged. */
export function moveTurn(state: GameState, pieceIndex: number): TurnResult {
  try {
    const next = applyMove(state, pieceIndex);
    if (next.status.kind === "won") {
      return { state: next, message: `${playerName(next.status.winner)} wins!`, rejected: false };
    }
    const extra = next.turn === state.turn ? ` ${playerName(next.turn)} landed on a rosette and rolls again.` : ` ${playerName(next.turn)}'s turn to roll.`;
    return { state: next, message: extra.trim(), rejected: false };
  } catch {
    return { state, message: "That move isn't allowed. Pick a highlighted piece.", rejected: true };
  }
}
