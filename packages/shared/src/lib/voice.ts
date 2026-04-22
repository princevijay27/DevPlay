import { z } from "zod";

export const voiceEngineSchema = z.enum(["web-speech", "whisper"]);
export type VoiceEngine = z.infer<typeof voiceEngineSchema>;

export const voicePermissionStateSchema = z.enum([
  "unknown",
  "prompt",
  "granted",
  "denied",
  "unsupported"
]);
export type VoicePermissionState = z.infer<typeof voicePermissionStateSchema>;

export const voiceErrorCodeSchema = z.enum([
  "none",
  "unsupported",
  "permission-denied",
  "mic-unavailable",
  "offline",
  "network",
  "no-speech",
  "audio-capture",
  "aborted",
  "busy",
  "transcription-failed",
  "unknown"
]);
export type VoiceErrorCode = z.infer<typeof voiceErrorCodeSchema>;

export const voiceTranscriptionResponseSchema = z.object({
  transcript: z.string(),
  engine: voiceEngineSchema
});
export type VoiceTranscriptionResponse = z.infer<typeof voiceTranscriptionResponseSchema>;
