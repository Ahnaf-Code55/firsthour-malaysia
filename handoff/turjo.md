# Turjo  @TRahman2414  (all security)

## Start here (paste this into your AI assistant)
> You are helping me, **Turjo**, build my part of FirstHour Malaysia with three teammates. Read, in order: `handoff/turjo.md` (my tasks), `handoff/CONTRACT.md` (shared types), `devpost/prd.md` (what the product does), `devpost/spec.md` (how it is built), `devpost/scope.md`. Code to review and harden is on `main`: `server/validate.ts`, `server/extract.ts`, the `/api/extract` endpoint in `vite.config.ts`, `src/lib/extract.ts`. You own `src/lib/image.ts` (screenshot limits, EXIF strip), `scripts/check-sources.mjs`, `SECURITY.md`, the CSP, secret scanning, and the final repo review. Work on a branch named `turjo/<topic>`, open a pull request to `main`, and do not edit files owned by someone else without asking. Run `npm install && npm test && npm run build` before every pull request. Every phone number and instruction in the app must come from a dated official source, never from AI.

Run it: `npm install`, then `VITE_FIXTURE=1 npm run dev` and press "Try the sample case". Your GitHub issues list the checkboxes below.

You own privacy, safe handling of evidence, and the final review. Dates are Malaysia time.

## Threat model and privacy  (due Oct 24)
- [ ] `SECURITY.md`: what we collect (nothing stored), where evidence goes, what the AI call sees, what can go wrong, and what we do about it. One page.
- [ ] A short plain-language "What we store" statement for the app (English; Rasha translates to Bangla).
- [ ] Rules for the team: no analytics, no third-party scripts, no logging of evidence, API key only on the server side, never in the client bundle.

## Controls  (due Oct 25)
- [ ] Upload handling: type and size limits, in memory only, strip image metadata (EXIF), nothing written to disk or sent anywhere in fixture mode. Tell Saif the limits for the UI.
- [ ] Rendering: no `dangerouslySetInnerHTML`; escape all user text; strict Content-Security-Policy header or meta tag.
- [ ] Prompt injection: tests with hostile evidence text ("ignore previous instructions", fake phone numbers). Pass condition: output is still schema-valid and **no number or step outside `data/*.json` ever appears in the plan**. Pair with Ahnaf on `extract.ts`.
- [ ] `scripts/check-sources.mjs`: fails the build if any step lacks a source URL or `retrievedOn`, or is older than 14 days.
- [ ] Dependency and secrets hygiene: `npm audit` clean or documented, lockfile committed, secret scan (gitleaks) in CI and as a pre-commit hook.

## Final review  (Oct 26, before the repo goes public)
- [ ] Scan the full git history for secrets, keys, personal data, real victim evidence. Check `.env`, `devpost/learner-profile.md` and local files are not tracked.
- [ ] Walk the demo once as an attacker: bad file, huge file, hostile text, offline mode.
- [ ] Written sign-off in a pull request comment. **The repo is not made public without it.**

## Done means
`SECURITY.md` merged, CI enforces the source and secret checks, hostile-input tests pass, history scan clean, sign-off posted.
