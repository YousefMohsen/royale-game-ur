"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { chooseMove } from "@/lib/ai";
import { DiceTray, type RollDisplay } from "@/components/dice-tray";
import { BOARD_COLS, BOARD_ROWS, cellFor, isRosetteCell, isVoidCell } from "@/lib/board";
import { FINISH, PIECES_PER_PLAYER, START, type Player } from "@/lib/game";
import { newLocalGame, type GameMode } from "@/lib/modes";
import { describeMove, moveTurn, pendingMoves, playerName, rollTurn, type MoveEffect } from "@/lib/turns";

const PLAYERS: readonly Player[] = ["one", "two"];
/** Pause before each computer action so players can follow what happened. */
const COMPUTER_DELAY_MS = 800;
/** How long the dice tumble before the result is revealed; skipped for reduced motion. */
const ROLL_MS = 700;

/** Which lane a row belongs to; the middle row is the shared war lane. */
const LANES = ["one", "shared", "two"] as const;

/** Path cues painted on the board: where a stone enters (position 1) and where it leaves (position 14). */
function cueFor(row: number, col: number): "enter" | "exit" | undefined {
  if (row === 1) return undefined;
  if (col === 3) return "enter";
  if (col === 6) return "exit";
  return undefined;
}

/** Offset (in cells) a piece slides from; the CSS animation moves it to its own square. */
function slideStyle(slide: { dx: number; dy: number } | undefined): CSSProperties | undefined {
  return slide ? ({ "--slide-x": slide.dx, "--slide-y": slide.dy } as CSSProperties) : undefined;
}

export function GameBoard({ mode }: Readonly<{ mode: GameMode }>) {
  const [state, setState] = useState(() => newLocalGame(mode).state);
  const [message, setMessage] = useState(`New game started. ${playerName("one")} rolls first.`);
  const [lastRoll, setLastRoll] = useState<RollDisplay | undefined>();
  const [rolling, setRolling] = useState(false);
  const [settledMessage, setSettledMessage] = useState("");
  const [effect, setEffect] = useState<MoveEffect | undefined>();

  const won = state.status.kind === "won";
  const computerTurn = mode === "computer" && !won && state.turn === "two";
  const moves = computerTurn || rolling ? [] : pendingMoves(state);
  const canRoll = state.status.kind === "awaiting-roll" && !computerTurn && !rolling;
  const movableFrom = new Map(moves.map((m) => [m.from, m.piece]));

  /** Starts the tumble; the result stays hidden (and moves locked) until it settles. */
  function showRoll(resultMessage: string, player: Player) {
    const value = Number(/rolled (\d)/.exec(resultMessage)?.[1]);
    setLastRoll((prev) => ({ value, player, id: (prev?.id ?? 0) + 1 }));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMessage(resultMessage);
      return;
    }
    setMessage("Rolling…");
    setSettledMessage(resultMessage);
    setRolling(true);
  }

  // The computer rolls and moves on its own, one action per delay; restarting or leaving cancels the timer.
  useEffect(() => {
    if (!computerTurn || rolling) return;
    const timer = setTimeout(() => {
      if (state.status.kind === "awaiting-roll") {
        const result = rollTurn(state);
        if (result.rejected) setMessage(result.message);
        else {
          setState(result.state);
          showRoll(result.message, state.turn);
        }
      } else {
        const choice = chooseMove(state);
        if (!choice) return;
        const result = moveTurn(state, choice.piece);
        setMessage(`Computer moved a piece. ${result.message}`);
        if (!result.rejected) {
          setEffect(describeMove(state, result.state));
          setState(result.state);
          setLastRoll(undefined);
        }
      }
    }, COMPUTER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [computerTurn, state, rolling]);

  function roll() {
    const result = rollTurn(state);
    if (result.rejected) {
      setMessage(result.message);
      return;
    }
    setState(result.state);
    showRoll(result.message, state.turn);
  }

  useEffect(() => {
    if (!rolling) return;
    const timer = setTimeout(() => {
      setRolling(false);
      setMessage(settledMessage);
    }, ROLL_MS);
    return () => clearTimeout(timer);
  }, [rolling, settledMessage]);

  function move(piece: number) {
    const result = moveTurn(state, piece);
    setMessage(result.message);
    if (result.rejected) return;
    setEffect(describeMove(state, result.state));
    setState(result.state);
    setLastRoll(undefined);
  }

  function restart() {
    setEffect(undefined);
    setRolling(false);
    setState(newLocalGame(mode).state);
    setLastRoll(undefined);
    setMessage(`New game started. ${playerName("one")} rolls first.`);
  }

  let diceHint = "Press Roll dice to throw the four pyramids.";
  if (rolling) diceHint = "The dice are tumbling…";
  else if (lastRoll?.value === 0 && lastRoll.player !== state.turn) diceHint = `${playerName(lastRoll.player)} cannot move. The turn passed.`;
  else if (computerTurn) diceHint = "The computer is playing.";
  else if (state.status.kind === "awaiting-move") diceHint = moves.length ? "Choose a highlighted stone to move." : "No legal move.";

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
      let arrived = false;
      let slide: { dx: number; dy: number } | undefined;
      let label = "Empty square";
      if (owner) {
        const idx = state.pieces[owner].findIndex((pos) => {
          const c = cellFor(owner, pos);
          return c?.row === row && c.col === col;
        });
        position = state.pieces[owner][idx] ?? START;
        label = `${playerName(owner)} piece`;
        arrived = effect?.player === owner && effect.position === position;
        if (arrived && effect) {
          const origin = cellFor(owner, effect.from);
          if (origin) slide = { dx: origin.col - col, dy: origin.row - row };
        }
      }
      const movablePiece = owner === state.turn ? movableFrom.get(position) : undefined;
      cells.push(
        <div key={`${row}-${col}`} className={`cell${owner ? "" : " cell-empty"}${owner && arrived && effect?.captured ? " cell-capture" : ""}${owner && arrived && effect?.rosette ? " cell-rosette-land" : ""}`} data-rosette={isRosetteCell(row, col) || undefined} data-lane={LANES[row]} data-pattern={(row + col) % 3} data-cue={cueFor(row, col)}>
          {owner &&
            (movablePiece !== undefined ? (
              <button
                type="button"
                className={`piece piece-${owner} piece-movable${arrived ? " piece-arrived" : ""}`}
                style={slideStyle(slide)}
                aria-label={`${label} on square ${position}. Move ${state.status.kind === "awaiting-move" ? state.status.roll : 0} squares`}
                onClick={() => move(movablePiece)}
              />
            ) : (
              <span className={`piece piece-${owner}${arrived ? " piece-arrived" : ""}`} style={slideStyle(slide)} role="img" aria-label={label} />
            ))}
        </div>,
      );
    }
  }

  const status = state.status;
  const turnLabel =
    won && status.kind === "won"
      ? `${playerName(status.winner)} wins`
      : `${playerName(state.turn)}'s turn${computerTurn ? " (computer)" : ""}`;
  const choosingMove = !won && !computerTurn && status.kind === "awaiting-move" && moves.length > 0;

  /** One player's HUD panel: identity, turn marker, stones and progress. */
  function renderPanel(p: Player) {
    const waiting = state.pieces[p].filter((pos) => pos === START).length;
    const done = state.pieces[p].filter((pos) => pos === FINISH).length;
    const onBoard = PIECES_PER_PLAYER - waiting - done;
    const active = !won && p === state.turn;
    const enter = p === state.turn ? movableFrom.get(START) : undefined;
    const choosing = p === state.turn && !computerTurn && status.kind === "awaiting-move";
    const stones: ("reserve" | "board" | "done")[] = [
      ...Array.from({ length: waiting }, () => "reserve" as const),
      ...Array.from({ length: onBoard }, () => "board" as const),
      ...Array.from({ length: done }, () => "done" as const),
    ];
    let firstReserve = true;
    // The stone that just returned to reserve (last reserve stone) or just scored (last finished stone).
    const returnedIdx = effect?.captured && effect.player !== p ? waiting - 1 : -1;
    const scoredIdx = effect?.scored && effect.player === p ? stones.length - 1 : -1;
    let action = "Waiting for their turn";
    if (won && status.kind === "won") action = status.winner === p ? "Victory!" : "Defeated";
    else if (active && rolling) action = "Dice tumbling…";
    else if (active && computerTurn) action = "Thinking…";
    else if (active && status.kind === "awaiting-roll") action = "Roll the dice";
    else if (active && enter !== undefined) action = "Choose a stone to enter";
    else if (active && choosingMove) action = "Choose a stone to move";
    else if (active) action = "No legal move";
    return (
      <div key={p} className={`stock stock-${p}`} data-testid={`stock-${p}`} data-active={active || undefined}>
        <div className="stock-head">
          <span className={`piece piece-${p} stock-badge`} aria-hidden="true" />
          <strong className="stock-name">{playerName(p)}</strong>
          {mode === "computer" && p === "two" && <span className="stock-tag">Computer</span>}
          {active && <span className="stock-turn">Your turn</span>}
        </div>
        <div className="stones" role="group" aria-label={`${playerName(p)} stones: ${waiting} in reserve, ${onBoard} on the board, ${done} finished`}>
          {stones.map((kind, i) => {
            const cls = `piece piece-${p} stone stone-${kind}`;
            if (kind === "reserve" && firstReserve && enter !== undefined) {
              firstReserve = false;
              return <button key={i} type="button" className={`${cls} piece-movable`} aria-label="Enter a piece" onClick={() => move(enter)} />;
            }
            firstReserve = false;
            const text = { reserve: "Stone in reserve", board: "Stone on the board", done: "Finished stone" }[kind];
            const unavailable = kind === "reserve" && choosing;
            const fx = i === returnedIdx ? " stone-returned" : i === scoredIdx ? " stone-scored" : "";
            return (
              <span
                key={i}
                className={`${cls}${unavailable ? " stone-unavailable" : ""}${fx}`}
                role="img"
                aria-label={unavailable ? `${text}, cannot enter with this roll` : text}
              />
            );
          })}
        </div>
        <div className="stock-score" role="progressbar" aria-label={`${playerName(p)} progress`} aria-valuemin={0} aria-valuemax={PIECES_PER_PLAYER} aria-valuenow={done} aria-valuetext={`${done} of ${PIECES_PER_PLAYER} stones finished`}>
          <span className="stock-score-fill" style={{ width: `${(done / PIECES_PER_PLAYER) * 100}%` }} />
        </div>
        <dl className="stock-counts">
          <div><dt>Waiting</dt><dd>{waiting}</dd></div>
          <div><dt>On board</dt><dd>{onBoard}</dd></div>
          <div><dt>Finished</dt><dd>{done}</dd></div>
        </dl>
        <p className="stock-action">{action}</p>
      </div>
    );
  }

  return (
    <section aria-label="Game board" className="game">
      <div className="hud-top">
        <p key={won ? "won" : state.turn} className={`turn-indicator${won ? " turn-won" : ""}`} data-testid="current-player" data-player={won ? undefined : state.turn}>
          {turnLabel}
        </p>
        <p className="hud-status" role="status" aria-live="polite" aria-atomic="true" data-testid="game-status">
          {message}
        </p>
      </div>

      <div className="hud-panel hud-panel-one">{renderPanel("one")}</div>
      <div className="hud-panel hud-panel-two">{renderPanel("two")}</div>

      <div className="board" role="group" aria-label="Board: 3 rows of 8 squares">
        {cells}
      </div>

      <div className="hud-dice">
        {!won && (
          <DiceTray
            roll={lastRoll}
            rolling={rolling}
            canRoll={canRoll}
            onRoll={roll}
            rollerName={lastRoll ? playerName(lastRoll.player) : undefined}
            hint={diceHint}
          />
        )}
      </div>

      <div className="controls">
        <button type="button" className={`control${won ? " control-primary" : ""}`} onClick={restart}>
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
