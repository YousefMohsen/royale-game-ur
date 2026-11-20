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
