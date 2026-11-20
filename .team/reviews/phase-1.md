# Phase 1 review: Playable local web game

Goal: Create a polished first playable version of the Royal Game of Ur with local human-vs-computer and same-device human-vs-human modes.

Reviewed 2026-11-20 by Gustav (PM).

## Phase 1: Playable local web game — review

**Goal met: yes.** The game is playable locally in human-vs-computer and same-device human-vs-human modes, with legal-move enforcement, win state, a rule-based AI and a rules page. The UX reviewer's finding that it looked like a plain prototype was addressed by the follow-up visual stories.

### What was built
- Foundation, rules engine and turns (`lib/game.ts`, `lib/turns.ts`, `lib/board.ts`, `lib/modes.ts`), local rule-based AI (`lib/ai.ts`, per ADR 0003), home/mode selection, board and dice components (`components/game-board.tsx`, `components/dice-tray.tsx`), rules/help, and verification coverage (#1–#8).
- UX-review follow-ups: ancient-board visual direction (#25, #17), reserves and stone selection (#20), pyramid dice tray with the result hidden until the dice settle (#28), stone movement, capture and scoring animations (#21), and a single-screen play HUD (#27).
- #19 and #22 were dropped as duplicates of #28 and #27.

### What is left
- No Phase 1 blockers. Items for Phase 2 are the planned epics: AI difficulty, presentation polish (sound, onboarding, saved settings) and match history/undo.
- The earlier UX finding on narrow layouts (320px tiny squares) was covered by #27 (tester checked 5 viewports); a repeat check at 320px is worth doing in Phase 2 polish.

### Risks
- One pre-existing e2e test (computer turn) was flaky on first run (tester, #21); it could become a CI nuisance.
- Heavy CSS-only theming raises the maintenance and performance cost of `app/globals.css`; no measurements exist yet for LCP/INP/CLS budgets.
- No automated accessibility check (e.g. contrast of the new themed visuals) exists; the earlier contrast finding on the disabled roll button was only reviewed manually.
- Tracking issue #9 and issue statuses were stale in earlier grooming runs.

### Metrics
- 16 stories: 14 DONE, 2 DROPPED (duplicates), 0 open.
- Latest tester runs: 41 unit tests and 17 Playwright e2e tests pass; every recent PR was approved, in two cases after one change request (dice overlap, status line revealing the result early).
- Story metrics in the context are empty, so no cycle-time figures are given.

## Retrospective

- **PM:** Planning visual stories after the UX review produced overlaps (#19/#22 vs #27/#28) and stale BLOCKED status. Next time reconcile pending UX proposals against existing stories before creating stories, and update the tracking issue when the owner answers.
- **UX:** The screenshot-based review gave actionable findings, but the broad 'looks plain' finding needed several stories to resolve. Give each finding a concrete, testable acceptance criterion and re-check narrow viewports (320px) after visual rework.
- **TESTER:** Verifying with Playwright screenshots at several viewports, plus reduced-motion, caught real visual defects that unit tests cannot. Keep doing it, and report flaky e2e tests as a separate issue instead of only noting them in the review.
- **DEVELOPER:** Two of the tester's change requests came from CSS class reuse and visible state leaking (shared `.roll-result` broke the dice layout; the status line revealed the roll early). Check shared class side effects and animation-gated state before handing off.
