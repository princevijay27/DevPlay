"use client";

import { useAuth } from "@clerk/nextjs";
import type { VoicePermissionState } from "@devflow/shared";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useMicrophonePermission } from "../../hooks/useMicrophonePermission";
import { useVoice } from "../../hooks/useVoice";
import { useVoiceStore } from "../../hooks/useVoiceStore";
import { getVoiceErrorMessage } from "../../lib/voice/browser";
import { Badge } from "../ui/badge";
import { MicrophonePermissionModal } from "./microphone-permission-modal";
import { VoiceCapturePanel } from "./voice-capture-panel";
import { VoiceSheet } from "./voice-sheet";
import { VoiceStatusPanel } from "./voice-status-panel";

export function VoiceWorkspace() {
  const { getToken } = useAuth();
  const { permissionState, request, refresh } = useMicrophonePermission();
  const {
    engine,
    error,
    fallbackActive,
    finalTranscript,
    interimTranscript,
    isListening,
    reset,
    start,
    stop,
    stream
  } = useVoice({
    continuous: true,
    getToken
  });
  const [mode, setMode] = useState<"push" | "toggle">("push");
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [voiceSheetOpen, setVoiceSheetOpen] = useState(false);
  const setEngine = useVoiceStore((state) => state.setEngine);
  const setRecording = useVoiceStore((state) => state.setRecording);
  const setTranscript = useVoiceStore((state) => state.setTranscript);
  const setInterimTranscript = useVoiceStore((state) => state.setInterimTranscript);
  const setLastError = useVoiceStore((state) => state.setLastError);

  useEffect(() => {
    setEngine(engine);
    setRecording(isListening);
    setTranscript(finalTranscript);
    setInterimTranscript(interimTranscript);
    setLastError(error === "none" ? null : error);
  }, [
    engine,
    error,
    finalTranscript,
    interimTranscript,
    isListening,
    setEngine,
    setInterimTranscript,
    setLastError,
    setRecording,
    setTranscript
  ]);

  useEffect(() => {
    if (error === "none" || error === "aborted") {
      return;
    }

    toast.error(getVoiceErrorMessage(error, engine));
  }, [engine, error]);

  const beginCapture = useCallback(async () => {
    const nextPermission = permissionState === "unknown" ? await refresh() : permissionState;

    if (nextPermission !== "granted") {
      setPermissionModalOpen(true);
      return;
    }

    start();
  }, [permissionState, refresh, start]);

  const handlePermissionContinue = useCallback(async () => {
    const nextPermission = await request();

    if (nextPermission === "granted") {
      setPermissionModalOpen(false);
      start();
    }
  }, [request, start]);

  const handleAfterTranscript = useCallback(
    (permission: VoicePermissionState) => {
      if (!finalTranscript || isListening) {
        return;
      }

      toast.success("Transcript captured", {
        description: permission === "granted" ? "VoiceLog is ready for the parse step next." : undefined
      });
    },
    [finalTranscript, isListening]
  );

  useEffect(() => {
    handleAfterTranscript(permissionState);
  }, [finalTranscript, handleAfterTranscript, permissionState]);

  const openMicGuidance = useCallback(() => {
    setPermissionModalOpen(true);
  }, []);

  return (
    <>
      <section className="space-y-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>VoiceLog</Badge>
            <Badge variant={fallbackActive ? "accent" : "default"}>
              {fallbackActive ? "Whisper fallback" : "Web Speech"}
            </Badge>
            <Badge variant={permissionState === "denied" ? "destructive" : "default"}>
              Mic: {permissionState}
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Capture tasks by voice</h1>
          <p className="max-w-3xl text-[var(--color-muted)]">
            This first Phase 2 slice handles browser capability detection, permission recovery, real-time transcripts,
            and automatic fallback to Whisper when native speech is not the right fit.
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="hidden md:block">
            <VoiceCapturePanel
              mode={mode}
              onModeChange={setMode}
              isListening={isListening}
              onBeginCapture={() => void beginCapture()}
              onStop={stop}
              onReset={reset}
              finalTranscript={finalTranscript}
              interimTranscript={interimTranscript}
              stream={stream}
            />
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:hidden">
            <p className="text-sm font-medium">Mobile voice capture</p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Use the floating microphone button to open the bottom sheet and record without losing context.
            </p>
          </div>

          <VoiceStatusPanel fallbackActive={fallbackActive} onReviewMic={openMicGuidance} />
        </div>
      </section>

      <VoiceSheet
        open={voiceSheetOpen}
        onOpenChange={setVoiceSheetOpen}
        mode={mode}
        onModeChange={setMode}
        isListening={isListening}
        onBeginCapture={() => void beginCapture()}
        onStop={stop}
        onReset={reset}
        finalTranscript={finalTranscript}
        interimTranscript={interimTranscript}
        stream={stream}
      />

      <MicrophonePermissionModal
        open={permissionModalOpen}
        permissionState={permissionState}
        onClose={() => setPermissionModalOpen(false)}
        onContinue={handlePermissionContinue}
      />
    </>
  );
}
