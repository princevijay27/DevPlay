# Risk Register

Review cadence: weekly

## How To Use

- Review every risk once per week during the project check-in.
- Update `Likelihood`, `Impact`, `Mitigation`, and `Status` when reality changes.
- Add newly discovered risks immediately instead of waiting for the next formal review.
- If a risk becomes active, link the mitigation work to a tracked issue or PR.

## Current Risks

| Risk ID | Risk | Likelihood | Impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- |
| R-01 | Web Speech API unsupported on target browsers, especially Firefox | Medium | High | Whisper API fallback with less than 500ms added latency. Detect on first load, switch automatically, and keep the support matrix current in `docs/voice-compat.md`. | Frontend Eng | Mitigation in progress |
| R-02 | AI parse accuracy drops below 90% for accented or fast speech | Medium | High | Whisper fallback plus manual correction UI. Tune prompts with edge cases and feed user corrections back into prompt updates. | Full Stack | Mitigation in progress |
| R-03 | Claude API rate limits during peak usage | Low | High | Use BullMQ for async work such as digests, retry 429s with exponential backoff, cache repeatable challenge types, and pre-warm if peak patterns emerge. | Backend Lead | Monitoring |
| R-04 | pgvector semantic search latency is too high | Low | Medium | Tune HNSW indexes, reduce embedding dimensions if needed, and keep hybrid keyword plus vector result merging available. | Backend Eng | Mitigation in progress |
| R-05 | Game challenges are not diverse enough and players see repeats | Medium | Medium | Track used challenges per session, instruct the agent to deduplicate, and seed the system with hand-written challenge examples. | Full Stack | Mitigation in progress |
| R-06 | Mobile microphone permission UX creates too much friction | High | Medium | Explain permissions during onboarding, test thoroughly on iOS Safari 17+ and Android Chrome, and always keep text input as a fallback. | Frontend Eng | Open |
| R-07 | Scope creep pushes the project beyond 8 weeks | Medium | Medium | Keep MVP scope fixed, move new ideas into the post-MVP backlog, and review scope weekly with product owning the final cut line. | Product Owner | Monitoring |
| R-08 | Clerk pricing becomes a problem at scale | Low | Low | Keep a self-hosted NextAuth alternative documented and maintain a clear migration path. | Backend Lead | Monitoring |
| R-09 | Sandboxed code execution for Code Golf creates a security risk | Low | High | Use `isolated-vm` for JavaScript, a Judge0 container for Python and Go, and enforce CPU, memory, network, and filesystem limits. Test with malicious payloads. | Backend Eng | Mitigation in progress |
| R-10 | Push notification deliverability is weak on iOS | High | Medium | Teach users that iOS web push requires an installed PWA on iOS 16.4+, and provide in-app notifications as the fallback. | Frontend Eng | Open |
| R-11 | Test coverage is too thin at launch and regressions reach production | Medium | High | Maintain E2E happy paths for voice and each game, tool-level integration tests, and a manual regression checklist for launch. | Full Stack | Monitoring |
| R-12 | Single point of failure from full-stack lead burnout on a solo build | Medium | High | Document the solo-developer path in the README, cut scope to Debug Hunt plus Binary Blitz for a solo MVP if needed, and extend the timeline to 10 to 12 weeks when required. | Product Owner | Monitoring |

## Weekly Review Notes

- Date:
- Attendees:
- Risks changed this week:
- New mitigations started:
- Risks closed:
- Risks escalated:
