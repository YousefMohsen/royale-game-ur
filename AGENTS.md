# AGENTS.md — Royale game of ur

Read this file before every task. It is short on purpose; follow it exactly.

## Project

A fun, animated web app for playing the Royal Game of Ur in the browser, starting with local human-vs-computer and same-device human-vs-human play. Phase 1 focuses on a polished local playable game with legal move enforcement, simple rule-based AI, win state, and accessible animations without paid gameplay API or LLM calls.

- Users: Casual browser players who want to quickly learn and play the Royal Game of Ur alone against the computer or locally with another player on the same device.
- Charter: `.team/charter.md` · Roadmap: `.team/roadmap.md` · Tracking issue: #9
- Team: Gustav (Project Manager), Rosa (Developer), Simon (Tester), Elin (UX)

## Repository structure

- `app/` — Next.js App Router routes, page composition, and app-level metadata/layout. Commands: `pnpm lint`, `pnpm typecheck`, `pnpm build`
- `components/` — Reusable UI components for board, pieces, controls, dialogs, and layout. Commands: `pnpm lint`, `pnpm typecheck`, `pnpm test`
- `lib/` — Game rules, state transitions, AI move selection, and shared utilities. Commands: `pnpm lint`, `pnpm typecheck`, `pnpm test`
- `styles/` — Global styles and design tokens for colors, spacing, typography, motion, and accessibility states. Commands: `pnpm lint`, `pnpm build`
- `tests/` — Unit and browser-level tests for rules, components, and key user flows. Commands: `pnpm test`
- `docs/` — Project documentation including local setup, rules notes, and owner deployment suggestions. Commands: `pnpm build`

Local environment (details in `docs/local-development.md`):

- `pnpm dev:up` — start everything: starts the Next.js dev server at http://localhost:3000
- `pnpm dev:down` — stop the local services
- `pnpm dev` — Next.js dev server only (services must already run)
- `pnpm test:e2e` — Playwright end-to-end tests (starts the dev server; first run `pnpm exec playwright install chromium`)

## Work planning

- The plan lives in GitHub issues. Tracking issue #9 lists the phases, the recommended order and the critical path; each phase is a milestone.
- Issues use a fixed shape: Goal, Scope, Out of scope, Acceptance criteria, Blocked by, Notes.
- Never start an issue while any issue under "Blocked by" (or a related `type:decision` issue) is still open.
- `type:decision` issues hold product decisions for the owner. Never implement them. The owner's `Decision:` comment overrides the text of the issues it affects until the PM edits them.
- One issue = one branch (`issue-<n>-<slug>`, from the up-to-date `main`) = one PR. Unfinished work is a draft PR with `Part of #<n>`; finished work uses `Closes #<n>`.
- Commits reference the issue (`#<n>`), use the configured git identity and end with a `Generated-by: <name> (Bigbran <role>)` trailer.
- Merge policy: when CI is green and the tester approves, Bigbran squash-merges the PR; agents never merge by hand.

## Issues are the shared memory

Every run starts fresh; anything the next run needs goes into the issue, its comments or the pushed branch. Each protocol comment starts with its keyword on the first line:

- `Started:` branch and run id. `Resumed:` which handoff is continued.
- `Handoff:` status, branch, draft PR, last commit, done, current state (check results, acceptance criteria), next steps, decisions and assumptions, gotchas.
- `Blocked:` one per missing thing: type (`SECRET`, `DECISION`, `ACCESS`, `CONTRADICTION`, `DEPENDENCY`), what is needed, why, options with a recommendation, how to provide it, ready-when. For secrets name the env var only, never a value.
- `Answer:` (owner) answers a `Blocked:`. `Decision:` (owner) records a product decision. `PM edit:` logs an issue text change (old → new, reason).

"Stuck" means something only the owner can provide. A failing test is not stuck. Finish everything that does not depend on the missing thing before handing off. On resume, read the newest `Handoff:` and every later comment, verify the stated state by running the checks, then continue from "Next steps".

## Architecture

- Frontend: Next.js App Router with TypeScript and plain CSS design tokens
- Testing: Vitest for unit tests and Playwright for browser-level checks from the Next.js template
- pnpm
- Node.js
- Accessible semantic HTML/CSS
- CSS animations with reduced-motion support
- Constraint: New empty GitHub repository: YousefMohsen/royale-game-ur.
- Constraint: Agents never deploy or connect to production environments.
- Constraint: Everything needed for development must run locally.
- Constraint: Keep dependencies minimal and avoid small single-maintainer packages.
- Constraint: No external paid AI, LLM, or token-based gameplay calls.
- Constraint: No secrets required for Phase 1.
- Constraint: Prioritize security, performance, and user experience when tradeoffs arise.

Why: Next.js with TypeScript fits the owner's preferred stack, is appropriate for a web game, supports a simple local-first architecture, and avoids unnecessary backend/database complexity for Phase 1. Plain CSS tokens keep styling maintainable without adding extra UI dependencies. Stack templates: `nextjs-app` (notes under "Engineering principles").

Do not add a new service, framework, state library or data-access layer without an ADR approved by the owner.

## Reuse

Search before adding a helper, component or pattern; never leave two ways to do the same thing. Keep this list current when you add a shared building block:

- `app/globals.css` — design tokens (colors, spacing, radii, typography, motion durations/easings); components use these variables only
- `lib/config.ts` — app-wide constants (name, metadata)

## Secrets and sensitive data

- Secrets live in: .env.local for future local-only secrets if ever needed; never committed. Phase 1 should not require secrets.
- Every variable is listed in `.env.example` with a local-only or placeholder value. Real values are never committed, logged, or written into issues, PRs, comments or results.
- Never log: Future API keys or tokens; Environment variable values; User-provided secrets; Authentication/session tokens if added in later phases
- Public by design: Game rules and UI code; Static assets; Non-secret configuration needed by the browser

## ADRs

ADRs live in `docs/adr/` (template: `docs/adr/0000-template.md`). Write one only for an adopted decision that is hard to reverse or shapes how other code is written. Name it `NNNN-short-kebab-title.md`, keep it well under a page, and never contradict an accepted ADR silently — supersede it with a new one.

Accepted:

- `docs/adr/0001-use-next-js-with-typescript-for-the-web-app.md` — Use Next.js with TypeScript for the web app
- `docs/adr/0002-keep-phase-1-local-only-without-a-database.md` — Keep Phase 1 local-only without a database
- `docs/adr/0003-use-rule-based-local-ai-only.md` — Use rule-based local AI only

## Checks

Every PR must pass these commands (CI runs exactly these, in this order):

1. `pnpm install --frozen-lockfile` — Install dependencies
2. `pnpm audit --audit-level high` — Audit dependencies
3. `pnpm lint` — Lint
4. `pnpm typecheck` — Typecheck
5. `pnpm test` — Unit tests
6. `pnpm build` — Build

## Project rules

- No external LLM, paid AI, or token-based service calls during gameplay.
- Agents may merge after tester approval.
- Use the commit identity Yousef Mohsen <yousefmohsen@outlook.dk>.
- Add AI commit trailers to commits.
- Write project content in English.

Owner-only areas (agents never do these): none

Do not edit or copy from: none

Protected (changes need the owner's approval): `AGENTS.md`, `CLAUDE.md`, `.team/charter.md`, `.claude/**`, `.github/workflows/**`, existing files in `docs/adr/`.

## Engineering principles

Priorities when they conflict: security, performance, user experience, then development speed.

**Dependencies.** Prefer the platform: the standard library, Node built-ins, web platform APIs and what the framework already includes. Write a few lines rather than adding a small package. When a library is truly needed, only large, trustworthy ones: backed by a company or well-known organization, widely used, actively maintained, good security record, permissive license, few dependencies of its own. Small single-maintainer packages are not allowed. Every new runtime or dev dependency not on the approved list needs the owner's approval. CI runs the package audit and fails on high/critical advisories. Lockfiles are always committed.

Approved dependencies (anything else needs the owner's approval first):

- `typescript` (dev) — Type checking (strict mode everywhere)
- `@types/node` (dev) — Node.js type definitions
- `next` (runtime) — Web framework (Vercel)
- `react` (runtime) — UI library (Meta)
- `react-dom` (runtime) — React DOM renderer
- `@types/react` (dev) — React types
- `@types/react-dom` (dev) — React DOM types
- `eslint` (dev) — Linting
- `eslint-config-next` (dev) — Next.js ESLint rules (incl. accessibility)
- `vitest` (dev) — Unit and integration tests
- `@playwright/test` (dev) — End-to-end tests against the local stack (Microsoft)

**Security.** Validate all input at the boundary with shared schemas. Least privilege everywhere (scoped keys, server-only secrets, row level security where the database supports it). No secrets in client bundles. Auth and authorization are tested, including "user A cannot read user B's data".

**Performance.** Measure before and after when a change touches performance-sensitive code; budgets per stack are below. Every query path has an index; no N+1 queries.

**User experience.** Every screen handles loading, empty, error and success states; skeletons where content has a known shape. Subtle, purposeful animations of about 150–300 ms with natural easing that never block input and respect reduced-motion settings. Accessible by default: semantic markup, labels for icons, keyboard navigation, sufficient contrast. Design tokens are defined once and used everywhere.

**Local only.** Everything runs locally with one command; schemas, migrations, policies, seed data and config are code. Agents never deploy or connect to remote environments; `docs/deploy.md` holds suggestions for the owner and is updated in the same PR when a change affects deployment.

**Project standards.**

- Use TypeScript for application code.
- Use reusable components and avoid duplicate ways to implement the same concept.
- Define design tokens once and reuse them consistently.
- Validate game actions at the boundary before mutating game state.
- Every user-facing screen should have accessible labels, keyboard-friendly controls, and clear focus states.
- Animations should be subtle, generally 150–300 ms, and respect prefers-reduced-motion.
- Tests are required for game rules and critical gameplay behavior.
- Commit lockfiles and run audit checks; high or critical advisories fail CI.

### TypeScript

- TypeScript in strict mode everywhere (`tsconfig.base.json`, extended by every `tsconfig.json`); no `any` without a comment explaining why.
- Node.js version is pinned in `.nvmrc`; the package manager is pnpm (version in `package.json`). The lockfile is always committed.

### CI

- `.github/workflows/ci.yml` runs the checks above on every PR and on pushes to the default branch. It is protected: propose changes to the owner instead of editing it.
- The dependency audit fails on high or critical advisories; fix them by upgrading within the approved packages, never by silencing the audit. The only exceptions are the advisories listed in `package.json` → `pnpm.auditConfig.ignoreGhsas`, which only the owner adds (each one has no patched version and affects development tooling only, e.g. `GHSA-fc5q-39xc-vjpf` in picomatch via ESLint).

### Next.js

- This Next.js version may differ from what you remember: read the relevant guide in `node_modules/next/dist/docs/` before using an API, and heed deprecation notices.
- App Router; React Server Components by default, `"use client"` only where interaction needs it. Server-only code (database, secrets) never reaches client bundles; only `NEXT_PUBLIC_*` variables are public.
- Mutations through server actions or route handlers that validate input on the server.
- Styling: plain CSS with the tokens in `app/globals.css`; no CSS or animation library unless approved. Animations use CSS transitions/keyframes and the View Transitions API, 150–300 ms, and respect `prefers-reduced-motion`.
- Security headers are set in `next.config.ts`; keep them when adding routes.
- Performance budgets (mid-range device): LCP < 2.5 s, INP < 200 ms, CLS < 0.1; keep client JavaScript per route small, prefer server components and streaming.
- Tests: Vitest for logic (`**/*.test.ts`), Playwright end-to-end tests in `e2e/` against the local stack (`pnpm test:e2e`).

## Definitions of Ready and Done

**Ready:** Goal, Scope and Out of scope present; at least one acceptance criterion in Given/When/Then form; estimate set (1, 2, 3, 5 — an 8 must be split); all "Blocked by" issues and related `type:decision` issues closed.

**Done:**

- PR exists, is not a draft, says `Closes #<n>` and follows the PR template.
- CI is green.
- Every acceptance criterion is listed with how it is met (backed by an automated test where feasible), every check above was run with honest results, and manual checks left for the owner are listed.
- The tester approved; no unanswered `Blocked:` comments remain on the issue.
- `pnpm dev:up` still starts everything; deployment-relevant changes update `docs/deploy.md` and `.env.example` in the same PR.
- No new dependency without the owner's approval; no changes to protected or do-not-touch paths without the owner's approval.
- UI changes cover loading, empty and error states and follow the animation and accessibility rules.
