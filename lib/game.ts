/** Royal Game of Ur rules engine (Phase 1, see docs/rules.md). Pure and immutable. */

export type Player = "one" | "two";
export type Roll = 0 | 1 | 2 | 3 | 4;

export const PIECES_PER_PLAYER = 7;
export const START = 0;
export const FINISH = 15;
export const ROSETTES: readonly number[] = [4, 8, 14];
export const CENTRAL_ROSETTE = 8;
export const SHARED_START = 5;
export const SHARED_END = 12;

export type GameStatus =
  | { kind: "awaiting-roll" }
  | { kind: "awaiting-move"; roll: Roll }
  | { kind: "won"; winner: Player };

export interface GameState {
  /** Path position (0..15) of each piece, per player. */
  pieces: Record<Player, readonly number[]>;
  turn: Player;
  status: GameStatus;
}

export interface Move {
  /** Index of the piece in `pieces[turn]`. */
  piece: number;
  from: number;
  to: number;
}

export function opponent(player: Player): Player {
  return player === "one" ? "two" : "one";
}

export function isRosette(position: number): boolean {
  return ROSETTES.includes(position);
}

export function isShared(position: number): boolean {
  return position >= SHARED_START && position <= SHARED_END;
}

export function createGame(first: Player = "one"): GameState {
  const fresh = () => Array.from({ length: PIECES_PER_PLAYER }, () => START);
  return { pieces: { one: fresh(), two: fresh() }, turn: first, status: { kind: "awaiting-roll" } };
}

/** Rolls four binary dice. `random` returns [0,1) and can be injected for tests. */
export function rollDice(random: () => number = Math.random): Roll {
  let total = 0;
  for (let i = 0; i < 4; i++) if (random() < 0.5) total++;
  return total as Roll;
}

function isValidRoll(roll: unknown): roll is Roll {
  return typeof roll === "number" && Number.isInteger(roll) && roll >= 0 && roll <= 4;
}

/** Legal moves for the current player for a given roll. One move per distinct origin square. */
export function getLegalMoves(state: GameState, roll: number): Move[] {
  if (state.status.kind === "won" || !isValidRoll(roll) || roll === 0) return [];
  const mine = state.pieces[state.turn];
  const theirs = state.pieces[opponent(state.turn)];
  const moves: Move[] = [];
  const seenFrom = new Set<number>();
  mine.forEach((from, piece) => {
    const to = from + roll;
    if (from === FINISH || to > FINISH) return;
    if (seenFrom.has(from)) return; // identical pieces: avoid duplicate moves
    if (to !== FINISH && mine.includes(to)) return;
    if (isShared(to) && isRosette(to) && theirs.includes(to)) return;
    seenFrom.add(from);
    moves.push({ piece, from, to });
  });
  return moves;
}

/** Records a roll. A roll with no legal move passes the turn immediately. */
export function applyRoll(state: GameState, roll: number): GameState {
  if (state.status.kind !== "awaiting-roll") throw new Error("Cannot roll now");
  if (!isValidRoll(roll)) throw new Error("Invalid roll");
  if (getLegalMoves(state, roll).length === 0) {
    return { ...state, turn: opponent(state.turn), status: { kind: "awaiting-roll" } };
  }
  return { ...state, status: { kind: "awaiting-move", roll } };
}

/** Applies a move by piece index; throws if illegal. */
export function applyMove(state: GameState, pieceIndex: number): GameState {
  if (state.status.kind !== "awaiting-move") throw new Error("Cannot move now");
  const move = getLegalMoves(state, state.status.roll).find(
    (m) => m.from === state.pieces[state.turn][m.piece] && state.pieces[state.turn][pieceIndex] === m.from,
  );
  if (!move) throw new Error("Illegal move");
  const me = state.turn;
  const them = opponent(me);
  const mine = [...state.pieces[me]];
  mine[pieceIndex] = move.to;
  const theirs = [...state.pieces[them]];
  if (isShared(move.to) && !isRosette(move.to)) {
    const hit = theirs.indexOf(move.to);
    if (hit !== -1) theirs[hit] = START;
  }
  const pieces = { [me]: mine, [them]: theirs } as Record<Player, number[]>;
  if (mine.every((p) => p === FINISH)) {
    return { pieces, turn: me, status: { kind: "won", winner: me } };
  }
  const turn = isRosette(move.to) ? me : them;
  return { pieces, turn, status: { kind: "awaiting-roll" } };
}
