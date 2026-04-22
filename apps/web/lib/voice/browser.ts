import type { VoiceEngine, VoiceErrorCode } from "@devflow/shared";

export function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

export function detectPreferredVoiceEngine(): VoiceEngine {
  if (typeof window === "undefined") {
    return "whisper";
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isFirefox = userAgent.includes("firefox");
  const recognition = getSpeechRecognitionConstructor();

  if (!recognition || isFirefox) {
    return "whisper";
  }

  return "web-speech";
}

export function getVoiceErrorMessage(error: VoiceErrorCode, engine: VoiceEngine): string {
  switch (error) {
    case "permission-denied":
      return "Microphone access is blocked. Re-enable it in your browser settings to keep using voice.";
    case "unsupported":
      return "This browser does not support native voice recognition, so DevFlow will use the Whisper fallback.";
    case "offline":
      return engine === "whisper"
        ? "Voice fallback needs an internet connection right now."
        : "You appear to be offline.";
    case "mic-unavailable":
    case "audio-capture":
      return "No working microphone was detected. Check your mic and try again.";
    case "network":
      return "Voice recognition hit a network issue. Please try again.";
    case "no-speech":
      return "I didn’t hear speech that time. Try again a little closer to the mic.";
    case "busy":
      return "Voice recognition is already running in another session.";
    case "transcription-failed":
      return "The audio could not be transcribed right now. Please try again.";
    case "aborted":
      return "Voice capture was stopped before the transcript was finalized.";
    default:
      return "Voice capture ran into a problem. Please try again.";
  }
}

export function getMicrophoneRecoverySteps() {
  if (typeof window === "undefined") {
    return ["Open your browser site settings and allow microphone access for this app."];
  }

  const userAgent = window.navigator.userAgent.toLowerCase();

  if (userAgent.includes("chrome") || userAgent.includes("edg")) {
    return [
      "Open the lock icon in the address bar.",
      "Set Microphone to Allow.",
      "Reload the page and try voice again."
    ];
  }

  if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
    return [
      "Open Safari settings for this site.",
      "Allow microphone access for the page.",
      "Reload the page and try voice again."
    ];
  }

  if (userAgent.includes("firefox")) {
    return [
      "Open the permissions panel for this site.",
      "Allow microphone access.",
      "Reload the page and DevFlow will use Whisper fallback."
    ];
  }

  return [
    "Open your browser site settings.",
    "Allow microphone access for this page.",
    "Reload the page and try voice again."
  ];
}

export function isVoiceOfflineBlocked(engine: VoiceEngine) {
  return typeof navigator !== "undefined" && !navigator.onLine && engine === "whisper";
}
