"use client";

import Link from "next/link";
import { useState } from "react";
import { BOARD_COLS, BOARD_ROWS, cellFor, isRosetteCell, isVoidCell } from "@/lib/board";
import { FINISH, START, type Player } from "@/lib/game";
import { newLocalGame, type GameMode } from "@/lib/modes";
import { moveTurn, pendingMoves, playerName, rollTurn } from "@/lib/turns";

const PLAYERS: readonly Player[] = ["one", "two"];

export function GameBoard({ mode }: Readonly<{ mode: GameMode }>) {
  const [state, setState] = useState(() => newLocalGame(mode).state);
  const [message, setMessage] = useState(`New game started. ${playerName("one")} rolls first.`);
  const [lastRoll, setLastRoll] = useState<number | undefined>();

  const moves = pendingMoves(state);
  const won = state.status.kind === "won";
  const canRoll = state.status.kind === "awaiting-roll";
  const movableFrom = new Map(moves.map((m) => [m.from, m.piece]));

  function roll() {
    const result = rollTurn(state);
    setMessage(result.message);
    if (result.rejected) return;
    setState(result.state);
    setLastRoll(Number(/rolled (\d)/.exec(result.message)?.[1]));
  }

  function move(piece: number) {
    const result = moveTurn(state, piece);
    setMessage(result.message);
    if (!result.rejected) setState(result.state);
  }

  function restart() {
    setState(newLocalGame(mode).state);
    setLastRoll(undefined);
    setMessage(`New game started. ${playerName("one")} rolls first.`);
  }

  const cells = [];
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      if (isVoidCell(row, col)) {
        cells.push(<div key={`${row}-${col}`} className="cell cell-void" aria-hidden="true" />);
        continue;
      }
      const owner = PLAYERS.find((p) =>
        state.pieces[p].some((pos) => {
          const c = cellFor(p, pos);
          return c?.row === row && c.col === col;
        }),
      );
      let position = 0;
      let label = "Empty square";
      if (owner) {
        const idx = state.pieces[owner].findIndex((pos) => {
          const c = cellFor(owner, pos);
          return c?.row === row && c.col === col;
        });
        position = state.pieces[owner][idx] ?? START;
        label = `${playerName(owner)} piece`;
      }
      const movablePiece = owner === state.turn ? movableFrom.get(position) : undefined;
      cells.push(
        <div key={`${row}-${col}`} className={`cell${owner ? "" : " cell-empty"}`} data-rosette={isRosetteCell(row, col) || undefined}>
          {owner &&
            (movablePiece !== undefined ? (
              <button
                type="button"
                className={`piece piece-${owner} piece-movable`}
                aria-label={`${label} on square ${position}. Move ${state.status.kind === "awaiting-move" ? state.status.roll : 0} squares`}
                onClick={() => move(movablePiece)}
              />
            ) : (
              <span className={`piece piece-${owner}`} role="img" aria-label={label} />
            ))}
        </div>,
      );
    }
  }

  return (
    <section aria-label="Game board" className="game">
      <p className="turn-indicator" data-testid="current-player">
        {won && state.status.kind === "won"
          ? `${playerName(state.status.winner)} wins`
          : `${playerName(state.turn)}'s turn`}
        {mode === "computer" && !won && state.turn === "two" ? " (computer moves arrive in a later update)" : ""}
      </p>
      <p className="muted" role="status" data-testid="game-status">
        {message}
      </p>

      <div className="board" role="group" aria-label="Board: 3 rows of 8 squares">
        {cells}
      </div>

      <div className="stocks">
        {PLAYERS.map((p) => {
          const waiting = state.pieces[p].filter((pos) => pos === START).length;
          const done = state.pieces[p].filter((pos) => pos === FINISH).length;
          const enter = p === state.turn ? movableFrom.get(START) : undefined;
          return (
            <div key={p} className="stock" data-testid={`stock-${p}`}>
              <strong>{playerName(p)}</strong>
              <span>Waiting: {waiting}</span>
              <span>Finished: {done}</span>
              {enter !== undefined && (
                <button type="button" className="control" onClick={() => move(enter)}>
                  Enter a piece
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="controls">
        {!won && (
          <button type="button" className="control control-primary" onClick={roll} disabled={!canRoll}>
            Roll dice
          </button>
        )}
        {lastRoll !== undefined && !won && (
          <span className="roll-result" data-testid="roll-result">
            Roll: {lastRoll}
          </span>
        )}
        <button type="button" className="control" onClick={restart}>
          {won ? "Play again" : "Restart"}
        </button>
        <Link href="/" className="link">
          Back to home
        </Link>
        <a href="/rules" className="link" target="_blank" rel="noopener noreferrer">
          How to play (opens in a new tab)
        </a>
      </div>
    </section>
  );
}
