# Voice Compatibility Matrix

Last reviewed: April 22, 2026

## Summary

DevFlow should prefer native `SpeechRecognition` when the browser exposes it and fall back to the server-backed Whisper path everywhere else.

## Support Matrix

| Browser | Native Web Speech recognition | Decision in DevFlow | Notes |
| --- | --- | --- | --- |
| Chrome 120+ | Yes | Use Web Speech first | Fastest path. Recognition may still be server-backed by the browser. |
| Safari 17+ | Yes | Use Web Speech first | Treat as supported, but keep fallback available after repeated runtime errors. |
| Edge latest | Yes in current Chromium-based builds | Use Web Speech first | Constructor/start support is present in current support tables. |
| Firefox latest | No for normal users | Use Whisper fallback | Firefox still lists speech recognition as disabled by default. |
| iOS Safari 17+ | Yes | Use Web Speech first | Keep fallback ready for device-specific permission or runtime failures. |
| Android Chrome latest | Yes | Use Web Speech first | Same logic as desktop Chrome. |

## Fallback Rule

1. If `SpeechRecognition` or `webkitSpeechRecognition` is missing, use Whisper immediately.
2. If the browser is Firefox, use Whisper immediately.
3. If Web Speech throws recoverable runtime errors 3 times in one session, switch the session to Whisper.
4. If microphone permission is denied, show recovery instructions instead of retrying silently.
5. If the active path is Whisper and the user is offline, show a friendly offline error before recording.

## Practical Notes

- Native speech is lower-latency, so it is the default when available.
- Browser implementations still vary, so feature detection matters more than brand detection for most cases.
- Firefox is the one explicit exception: route it to Whisper by default.
- Permission state must be surfaced in UI before the user starts speaking, not after failure.

## Sources Used

- MDN: `SpeechRecognition` documentation and compatibility notes
- Can I Use: `SpeechRecognition` constructor/start support tables
