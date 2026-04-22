"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { VoiceErrorCode } from "@devflow/shared";
import { voiceTranscriptionResponseSchema } from "@devflow/shared";

type UseWhisperFallbackOptions = {
  getToken?: () => Promise<string | null>;
};

export function useWhisperFallback({ getToken }: UseWhisperFallbackOptions = {}) {
  const chunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<VoiceErrorCode>("none");
  const [stream, setStream] = useState<MediaStream | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof window.MediaRecorder !== "undefined";

  const reset = useCallback(() => {
    chunksRef.current = [];
    setFinalTranscript("");
    setError("none");
  }, []);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  const finalizeRecording = useCallback(async () => {
    const blob = new Blob(chunksRef.current, {
      type: mediaRecorderRef.current?.mimeType || "audio/webm"
    });

    if (!blob.size) {
      setError("no-speech");
      cleanupStream();
      return;
    }

    try {
      const formData = new FormData();
      formData.append("audio", blob, "voice.webm");

      const token = getToken ? await getToken() : null;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/voice/transcribe`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData
      });

      if (!response.ok) {
        setError(response.status === 401 ? "permission-denied" : "transcription-failed");
        cleanupStream();
        return;
      }

      const json = voiceTranscriptionResponseSchema.parse(await response.json());
      setFinalTranscript(json.transcript);
      setError("none");
    } catch (caughtError) {
      if (!navigator.onLine) {
        setError("offline");
      } else if (caughtError instanceof DOMException && caughtError.name === "NotAllowedError") {
        setError("permission-denied");
      } else {
        setError("transcription-failed");
      }
    } finally {
      cleanupStream();
    }
  }, [cleanupStream, getToken]);

  const start = useCallback(async () => {
    if (!isSupported) {
      setError("unsupported");
      return;
    }

    if (!navigator.onLine) {
      setError("offline");
      return;
    }

    try {
      reset();

      const nextStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = nextStream;
      setStream(nextStream);

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(nextStream, { mimeType });
      chunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setError("audio-capture");
        setIsListening(false);
      };

      recorder.onstop = () => {
        setIsListening(false);
        void finalizeRecording();
      };

      recorder.start();
      setIsListening(true);
    } catch (caughtError) {
      if (caughtError instanceof DOMException && caughtError.name === "NotAllowedError") {
        setError("permission-denied");
      } else {
        setError("mic-unavailable");
      }
      cleanupStream();
    }
  }, [cleanupStream, finalizeRecording, isSupported, reset]);

  const stop = useCallback(() => {
    if (!mediaRecorderRef.current) {
      return;
    }

    if (mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      cleanupStream();
    };
  }, [cleanupStream]);

  return {
    engine: "whisper" as const,
    transcript: finalTranscript,
    finalTranscript,
    interimTranscript: "",
    isListening,
    isSupported,
    error,
    stream,
    start,
    stop,
    reset
  };
}
