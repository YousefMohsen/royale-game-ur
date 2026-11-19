# Local development — Royale game of ur

Everything runs on your machine. Services run in Docker; nothing local depends on a remote service.

## Prerequisites

- Node.js 22.18 or newer (see `.nvmrc`)
- pnpm 10 (`corepack enable` picks the version from `package.json`)

## Start everything (one command)

```sh
pnpm install
pnpm dev:up
```

`pnpm dev:up` starts the Next.js dev server at http://localhost:3000. Stop the services with `pnpm dev:down`.

## Everyday commands

- `pnpm dev:up` — start everything: starts the Next.js dev server at http://localhost:3000
- `pnpm dev:down` — stop the local services
- `pnpm dev` — Next.js dev server only (services must already run)
- `pnpm test:e2e` — Playwright end-to-end tests (starts the dev server; first run `pnpm exec playwright install chromium`)

## Environment variables

Copy `.env.example` to `.env` if you need to change a value. The defaults are local-only credentials; real secrets never go into the repository.

No environment variables yet.

## Next.js app

- The app runs at http://localhost:3000 with hot reload. `GET /api/health` reports its status.
- End-to-end tests: `pnpm exec playwright install chromium` once, then `pnpm test:e2e`.
