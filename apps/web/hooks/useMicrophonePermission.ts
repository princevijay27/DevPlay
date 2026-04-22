"use client";

import { useCallback, useEffect, useState } from "react";

import type { VoicePermissionState } from "@devflow/shared";

async function queryPermission(): Promise<VoicePermissionState> {
  if (typeof navigator === "undefined") {
    return "unknown";
  }

  if (!("permissions" in navigator) || typeof navigator.permissions.query !== "function") {
    return "unknown";
  }

  try {
    const status = await navigator.permissions.query({
      name: "microphone" as PermissionName
    });

    if (status.state === "granted" || status.state === "denied" || status.state === "prompt") {
      return status.state;
    }

    return "unknown";
  } catch {
    return "unknown";
  }
}

export function useMicrophonePermission() {
  const [permissionState, setPermissionState] = useState<VoicePermissionState>("unknown");

  const refresh = useCallback(async () => {
    const next = await queryPermission();
    setPermissionState(next);
    return next;
  }, []);

  const request = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionState("unsupported");
      return "unsupported" as const;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setPermissionState("granted");
      return "granted" as const;
    } catch (error) {
      const next =
        error instanceof DOMException && error.name === "NotAllowedError" ? "denied" : "unknown";
      setPermissionState(next);
      return next;
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!navigator.permissions?.query) {
      return;
    }

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    void navigator.permissions
      .query({ name: "microphone" as PermissionName })
      .then((status) => {
        if (cancelled) {
          return;
        }

        const handleChange = () => {
          if (status.state === "granted" || status.state === "denied" || status.state === "prompt") {
            setPermissionState(status.state);
          }
        };

        handleChange();
        status.addEventListener("change", handleChange);
        unsubscribe = () => status.removeEventListener("change", handleChange);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return {
    permissionState,
    refresh,
    request
  };
}
