import Link from "next/link";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const features = [
  {
    title: "VoiceLog",
    description: "Capture voice, convert it into tasks, and keep daily standups grounded in real work."
  },
  {
    title: "DevPlay",
    description: "Train engineering instincts with game loops built around debugging, regex, binary, and golf."
  },
  {
    title: "Shared Platform",
    description: "One auth layer, one database, one API, and a workflow the team can ship on confidently."
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-16">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-muted)]">DevFlow</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-tight">
            Build the developer operating system for voice capture and skill practice.
          </h1>
          <p className="max-w-2xl text-lg text-[var(--color-muted)]">
            Phase 1 establishes the shared platform: auth, API, database, local infra, and the app shell the
            rest of the roadmap can move through quickly.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/sign-up">Create account</Link>
            </Button>
          </div>
        </div>
        <Card className="border border-[var(--color-border)]">
          <CardHeader>
            <CardTitle>Phase 1 Focus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[var(--color-muted)]">
            <p>Monorepo foundations with pnpm and Turborepo.</p>
            <p>Local Docker services for Postgres 16 + pgvector + Redis 7.</p>
            <p>Clerk auth flow, Fastify API, and a reusable frontend shell.</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--color-muted)]">{feature.description}</CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
