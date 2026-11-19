# 0003. Use rule-based local AI only

- Status: Accepted
- Date: 2026-11-19

## Context

The owner does not want token costs or external LLM calls during gameplay.

## Decision

Implement computer moves with deterministic/local rule-based scoring code running in the app, without paid AI services or LLM calls.

## Consequences

Gameplay has no per-play AI cost, is testable, and works locally. AI difficulty may be improved later by refining heuristics rather than adding external services.
