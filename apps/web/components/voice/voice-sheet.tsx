"use client";

import { Mic, X } from "lucide-react";
import { useEffect, useRef } from "react";

import { VoiceCapturePanel } from "./voice-capture-panel";
import { Button } from "../ui/button";

export function VoiceSheet({
  open,
  onOpenChange,
  mode,
  onModeChange,
  isListening,
  onBeginCapture,
  onStop,
  onReset,
  finalTranscript,
  interimTranscript,
  stream
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "push" | "toggle";
  onModeChange: (value: "push" | "toggle") => void;
  isListening: boolean;
  onBeginCapture: () => void;
  onStop: () => void;
  onReset: () => void;
  finalTranscript: string;
  interimTranscript: string;
  stream: MediaStream | null;
}) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onOpenChange, open]);

  return (
    <>
      <Button
        type="button"
        aria-label="Open voice capture sheet"
        className="fixed bottom-20 right-4 z-30 h-14 w-14 rounded-full px-0 shadow-lg md:hidden"
        onClick={() => onOpenChange(true)}
      >
        <Mic className="h-5 w-5" />
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/35 md:hidden">
          <button
            type="button"
            aria-label="Close voice capture sheet"
            className="absolute inset-0"
            onClick={() => onOpenChange(false)}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="voice-sheet-title"
            className="relative z-10 w-full rounded-t-[1.75rem] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 pb-6 pt-4 shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-[var(--color-border)]" />
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 id="voice-sheet-title" className="text-lg font-semibold">
                  Quick voice capture
                </h2>
                <p className="text-sm text-[var(--color-muted)]">Record without leaving the current mobile context.</p>
              </div>
              <Button
                ref={closeButtonRef}
                type="button"
                variant="ghost"
                aria-label="Close voice capture sheet"
                className="h-10 w-10 rounded-full px-0"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <VoiceCapturePanel
              mode={mode}
              onModeChange={onModeChange}
              isListening={isListening}
              onBeginCapture={onBeginCapture}
              onStop={onStop}
              onReset={onReset}
              finalTranscript={finalTranscript}
              interimTranscript={interimTranscript}
              stream={stream}
              compact
            />
          </section>
        </div>
      ) : null}
    </>
  );
}
