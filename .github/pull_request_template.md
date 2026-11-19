Closes #

<!-- Unfinished work: open a draft PR and write "Part of #<n>" instead. -->

## What changed

<!-- One or two sentences. -->

## Acceptance criteria

<!-- Copy every criterion from the issue and say how it is met (test name, file, screenshot). -->

- [ ] Given … when … then … — met by …

## Checks run

<!-- Every command from the "Checks" section of AGENTS.md, with the honest result. -->

- [ ] `pnpm install --frozen-lockfile`
- [ ] `pnpm audit --audit-level high`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`

## Manual checks left for the owner

<!-- Things that cannot be verified automatically, e.g. on a real device. Write "None" if there are none. -->

## Deployment impact

<!-- New migration, env var, bucket, function or service? Then docs/deploy.md and .env.example are updated in this PR. Otherwise "None". -->
