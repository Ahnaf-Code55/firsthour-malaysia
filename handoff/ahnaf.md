# Ahnaf (lead)  @Ahnaf-Code55

You own the plan, the logic, the merging and the submission. Dates are Malaysia time.

## Plan documents  (due Oct 24)
- [ ] `devpost/scope.md`, `prd.md`, `spec.md` via the Learn skills, committed to `main`. The spec makes `handoff/CONTRACT.md` final.
- [ ] Turn each person's file in this folder into GitHub issues (one per checkbox group) and assign them.

## Core logic  (due Oct 25)
- [ ] `src/lib/plan.ts`: `buildPlan(facts, answers, steps)` pure function. Filters steps by payment and window, sorts by priority, fills the script. Unit tests for: bank transfer under 1 h, e-wallet, card, cash deposit, "over 24 h" fallback, unknown payment.
- [ ] `src/lib/scan.ts`: `scanMessage(text, lang)` returns red flags from `data/recovery-rules.json`. Tests include the fee-for-recovery message from the demo.
- [ ] `src/lib/extract.ts`: `extractFacts(evidenceText, images?)`. **Fixture mode first** (returns the canned facts for the demo scenario). AI mode second, behind a flag, output validated against the `Facts` schema; evidence text is data, never instructions (work with Turjo on injection tests).
- [ ] CI: lint, type check, unit tests, `scripts/check-sources.mjs` on every pull request.

## Integration  (Oct 25 to Oct 26)
- [ ] Review and merge pull requests daily. Keep `main` always demo-able.
- [ ] End-to-end run of the demo scenario in fixture mode at the end of Oct 25.
- [ ] Code freeze **Oct 26 14:00**.

## Submission  (Oct 26)
- [ ] Final check against the event requirements: new project, `scope.md`, `prd.md`, `spec.md` in the public repo, 1 to 3 minute video, short description.
- [ ] After Turjo's sign-off, make the repo **public**.
- [ ] Submit on Devpost as the Representative **before Oct 26 23:00 MYT** (deadline Oct 27 05:00 MYT). Add all teammates to the project.
- [ ] Agree the prize split in writing with the team.

## Done means
`main` runs the full demo offline, tests are green, repo is public, entry is submitted and visible on Devpost.
