# 0002. Keep Phase 1 local-only without a database

- Status: Accepted
- Date: 2026-11-19

## Context

Phase 1 needs local human-vs-computer and same-device human-vs-human gameplay, not accounts or online persistence.

## Decision

Do not add PostgreSQL, Supabase, or any backend database in Phase 1.

## Consequences

Development is simpler, there are no secrets, and the app can run locally with minimal setup. Online multiplayer and accounts can be evaluated in a later phase.
