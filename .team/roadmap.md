# Roadmap — Royale game of ur

_Maintained by the PM. The tracking issue #9 shows the live order and progress; each phase is a GitHub milestone._

## Phase 1: Playable local web game

- Status: active
- Milestone: #1 (Phase 1: Playable local web game)
- Goal: Create a polished first playable version of the Royal Game of Ur with local human-vs-computer and same-device human-vs-human modes.

Epics:

- **Project foundation** — Set up the Next.js TypeScript app, local commands, quality checks, documentation, and base design tokens.
- **Game rules engine** — Implement the core Royal Game of Ur state model, dice/lot roll, legal move calculation, turn handling, captures, safe squares, and win detection.
- **Playable interface** — Build the home screen, game mode selection, board UI, piece movement, player controls, rules/help, and accessible animated feedback.
- **Computer opponent** — Implement a local rule-based computer player that chooses legal moves without external AI or network calls.

Stories (recommended order):

1. #1 Set up Next.js project foundation
2. #2 Implement core game state and rules
3. #3 Build home screen and mode selection
4. #4 Render interactive board and player controls
5. #5 Add rules and help screen
6. #6 Implement local rule-based computer opponent
7. #7 Add animation, accessibility, and responsive polish
8. #8 Add phase 1 verification coverage

## Phase 2: Polish and replayability

- Status: planned (stories are proposed by the PM and created after the owner approves)
- Milestone: #2 (Phase 2: Polish and replayability)
- Goal: Improve fun, clarity, and repeat play after the first playable version is validated.

Epics:

- **AI difficulty and tuning** — Add difficulty levels or improved heuristics for the local computer opponent.
- **Presentation polish** — Improve animations, sound options if approved, onboarding, visual themes, and saved local settings.
- **Game history and quality improvements** — Consider local-only match history, undo for local play, improved tests, and UX refinements.

## Phase 3: Online play and accounts evaluation

- Status: planned (stories are proposed by the PM and created after the owner approves)
- Milestone: #3 (Phase 3: Online play and accounts evaluation)
- Goal: Evaluate and, if approved, add online multiplayer capabilities with the appropriate backend stack.

Epics:

- **Online multiplayer spike** — Decide whether to use Supabase or another approved backend approach for presence, matchmaking, and game state sync.
- **Accounts and persistence** — If needed, add authentication, player profiles, and persistent stats with least-privilege security controls.
