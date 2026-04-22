import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function GameComingSoon({
  title,
  description,
  icon: Icon
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="secondary">
          <Link href="/play">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to hub
          </Link>
        </Button>
        <Badge>{title}</Badge>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-surface-muted)]">
            <Icon className="h-5 w-5 text-[var(--color-primary)]" />
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-[var(--color-muted)]">
          <p>{description}</p>
          <p>This route exists now so the hub can behave like a real launcher while we wire challenge generation next.</p>
        </CardContent>
      </Card>
    </section>
  );
}
