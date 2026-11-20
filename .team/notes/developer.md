# Notes — Rosa (Developer)

Working notes and "Lessons learned" entries for Rosa, the Developer on Royale game of ur. Bigbran appends to this file after runs and phase retrospectives; keep entries short and dated.

## Lessons learned

_None yet._

<!-- run:cmwo7h8d6002y8onnv1pesome -->
- 2026-11-19 (#2): In a fresh container run `pnpm install --frozen-lockfile --store-dir /tmp/pnpm-store` (default /cache store is not writable).

<!-- run:cmwo86k6k005m8onn5ml0l4bz -->
- 2026-11-20 (#4): UI actions go through lib/turns.ts (rollTurn/moveTurn never throw; illegal actions return the unchanged state). Board geometry lives in lib/board.ts. tsconfig has noUncheckedIndexedAccess.

<!-- run:cmwo8mqvw00888onn6j3ny4lg -->
- 2026-11-20 (#6): Computer AI lives in lib/ai.ts (chooseMove/scoreMove, pure); game-board.tsx drives it via a useEffect timer (COMPUTER_DELAY_MS).

<!-- run:cmwo8wgvk009m8onny1c46899 -->
- 2026-11-20 (#7): Move/capture animation uses describeMove (lib/turns.ts) diffing before/after states; motion tokens and the reduced-motion override live in app/globals.css.

<!-- run:cmwo9602800b88onn997pnblj -->
- 2026-11-20 (#8): E2E dice: stub Math.random only for callers whose stack includes rollDice (a constant Math.random breaks Next dev hydration); use a seeded PRNG for full-game tests. Set PLAYWRIGHT_BROWSERS_PATH if /ms-playwright is read-only.

<!-- run:cmwo9j08o00dh8onnsszviy51 -->
- 2026-11-20 (#17): - 2026-11-20 (#17): Theme is a single parchment/lapis palette in app/globals.css (dark-mode overrides removed); rosettes/pieces/dice are pure CSS gradients, no image assets.

<!-- run:cmwoah72100j78onnjow15fey -->
- 2026-11-20 (#21): Move feedback (#21): MoveEffect in lib/turns.ts now carries from/rosette/scored; the board slides pieces via --slide-x/--slide-y CSS vars, and the reduced-motion block at the end of app/globals.css replaces animations with static rings.

<!-- run:cmwobb3mf00n28onnholcdenl -->
- 2026-11-20 (#25): Board cells carry data-lane/data-pattern/data-cue (components/game-board.tsx); tile motifs, scene background and frieze live in app/globals.css (#25).

<!-- run:cmwobxh4w00r08onnavgtwifd -->
- 2026-11-20 (#28): Dice UI lives in components/dice-tray.tsx; game-board.tsx holds lastRoll {value,player,id} and a `rolling` flag (ROLL_MS) that locks moves/computer until the tumble ends; full-game e2e uses emulateMedia reducedMotion to skip it. Kill stray `next dev` (via /proc) before pnpm test:e2e; use PLAYWRIGHT_BROWSERS_PATH=/ms-playwright.

<!-- run:cmwocen2t00ta8onn6nyva7ih -->
- 2026-11-20 (#27): HUD (#27): layout is CSS grid areas in the 'Play HUD' section at the end of app/globals.css (.page-play .game); panels are renderPanel() in components/game-board.tsx; e2e reads stock counts with regexes like /Waiting\s*6/. Run pnpm install --frozen-lockfile --store-dir /tmp/pnpm-store first in a fresh container.

## Lessons learned (phase 1, 2026-11-20)
<!-- phase-1-retro -->
- Two of the tester's change requests came from CSS class reuse and visible state leaking (shared `.roll-result` broke the dice layout; the status line revealed the roll early). Check shared class side effects and animation-gated state before handing off.

<!-- run:cmwp8m82u00188otkyh2z13l9 -->
- 2026-11-20 (#32): #32: app/globals.css was rewritten around the art-direction tokens (--bitumen, --gold, --ember ...). The phone board is transposed in CSS with --r/--c cell vars; the turn banner is text-transform uppercase, so e2e must match its innerText case-insensitively.
