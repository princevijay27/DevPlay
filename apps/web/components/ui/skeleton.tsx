import { cn } from "@devflow/ui";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-[var(--color-surface-muted)]", className)} />;
}
