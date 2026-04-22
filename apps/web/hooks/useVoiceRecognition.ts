"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { VoiceErrorCode } from "@devflow/shared";

import { getSpeechRecognitionConstructor } from "../lib/voice/browser";

type UseVoiceRecognitionOptions = {
  continuous?: boolean;
  lang?: string;
};

function mapSpeechError(error: string): VoiceErrorCode {
  switch (error) {
    case "aborted":
      return "aborted";
    case "audio-capture":
      return "audio-capture";
    case "network":
      return "network";
    case "no-speech":
      return "no-speech";
    case "not-allowed":
    case "service-not-allowed":
      return "permission-denied";
    default:
      return "unknown";
  }
}

export function useVoiceRecognition({
  continuous = true,
  lang = "en-US"
}: UseVoiceRecognitionOptions = {}) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<VoiceErrorCode>("none");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const Recognition = getSpeechRecognitionConstructor();

    if (!Recognition) {
      setIsSupported(false);
      setError("unsupported");
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError("none");
    };

    recognition.onresult = (event) => {
      let nextFinal = finalTranscriptRef.current;
      let nextInterim = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (!result) {
          continue;
        }
        const transcript = result[0]?.transcript ?? "";

        if (result.isFinal) {
          nextFinal = `${nextFinal} ${transcript}`.trim();
        } else {
          nextInterim = `${nextInterim} ${transcript}`.trim();
        }
      }

      finalTranscriptRef.current = nextFinal;
      setFinalTranscript(nextFinal);
      setInterimTranscript(nextInterim);
    };

    recognition.onerror = (event) => {
      setError(mapSpeechError(event.error));
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsSupported(true);

    return () => {
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [continuous, lang]);

  const reset = useCallback(() => {
    finalTranscriptRef.current = "";
    setFinalTranscript("");
    setInterimTranscript("");
    setError("none");
  }, []);

  const start = useCallback(() => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      setError("unsupported");
      return;
    }

    try {
      reset();
      recognition.start();
    } catch (caughtError) {
      if (caughtError instanceof DOMException && caughtError.name === "InvalidStateError") {
        setError("busy");
        return;
      }

      setError("unknown");
    }
  }, [reset]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const transcript = useMemo(() => {
    return [finalTranscript, interimTranscript].filter(Boolean).join(" ").trim();
  }, [finalTranscript, interimTranscript]);

  return {
    engine: "web-speech" as const,
    transcript,
    finalTranscript,
    interimTranscript,
    isListening,
    isSupported,
    error,
    start,
    stop,
    reset
  };
}
