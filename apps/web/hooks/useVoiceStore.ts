"use client";

import { create } from "zustand";

type VoiceState = {
  engine: "web-speech" | "whisper" | null;
  isRecording: boolean;
  transcript: string;
  interimTranscript: string;
  lastError: string | null;
  sidebarOpen: boolean;
  setEngine: (value: VoiceState["engine"]) => void;
  setRecording: (value: boolean) => void;
  setTranscript: (value: string) => void;
  setInterimTranscript: (value: string) => void;
  setLastError: (value: string | null) => void;
  setSidebarOpen: (value: boolean) => void;
};

export const useVoiceStore = create<VoiceState>((set) => ({
  engine: null,
  isRecording: false,
  transcript: "",
  interimTranscript: "",
  lastError: null,
  sidebarOpen: false,
  setEngine: (value) => set({ engine: value }),
  setRecording: (value) => set({ isRecording: value }),
  setTranscript: (value) => set({ transcript: value }),
  setInterimTranscript: (value) => set({ interimTranscript: value }),
  setLastError: (value) => set({ lastError: value }),
  setSidebarOpen: (value) => set({ sidebarOpen: value })
}));
