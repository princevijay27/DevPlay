"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AudioLines,
  Gamepad2,
  Home,
  ListTodo,
  Settings,
  Trophy,
  UserRound
} from "lucide-react";

import { cn } from "@devflow/ui";

const links = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/voice-log", label: "VoiceLog", icon: AudioLines },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/standup", label: "Standup", icon: UserRound },
  { href: "/play", label: "DevPlay", icon: Gamepad2 },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-6 md:block">
      <div className="mb-8 px-3">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-muted)]">DevFlow</p>
        <h2 className="mt-2 text-xl font-semibold">Workspace</h2>
      </div>
      <nav className="space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href === "/play" && pathname.startsWith("/play"));

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-foreground)]"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
