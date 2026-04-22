"use client";

import { useAuth } from "@clerk/nextjs";
import type { VoicePermissionState } from "@devflow/shared";
import { MicVocal, Radio, WandSparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useMicrophonePermission } from "../../hooks/useMicrophonePermission";
import { useVoice } from "../../hooks/useVoice";
import { useVoiceStore } from "../../hooks/useVoiceStore";
import { getVoiceErrorMessage } from "../../lib/voice/browser";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LiveTranscript } from "./live-transcript";
import { MicrophonePermissionModal } from "./microphone-permission-modal";
import { VoiceButton } from "./voice-button";
import { VolumeMeter } from "./volume-meter";

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
          <h1 className="text-3xl font-semibold">Capture tasks by voice</h1>
          <p className="max-w-3xl text-[var(--color-muted)]">
            This first Phase 2 slice handles browser capability detection, permission recovery, real-time transcripts,
            and automatic fallback to Whisper when native speech is not the right fit.
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <CardHeader>
              <CardTitle>Voice capture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <Button variant={mode === "push" ? "default" : "secondary"} onClick={() => setMode("push")}>
                  Push to talk
                </Button>
                <Button variant={mode === "toggle" ? "default" : "secondary"} onClick={() => setMode("toggle")}>
                  Toggle
                </Button>
                <Button variant="ghost" onClick={reset}>
                  Clear
                </Button>
              </div>

              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[var(--color-border)] px-6 py-8">
                <VoiceButton mode={mode} isListening={isListening} onStart={() => void beginCapture()} onStop={stop} />
                <p className="text-sm text-[var(--color-muted)]">
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
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current engine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-[var(--color-muted)]">
                <div className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface-muted)] p-4">
                  {fallbackActive ? (
                    <WandSparkles className="h-5 w-5 text-[var(--color-accent)]" />
                  ) : (
                    <Radio className="h-5 w-5 text-[var(--color-primary)]" />
                  )}
                  <div>
                    <p className="font-medium text-[var(--color-foreground)]">
                      {fallbackActive ? "Whisper fallback active" : "Native Web Speech active"}
                    </p>
                    <p>
                      {fallbackActive
                        ? "This path is used for Firefox, unsupported browsers, or repeated native recognition failures."
                        : "This is the lowest-latency path when the browser exposes speech recognition."}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--color-border)] p-4">
                  <p className="mb-2 font-medium text-[var(--color-foreground)]">Failure handling</p>
                  <ul className="space-y-2">
                    <li>No raw browser errors reach the user.</li>
                    <li>Denied permission opens recovery guidance instead of failing silently.</li>
                    <li>Whisper path warns when the browser is offline.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's next</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[var(--color-muted)]">
                <div className="flex items-start gap-3">
                  <MicVocal className="mt-0.5 h-4 w-4 text-[var(--color-primary)]" />
                  <p>The parse endpoint and streaming agent response are the next vertical slice after this input layer.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => setPermissionModalOpen(true)}>
                    Review mic guidance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <MicrophonePermissionModal
        open={permissionModalOpen}
        permissionState={permissionState}
        onClose={() => setPermissionModalOpen(false)}
        onContinue={handlePermissionContinue}
      />
    </>
  );
}
