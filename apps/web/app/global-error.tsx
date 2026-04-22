"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[var(--color-background)] text-[var(--color-foreground)]">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-4 px-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">Unexpected error</p>
          <h1 className="text-3xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-[var(--color-muted)]">
            The error has been captured so we can investigate it. You can try the page again now.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-white"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
