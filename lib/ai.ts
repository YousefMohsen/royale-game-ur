import { FINISH, getLegalMoves, isRosette, isShared, opponent, CENTRAL_ROSETTE, type GameState, type Move } from "./game";

/** Pure, deterministic scoring of one legal move for the player whose turn it is. */
export function scoreMove(state: GameState, move: Move): number {
  const me = state.turn;
  const theirs = state.pieces[opponent(me)];
  const mine = state.pieces[me];
  let score = move.to; // progress: prefer advancing
  if (move.to === FINISH) score += 40; // bringing a piece home
  if (mine.every((p, i) => p === FINISH || i === move.piece) && move.to === FINISH) score += 1000; // wins
  if (isShared(move.to) && !isRosette(move.to) && theirs.includes(move.to)) score += 60 + move.to; // capture
  if (isRosette(move.to)) score += move.to === CENTRAL_ROSETTE ? 35 : 25; // safe square + extra roll
  // Danger: landing on an unsafe shared square with an enemy piece 1–4 squares behind.
  if (isShared(move.to) && !isRosette(move.to) && theirs.some((p) => p >= 1 && move.to - p >= 1 && move.to - p <= 4)) {
    score -= 20 + move.to;
  }
  // Leaving a shared square removes exposure; leaving a rosette gives up safety.
  if (isShared(move.from) && !isRosette(move.from)) score += 8;
  if (isRosette(move.from)) score -= 8;
  return score;
}

/** Picks the best legal move for the pending roll; ties go to the furthest-advanced piece. Undefined if none. */
export function chooseMove(state: GameState): Move | undefined {
  if (state.status.kind !== "awaiting-move") return undefined;
  let best: Move | undefined;
  let bestScore = -Infinity;
  for (const move of getLegalMoves(state, state.status.roll)) {
    const s = scoreMove(state, move);
    if (s > bestScore || (s === bestScore && best !== undefined && move.from > best.from)) {
      best = move;
      bestScore = s;
    }
  }
  return best;
}
