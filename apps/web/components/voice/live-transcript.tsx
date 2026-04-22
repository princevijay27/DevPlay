"use client";

import { useEffect, useRef } from "react";

import { cn } from "@devflow/ui";

export function LiveTranscript({
  finalTranscript,
  interimTranscript,
  isListening
}: {
  finalTranscript: string;
  interimTranscript: string;
  isListening: boolean;
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    viewport.scrollTop = viewport.scrollHeight;
  }, [finalTranscript, interimTranscript]);

  return (
    <div
      ref={viewportRef}
      aria-live="polite"
      aria-atomic="false"
      role="status"
      className={cn(
        "max-h-52 min-h-40 overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 text-sm leading-7",
        !finalTranscript && !interimTranscript && "text-[var(--color-muted)]"
      )}
    >
      {finalTranscript || interimTranscript ? (
        <p>
          {finalTranscript ? <span className="text-[var(--color-foreground)]">{finalTranscript} </span> : null}
          {interimTranscript ? <span className="text-[var(--color-muted)]">{interimTranscript}</span> : null}
        </p>
      ) : (
        <p>{isListening ? "Listening for speech..." : "Your live transcript will appear here."}</p>
      )}
    </div>
  );
}
