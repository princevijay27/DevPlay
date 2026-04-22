"use client";

import type { VoicePermissionState } from "@devflow/shared";
import { AlertTriangle, Mic } from "lucide-react";

import { getMicrophoneRecoverySteps } from "../../lib/voice/browser";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function MicrophonePermissionModal({
  open,
  permissionState,
  onClose,
  onContinue
}: {
  open: boolean;
  permissionState: VoicePermissionState;
  onClose: () => void;
  onContinue: () => void | Promise<void>;
}) {
  if (!open) {
    return null;
  }

  const recoverySteps = getMicrophoneRecoverySteps();
  const denied = permissionState === "denied";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-muted)]">
            {denied ? (
              <AlertTriangle className="h-5 w-5 text-[var(--color-destructive)]" />
            ) : (
              <Mic className="h-5 w-5 text-[var(--color-primary)]" />
            )}
          </div>
          <CardTitle>{denied ? "Microphone access is blocked" : "Allow microphone access"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-[var(--color-muted)]">
          <p>
            {denied
              ? "DevFlow needs mic access to capture voice tasks. You can fix this quickly in your browser settings."
              : "VoiceLog works best when you can see the transcript before the AI acts on it. Allow mic access to start recording."}
          </p>
          {denied ? (
            <ol className="list-decimal space-y-2 pl-5">
              {recoverySteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void onContinue()}>{denied ? "Try again" : "Continue"}</Button>
            <Button variant="secondary" onClick={onClose}>
              Not now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
