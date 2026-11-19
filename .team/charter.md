# Charter — Royale game of ur

_Approved by the owner on 2026-11-19 (charter v1). Protected file: changes need the owner's approval._

## Summary

A fun, animated web app for playing the Royal Game of Ur in the browser, starting with local human-vs-computer and same-device human-vs-human play. Phase 1 focuses on a polished local playable game with legal move enforcement, simple rule-based AI, win state, and accessible animations without paid gameplay API or LLM calls.

## Target users

Casual browser players who want to quickly learn and play the Royal Game of Ur alone against the computer or locally with another player on the same device.

## Goals

- Deliver a playable browser-based Royal Game of Ur experience.
- Support local human vs computer play with a simple rule-based AI.
- Support local same-device human vs human play.
- Make the game feel fun through clear visual feedback and subtle animations.
- Enforce legal moves and provide a clear win state.
- Run fully locally with one command and keep setup simple for a new empty repository.

## Non-goals

- Online multiplayer in Phase 1.
- User accounts, authentication, or persistent cloud saves in Phase 1.
- Paid gameplay AI, external LLM calls, or token-based services during play.
- Mobile native app in Phase 1.
- Real-money betting, gambling mechanics, or monetization in Phase 1.

## Success criteria

- A new player can start a human-vs-computer or same-device human-vs-human game within two clicks from the home screen.
- The app enforces the Royal Game of Ur movement rules implemented for Phase 1 and prevents illegal moves.
- The game detects and clearly presents the winner.
- Move and dice/lot animations make gameplay feel responsive while respecting reduced-motion preferences.
- Every screen handles loading, empty, error, and success states where applicable.
- The project runs locally with one command after dependencies are installed.
- All required checks pass: install, audit, lint, typecheck, test, and build.

## Tech stack

- Frontend: Next.js App Router with TypeScript and plain CSS design tokens
- Testing: Vitest for unit tests and Playwright for browser-level checks from the Next.js template
- pnpm
- Node.js
- Accessible semantic HTML/CSS
- CSS animations with reduced-motion support

Rationale: Next.js with TypeScript fits the owner's preferred stack, is appropriate for a web game, supports a simple local-first architecture, and avoids unnecessary backend/database complexity for Phase 1. Plain CSS tokens keep styling maintainable without adding extra UI dependencies.

Stack templates: `nextjs-app`

## Constraints

- New empty GitHub repository: YousefMohsen/royale-game-ur.
- Agents never deploy or connect to production environments.
- Everything needed for development must run locally.
- Keep dependencies minimal and avoid small single-maintainer packages.
- No external paid AI, LLM, or token-based gameplay calls.
- No secrets required for Phase 1.
- Prioritize security, performance, and user experience when tradeoffs arise.

## Standards

- Use TypeScript for application code.
- Use reusable components and avoid duplicate ways to implement the same concept.
- Define design tokens once and reuse them consistently.
- Validate game actions at the boundary before mutating game state.
- Every user-facing screen should have accessible labels, keyboard-friendly controls, and clear focus states.
- Animations should be subtle, generally 150–300 ms, and respect prefers-reduced-motion.
- Tests are required for game rules and critical gameplay behavior.
- Commit lockfiles and run audit checks; high or critical advisories fail CI.

## Checks

- Install dependencies: `pnpm install --frozen-lockfile`
- Audit dependencies: `pnpm audit --audit-level high`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Unit tests: `pnpm test`
- Build: `pnpm build`

## Repository structure

- `app/` — Next.js App Router routes, page composition, and app-level metadata/layout. (`pnpm lint`, `pnpm typecheck`, `pnpm build`)
- `components/` — Reusable UI components for board, pieces, controls, dialogs, and layout. (`pnpm lint`, `pnpm typecheck`, `pnpm test`)
- `lib/` — Game rules, state transitions, AI move selection, and shared utilities. (`pnpm lint`, `pnpm typecheck`, `pnpm test`)
- `styles/` — Global styles and design tokens for colors, spacing, typography, motion, and accessibility states. (`pnpm lint`, `pnpm build`)
- `tests/` — Unit and browser-level tests for rules, components, and key user flows. (`pnpm test`)
- `docs/` — Project documentation including local setup, rules notes, and owner deployment suggestions. (`pnpm build`)

## Security

- Secrets: .env.local for future local-only secrets if ever needed; never committed. Phase 1 should not require secrets.
- Public: Game rules and UI code; Static assets; Non-secret configuration needed by the browser
- Never log: Future API keys or tokens; Environment variable values; User-provided secrets; Authentication/session tokens if added in later phases

## Project rules

- No external LLM, paid AI, or token-based service calls during gameplay.
- Agents may merge after tester approval.
- Use the commit identity Yousef Mohsen <yousefmohsen@outlook.dk>.
- Add AI commit trailers to commits.
- Write project content in English.

## Owner-only areas

_None._

## Do-not-touch paths

_None._

## Network allowlist

- `registry.npmjs.org`

## Deployment suggestions

- Web app: Vercel or another Next.js-compatible host — Agents will not deploy. The owner can deploy later after reviewing docs/deploy.md. Phase 1 has no database or server dependency beyond the Next.js app.

## Phases

### Phase 1: Playable local web game

Create a polished first playable version of the Royal Game of Ur with local human-vs-computer and same-device human-vs-human modes.

- **Project foundation** — Set up the Next.js TypeScript app, local commands, quality checks, documentation, and base design tokens.
- **Game rules engine** — Implement the core Royal Game of Ur state model, dice/lot roll, legal move calculation, turn handling, captures, safe squares, and win detection.
- **Playable interface** — Build the home screen, game mode selection, board UI, piece movement, player controls, rules/help, and accessible animated feedback.
- **Computer opponent** — Implement a local rule-based computer player that chooses legal moves without external AI or network calls.

### Phase 2: Polish and replayability

Improve fun, clarity, and repeat play after the first playable version is validated.

- **AI difficulty and tuning** — Add difficulty levels or improved heuristics for the local computer opponent.
- **Presentation polish** — Improve animations, sound options if approved, onboarding, visual themes, and saved local settings.
- **Game history and quality improvements** — Consider local-only match history, undo for local play, improved tests, and UX refinements.

### Phase 3: Online play and accounts evaluation

Evaluate and, if approved, add online multiplayer capabilities with the appropriate backend stack.

- **Online multiplayer spike** — Decide whether to use Supabase or another approved backend approach for presence, matchmaking, and game state sync.
- **Accounts and persistence** — If needed, add authentication, player profiles, and persistent stats with least-privilege security controls.

## Phase 1 stories

- #1 Set up Next.js project foundation (feature, 3 pts)
- #2 Implement core game state and rules (feature, 5 pts)
- #3 Build home screen and mode selection (feature, 2 pts)
- #4 Render interactive board and player controls (feature, 5 pts)
- #5 Add rules and help screen (feature, 2 pts)
- #6 Implement local rule-based computer opponent (feature, 3 pts)
- #7 Add animation, accessibility, and responsive polish (feature, 3 pts)
- #8 Add phase 1 verification coverage (feature, 3 pts)

## Initial decisions

- Use Next.js with TypeScript for the web app — `docs/adr/0001-use-next-js-with-typescript-for-the-web-app.md`
- Keep Phase 1 local-only without a database — `docs/adr/0002-keep-phase-1-local-only-without-a-database.md`
- Use rule-based local AI only — `docs/adr/0003-use-rule-based-local-ai-only.md`

## Team

- Gustav — Project Manager
- Rosa — Developer
- Simon — Tester
- Elin — UX

