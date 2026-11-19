# Deployment suggestions — Royale game of ur

> Suggestions for the owner only. Agents never deploy, never connect to remote environments and never run these commands. Update this file in the same PR as any change that affects deployment (migration, bucket, function, env var, new service).

## Suggested hosting

| Part | Suggested host | Notes |
| --- | --- | --- |
| Web app | Vercel or another Next.js-compatible host | Agents will not deploy. The owner can deploy later after reviewing docs/deploy.md. Phase 1 has no database or server dependency beyond the Next.js app. |

## Web app (Next.js)

1. Import the repository in a Node-capable host for Next.js (for example Vercel, or any host that runs `pnpm build && pnpm start` on Node.js 22).
2. Build command `pnpm build`, install command `pnpm install --frozen-lockfile`.
3. Set every variable from `.env.example` in the host's environment settings (production values; never commit them).
4. Verify the security headers from `next.config.ts` on the deployed URL and add a Content Security Policy that fits the final app.

## Secrets and environment variables

Set these in the hosting provider's secret settings, never in the repository:

_None yet._

## Checklist before going live

- [ ] Every check in `AGENTS.md` passes on the commit you deploy.
- [ ] Production secrets are set in the host's secret store; none are committed.
- [ ] Database migrations were reviewed and applied with a dry run first.
- [ ] Access control is in place for anything that is not public by design.
- [ ] Backups and a rollback plan exist for the database.
