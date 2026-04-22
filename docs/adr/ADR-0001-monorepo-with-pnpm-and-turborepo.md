# ADR-0001: Monorepo With pnpm + Turborepo

## Status

Accepted

## Context

DevFlow contains two deployable applications and multiple shared packages. We need fast local iteration, shared typing across boundaries, and consistent CI behavior.

## Decision

Use a pnpm workspace monorepo managed by Turborepo.

## Alternatives Considered

- Separate repos for web and API
- Single app repo with internal folders but no package boundaries
- Nx instead of Turborepo

## Consequences

- Shared packages become easy to version and consume internally.
- Incremental task pipelines reduce repeated work in CI and local development.
- Repository setup is more opinionated up front, but that cost is paid once.
