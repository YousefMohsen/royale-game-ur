---
description: Implement (or resume) one GitHub issue the way the Bigbran developer does
argument-hint: <issue number>
---

You are the developer on Royale game of ur. Implement issue #$ARGUMENTS of YousefMohsen/royale-game-ur.

## 1. Get context before writing code

- Read `AGENTS.md`, the ADRs in `docs/adr/` that touch this area, `.team/charter.md` and `.team/notes/developer.md`.
- Read the issue and **all** its comments (`gh issue view $ARGUMENTS --comments`). A `Decision:` comment overrides the issue text; an `Answer:` answers a `Blocked:`.
- Read the tracking issue (#9) and the merged PRs of the issues under "Blocked by"; reuse their patterns.
- Check that every issue under "Blocked by" is closed. If not, stop and say so.

## 2. Start fresh or resume

- Fresh: create `issue-$ARGUMENTS-<short-slug>` from the up-to-date `main`.
- Resume: check out the existing branch, read the newest `Handoff:` and every later comment, **run the checks to verify the stated state**, then continue from "Next steps".

## 3. Implement exactly the issue's scope

- Respect "Out of scope", the project rules and the owner-only areas in `AGENTS.md`. Never edit protected or do-not-touch paths.
- Search before adding a helper or component; never leave two ways to do the same thing.
- Add an ADR for a significant adopted decision. No new dependency that is not on the approved list in `AGENTS.md`.
- Commit in small working steps; every commit message references `#$ARGUMENTS`.

## 4. If stuck, hand off instead of guessing

Stuck means something only the owner can provide (a secret, a product or design decision, external access, a contradiction between documents, an open blocker). A failing test is not stuck. Finish everything that does not depend on the missing thing, push, open a draft PR with `Part of #$ARGUMENTS`, then post:

```
Handoff:
Status: PARTIAL | BLOCKED
Branch: issue-<n>-<slug> · Draft PR: #<pr> · Last commit: <sha>
Done:
- …
Current state: <check results, acceptance criteria met / open>
Next steps:
1. …
Decisions and assumptions:
- …
Gotchas:
- …
```

and one comment per missing thing:

```
Blocked:
Type: SECRET | DECISION | ACCESS | CONTRADICTION | DEPENDENCY
Need: <what exactly>
Why: <why the work cannot continue without it>
Options:
1. <option> (recommended)
2. <option>
How to provide: <for secrets: name the env var and ask the owner to set it in Bigbran — never ask for the value>
Ready when: <observable condition>
```

## 5. Verify

- Go through every acceptance criterion and show how it is met (test name, file, screenshot).
- Run every command under "Checks" in `AGENTS.md` and report failures honestly.
- Open the PR with `Closes #$ARGUMENTS` using the PR template; list the manual checks left for the owner.
