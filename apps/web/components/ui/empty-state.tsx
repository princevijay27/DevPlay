import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "./card";

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  cta
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
  cta?: ReactNode;
}) {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-muted)]">
          <Icon className="h-5 w-5 text-[var(--color-primary)]" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-[var(--color-muted)]">
        <p>{description}</p>
        {cta}
      </CardContent>
    </Card>
  );
}
