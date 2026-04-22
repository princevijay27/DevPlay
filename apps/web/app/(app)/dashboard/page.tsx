import { Activity, BrainCircuit, Gamepad2, ListTodo } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

const cards = [
  {
    icon: ListTodo,
    title: "Tasks",
    value: "10 seeded",
    caption: "Priority, deadline, and semantic search ready to wire."
  },
  {
    icon: Activity,
    title: "Standups",
    value: "3 recent",
    caption: "Digest storage and per-day uniqueness modeled in the database."
  },
  {
    icon: Gamepad2,
    title: "DevPlay",
    value: "4 game modes",
    caption: "Challenge and leaderboard tables are scaffolded for Phase 3."
  },
  {
    icon: BrainCircuit,
    title: "AI",
    value: "Claude Sonnet",
    caption: "Shared AI package is in place for agent logic and orchestration."
  }
];

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-muted)]">Dashboard</p>
        <h1 className="text-3xl font-semibold">Foundation sprint workspace</h1>
        <p className="max-w-2xl text-[var(--color-muted)]">
          This shell is ready for the VoiceLog task flow, auth-protected data fetching, and the DevPlay game hub.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, title, value, caption }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <CardTitle className="text-base">{title}</CardTitle>
              <Icon className="h-5 w-5 text-[var(--color-primary)]" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{value}</p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{caption}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
