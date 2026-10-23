# Turjo  @TRahman2414  (all security)

You own privacy, safe handling of evidence, and the final review. Dates are Malaysia time.

## Threat model and privacy  (due Oct 24)
- [ ] `SECURITY.md`: what we collect (nothing stored), where evidence goes, what the AI call sees, what can go wrong, and what we do about it. One page.
- [ ] A short plain-language "What we store" statement for the app (English; Rasha translates to Malay and Bangla).
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
