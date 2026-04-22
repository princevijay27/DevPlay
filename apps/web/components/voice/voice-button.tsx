"use client";

import { Mic, MicOff } from "lucide-react";
import { useEffect, useRef } from "react";

import { cn } from "@devflow/ui";

type VoiceButtonProps = {
  mode: "push" | "toggle";
  isListening: boolean;
  disabled?: boolean;
  onStart: () => void;
  onStop: () => void;
};

export function VoiceButton({
  mode,
  isListening,
  disabled = false,
  onStart,
  onStop
}: VoiceButtonProps) {
  const spaceActiveRef = useRef(false);

  useEffect(() => {
    if (mode !== "push") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable === true;

      if (event.code !== "Space" || disabled || isEditable || spaceActiveRef.current) {
        return;
      }

      event.preventDefault();
      spaceActiveRef.current = true;
      onStart();
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code !== "Space" || disabled || !spaceActiveRef.current) {
        return;
      }

      event.preventDefault();
      spaceActiveRef.current = false;
      onStop();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [disabled, mode, onStart, onStop]);

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={isListening}
      onClick={
        mode === "toggle"
          ? () => {
              if (isListening) {
                onStop();
              } else {
                onStart();
              }
            }
          : undefined
      }
      onMouseDown={mode === "push" ? onStart : undefined}
      onMouseUp={mode === "push" ? onStop : undefined}
      onMouseLeave={mode === "push" && isListening ? onStop : undefined}
      onTouchStart={mode === "push" ? onStart : undefined}
      onTouchEnd={mode === "push" ? onStop : undefined}
      className={cn(
        "flex h-28 w-28 items-center justify-center rounded-full border text-white shadow-lg transition-transform active:scale-95",
        isListening
          ? "border-red-300 bg-red-500"
          : "border-[var(--color-border)] bg-[var(--color-primary)]",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      {isListening ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
    </button>
  );
}
