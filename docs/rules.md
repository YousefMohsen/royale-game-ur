# Phase 1 rules (Finkel ruleset)

The rules engine lives in `lib/game.ts`. Where historical variants differ, Phase 1 uses these interpretations:

- Each player has 7 pieces and walks a 14-square path (steps 1–14). Position `0` means "not yet entered"; position `15` means "borne off".
- Steps 5–12 form the shared middle lane; steps 1–4 and 13–14 are private to each player.
- Roll: four binary dice, result 0–4 (a roll of 0 passes the turn).
- Rosettes (steps 4, 8, 14) are safe squares and grant an extra turn. A piece on the central rosette (step 8) cannot be captured, and an opponent cannot land on it.
- A piece cannot land on a square held by the same player's piece.
- Landing on an opponent piece on the shared lane (not on a rosette) captures it; it returns to the start.
- A piece must bear off with an exact roll (step 14 + 1 = 15). Overshooting is illegal.
- If a player rolls but has no legal move, the turn passes.
- The first player to bear off all 7 pieces wins.
- Player `one` moves first by default.
