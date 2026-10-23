---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast (expert learner, hard deadline Oct 26 23:00 MYT). **Four people build this together.** Ahnaf's lane in this session: types, `plan.ts`, `scan.ts`, `extract.ts`, `server/`, tests, CI. Saif owns the UI, Rasha the content and translations, Turjo the security work (`handoff/*.md`, GitHub issues). The starter UI and seed data from slices 1-2 only give everyone something running to build on; teammates replace and extend them by pull request. Slices 4-6 are split by owner in the Revisions note.

## Slices

- [x] **1. The sample case becomes a plan you can tap through**
  Becomes usable: Open the app, press "Try the sample case", see a plan with sourced steps, tap-to-call, source and date on each, ticks that add timeline entries.
  Why now: Proves the whole path (scaffold, data, pure plan builder, two pages) and fixes the shared types everyone builds against.
  PRD ref: `prd.md > The Core Journey` (steps 1-4), `prd.md > The plan`
  Spec ref: `spec.md > Plan builder`, `spec.md > StepList`, `spec.md > Timeline`, `spec.md > File Structure`
  Build: Vite + React + TS scaffold, `src/types.ts`, `data/steps.json` + `demo-scenario.json` (sourced seed), `plan.ts`, Start and Plan pages, hash view switching, fixture extract.
  Verify (mechanical): `npm test` passes plan tests (bank transfer, e-wallet, other falls back to generic); `npm run build` succeeds; dev server serves the page.
  Learner check: Run `VITE_FIXTURE=1 npm run dev`, press "Try the sample case", tick a step, see it in the timeline.
  Commit: `Add scaffold, plan builder and sample-case plan page`

- [x] **2. Facts with their evidence, an editable call script, Copy**
  Becomes usable: Each fact shows the exact line it came from; editing a fact updates the call script; Copy shows "Copied".
  Why now: This is the kernel (facts pinned to evidence) and the demo's main beat.
  PRD ref: `prd.md > Evidence and facts`, `prd.md > The call script`
  Spec ref: `spec.md > FactsList`, `spec.md > CallScript`
  Build: FactsList, CallScript, `call-scripts.json`, script filling with `[amount?]` placeholders.
  Verify (mechanical): Unit test of script filling incl. missing facts; build passes.
  Learner check: Edit the amount and watch the script change; press Copy.
  Commit: `Add facts with evidence, call script and copy`

- [x] **3. Check a message flags recovery-fee scams**
  Becomes usable: Paste the sample fee message, get a red warning with reason and PDRM source; neutral text gets the "never pay" line.
  Why now: The second half of the kernel; pure logic, quick to verify.
  PRD ref: `prd.md > Check a message`
  Spec ref: `spec.md > Message scanner`, `spec.md > CheckMessage`
  Build: `scan.ts`, `recovery-rules.json` (English + Bangla patterns, sourced), CheckMessage component.
  Verify (mechanical): Unit tests: demo fee message matches; benign message does not; never returns "safe".
  Learner check: Paste the sample message and a harmless one.
  Commit: `Add recovery-scam message check`

- [ ] **4. English/Bangla toggle, printable summary, and the boundary states**
  Becomes usable: Toggle language anywhere without losing input; open a printable summary; out-of-scope and offline states show banners with generic steps.
  Why now: Completes all three surfaces and the PRD states before polishing.
  PRD ref: `prd.md > Language`, `prd.md > Screens and Layout`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Language toggle`, `spec.md > Printable summary page`
  Build: `t()` helper, `en.json`/`bn.json` same keys with `meta.json` review flag, Summary page + print CSS, banners.
  Verify (mechanical): Test that en/bn have identical key sets; build passes; summary renders in dev.
  Learner check: Switch to Bangla mid-case, open the summary, try "Other" payment.
  Commit: `Add language toggle, printable summary and boundary states`

- [x] **5. Live fact reader with validation**
  Becomes usable: With an API key, pasted text or a screenshot is read into facts by the server; bad or hostile replies are dropped.
  Why now: Riskiest unfamiliar piece; built after the fixture path so the demo never depends on it.
  PRD ref: `prd.md > Evidence and facts`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Fact reader`, `spec.md > Screenshot handling`, `spec.md > External Services and Dependencies`
  Build: `server/validate.ts`, `server/extract.ts` as Vite middleware, `image.ts`, client `extractFacts` with offline fallback.
  Verify (mechanical): Unit tests for validate (unquoted snippet dropped, injection text, non-numeric amount); server endpoint returns offline JSON without a key; build passes. Live call with a real key is noted as unverified if no key is available.
  Learner check: With a key set, press the main button with the sample evidence; without one, see the manual-fields notice.
  Commit: `Add live fact reader with validation`

- [ ] **6. Look and feel, accessibility, source check, run instructions**
  Becomes usable: The calm visual style, large type, phone layout, CSP, `check-sources`, README run steps.
  Why now: Final polish after behavior is complete.
  PRD ref: `prd.md > Look and Feel`, all acceptance criteria
  Spec ref: `spec.md > Look and Feel`, `spec.md > Source checker`, `spec.md > Where It Runs and How Someone Tries It`
  Build: CSS tokens, Bangla/English fonts, focus and contrast, reduced motion, CSP meta, `scripts/check-sources.mjs`, README.
  Verify (mechanical): `npm test`, `npm run check-sources`, `npm run build` pass; screenshot at phone width shows step 1 above the fold.
  Learner check: Walk the whole journey on a phone-sized window in both languages.
  Commit: `Polish look and feel, add source check and run docs`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — after slice 2 (sample case with facts and script)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence:
Route and stops:
Edit outcome:
Reflection:
Activity mode:

## Revisions
- Seed steps use only sources checked on 2026-10-23: the malaysia.gov.my NSRC 997 page (24h hours, call within 24h, contact bank, police report), the Semak Mule portal address, and a Malay Mail report of PDRM's April 2026 recovery-scam warning. The gov page lists the police report as a separate step and does not say a 997 call counts as one (news said it does from Sept 2025), so the app words it as "ask the operator". Bank hotline numbers and the e-wallet provider page are intentionally absent: `data/banks.json` is empty and the e-wallet step has no number until Rasha sources them. The e-wallet step cites the same gov page and needs Rasha's confirmation.
- Slices 1-2 included a starter UI and seed content, which overstepped the lane split (the user reminded us that four people build this together). Going forward this session builds only the lead's parts: `scan.ts` with tests (slice 3 logic), `server/validate.ts`, `server/extract.ts`, `extract.ts` (slice 5 logic), CI. Slice 3's CheckMessage component, slice 4 (language toggle, summary, states) and slice 6 (look, a11y, README) belong to Saif, Rasha and Turjo, as in their issues. `data/*.json` and `en.json` are seeds for Rasha to extend; `StepList`, `FactsList`, `CallScript`, pages and CSS are a starter for Saif to restyle.
- Slice 3 delivered the logic (`scan.ts`, `recovery-rules.json` seed, tests); the CheckMessage component is Saif's. Slice 5 delivered `server/validate.ts`, `server/extract.ts`, the Vite `/api/extract` endpoint and the client `extractFacts` with fixture fallback; unit tests pass and the endpoint returns 503 `no_key` without a key. A live call with a real `ANTHROPIC_API_KEY` is **unverified** (no key in this environment), as is the model id; `src/lib/image.ts` (screenshot limits, EXIF strip) is Turjo's.
- `scanMessage` takes the rules as an argument and tests both languages' patterns, so the spec signature `scanMessage(text, lang)` changed to `scanMessage(text, rules)`. Bangla patterns are a seed for Rasha to review.
