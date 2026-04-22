"use client";

import { useEffect, useMemo, useState } from "react";

import type { VoiceEngine, VoiceErrorCode } from "@devflow/shared";

import { detectPreferredVoiceEngine, isVoiceOfflineBlocked } from "../lib/voice/browser";
import { useWhisperFallback } from "./useWhisperFallback";
import { useVoiceRecognition } from "./useVoiceRecognition";

type UseVoiceOptions = {
  continuous?: boolean;
  getToken?: () => Promise<string | null>;
  lang?: string;
};

export function useVoice({ continuous = true, getToken, lang = "en-US" }: UseVoiceOptions = {}) {
  const [engine, setEngine] = useState<VoiceEngine>("whisper");
  const [speechErrorCount, setSpeechErrorCount] = useState(0);
  const speech = useVoiceRecognition({ continuous, lang });
  const whisper = useWhisperFallback({ getToken });

  useEffect(() => {
    setEngine(detectPreferredVoiceEngine());
  }, []);

  useEffect(() => {
    if (speech.error !== "none" && speech.error !== "aborted") {
      setSpeechErrorCount((value) => value + 1);
    }
  }, [speech.error]);

  useEffect(() => {
    if (speechErrorCount >= 3) {
      setEngine("whisper");
    }
  }, [speechErrorCount]);

  const active = engine === "web-speech" ? speech : whisper;
  const error: VoiceErrorCode =
    engine === "whisper" && isVoiceOfflineBlocked(engine) ? "offline" : active.error;

  return useMemo(
    () => ({
      engine,
      transcript: active.transcript,
      finalTranscript: active.finalTranscript,
      interimTranscript: active.interimTranscript,
      isListening: active.isListening,
      isSupported: active.isSupported,
      error,
      stream: "stream" in active ? active.stream : null,
      fallbackActive: engine === "whisper",
      speechErrorCount,
      setEngine,
      start: active.start,
      stop: active.stop,
      reset: active.reset
    }),
    [active, engine, error, speechErrorCount]
  );
}
