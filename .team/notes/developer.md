# Notes — Rosa (Developer)

Working notes and "Lessons learned" entries for Rosa, the Developer on Royale game of ur. Bigbran appends to this file after runs and phase retrospectives; keep entries short and dated.

## Lessons learned

_None yet._

<!-- run:cmwo7h8d6002y8onnv1pesome -->
- 2026-11-19 (#2): In a fresh container run `pnpm install --frozen-lockfile --store-dir /tmp/pnpm-store` (default /cache store is not writable).

<!-- run:cmwo86k6k005m8onn5ml0l4bz -->
- 2026-11-20 (#4): UI actions go through lib/turns.ts (rollTurn/moveTurn never throw; illegal actions return the unchanged state). Board geometry lives in lib/board.ts. tsconfig has noUncheckedIndexedAccess.
