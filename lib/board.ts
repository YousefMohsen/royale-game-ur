import { FINISH, START, type Player } from "./game";

export const BOARD_ROWS = 3;
export const BOARD_COLS = 8;
const MIDDLE_ROW = 1;
const PLAYER_ROW: Record<Player, number> = { one: 0, two: 2 };

export interface Cell {
  row: number;
  col: number;
}

/** Maps a path position (1..14) of a player to its grid cell; undefined for start/finish. */
export function cellFor(player: Player, position: number): Cell | undefined {
  if (!Number.isInteger(position) || position <= START || position >= FINISH) return undefined;
  if (position <= 4) return { row: PLAYER_ROW[player], col: 4 - position };
  if (position <= 12) return { row: MIDDLE_ROW, col: position - 5 };
  return { row: PLAYER_ROW[player], col: 20 - position };
}

/** Grid cells that are not part of the board (the gap between the two private lanes). */
export function isVoidCell(row: number, col: number): boolean {
  return row !== MIDDLE_ROW && (col === 4 || col === 5);
}

/** Rosette squares: the central one is shared, the other two per lane belong to each player's lane. */
export function isRosetteCell(row: number, col: number): boolean {
  return (row === MIDDLE_ROW && col === 3) || (row !== MIDDLE_ROW && (col === 0 || col === 6));
}
