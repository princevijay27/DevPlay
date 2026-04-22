import { MicVocal, Radio, WandSparkles } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function VoiceStatusPanel({
  fallbackActive,
  onReviewMic
}: {
  fallbackActive: boolean;
  onReviewMic: () => void;
}) {
  return (
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
            <Button variant="secondary" onClick={onReviewMic}>
              Review mic guidance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
