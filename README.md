# DevFlow

DevFlow combines `VoiceLog` and `DevPlay` in a single monorepo built with Next.js, Fastify, PostgreSQL, Redis, Drizzle, and Clerk.

## Setup

1. Install prerequisites:
   - Node.js 22 LTS
   - pnpm 10+
   - Docker Desktop
2. Copy env vars:
   - `cp .env.example .env.local`
3. Install dependencies:
   - `pnpm install`
4. Start local infra:
   - `docker compose up -d`
5. Run database migrations:
   - `pnpm db:migrate`
6. Seed sample data:
   - `pnpm db:seed`
7. Start apps:
   - `pnpm dev`

## Scripts

- `pnpm dev` runs the web and API apps in parallel.
- `pnpm build` runs builds across the monorepo with Turborepo.
- `pnpm lint` runs linting across all workspaces.
- `pnpm type-check` runs TypeScript checks across all workspaces.
- `pnpm db:generate` creates Drizzle migrations.
- `pnpm db:migrate` applies Drizzle migrations.
- `pnpm db:seed` seeds local development data.
- `pnpm db:studio` opens Drizzle Studio.

## Architecture

- `apps/web`: Next.js 15 App Router frontend
- `apps/api`: Fastify API server
- `packages/db`: Drizzle schema, client, migrations, and seeds
- `packages/shared`: Cross-app types and validation
- `packages/ui`: Shared UI primitives
- `packages/ai`: Shared AI orchestration helpers

## Troubleshooting

- If `docker compose up -d` fails, verify Docker Desktop is running.
- If auth redirects loop, confirm Clerk redirect URLs include `http://localhost:3000`.
- If Drizzle cannot connect, confirm `DATABASE_URL` matches the Docker Postgres credentials.

## ADRs

Architectural decisions live in `docs/adr`.
