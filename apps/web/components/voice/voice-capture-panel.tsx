"use client";

import { LiveTranscript } from "./live-transcript";
import { VoiceButton } from "./voice-button";
import { VolumeMeter } from "./volume-meter";
import { Button } from "../ui/button";

export function VoiceCapturePanel({
  mode,
  onModeChange,
  isListening,
  onBeginCapture,
  onStop,
  onReset,
  finalTranscript,
  interimTranscript,
  stream,
  compact = false
}: {
  mode: "push" | "toggle";
  onModeChange: (value: "push" | "toggle") => void;
  isListening: boolean;
  onBeginCapture: () => void;
  onStop: () => void;
  onReset: () => void;
  finalTranscript: string;
  interimTranscript: string;
  stream: MediaStream | null;
  compact?: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Button variant={mode === "push" ? "default" : "secondary"} onClick={() => onModeChange("push")}>
          Push to talk
        </Button>
        <Button variant={mode === "toggle" ? "default" : "secondary"} onClick={() => onModeChange("toggle")}>
          Toggle
        </Button>
        <Button variant="ghost" onClick={onReset}>
          Clear
        </Button>
      </div>

      <div
        className={
          compact
            ? "flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[var(--color-border)] px-4 py-6"
            : "flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[var(--color-border)] px-6 py-8"
        }
      >
        <VoiceButton
          mode={mode}
          isListening={isListening}
          onStart={onBeginCapture}
          onStop={onStop}
          ariaLabel={
            mode === "push"
              ? "Hold to record voice"
              : isListening
                ? "Stop recording voice"
                : "Start recording voice"
          }
        />
        <p className="text-center text-sm text-[var(--color-muted)]">
          {mode === "push"
            ? "Hold the button or the Space bar to record."
            : "Tap once to start recording and again to stop."}
        </p>
        <VolumeMeter stream={stream} />
      </div>

      <LiveTranscript
        finalTranscript={finalTranscript}
        interimTranscript={interimTranscript}
        isListening={isListening}
      />
    </div>
  );
}
