"use client";

import { create } from "zustand";

type VoiceState = {
  isRecording: boolean;
  sidebarOpen: boolean;
  setRecording: (value: boolean) => void;
  setSidebarOpen: (value: boolean) => void;
};

export const useVoiceStore = create<VoiceState>((set) => ({
  isRecording: false,
  sidebarOpen: false,
  setRecording: (value) => set({ isRecording: value }),
  setSidebarOpen: (value) => set({ sidebarOpen: value })
}));
