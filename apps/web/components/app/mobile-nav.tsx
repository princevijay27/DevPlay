"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AudioLines, Gamepad2, Home, ListTodo, Trophy } from "lucide-react";

import { cn } from "@devflow/ui";

const links = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/voice-log", label: "Voice", icon: AudioLines },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/play", label: "Play", icon: Gamepad2 },
  { href: "/leaderboard", label: "Ranks", icon: Trophy }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[color:color-mix(in_oklab,var(--color-surface)_92%,transparent)] backdrop-blur md:hidden"
    >
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href === "/play" && pathname.startsWith("/play"));

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors",
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
      </div>
    </nav>
  );
}
