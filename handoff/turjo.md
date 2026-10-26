# Turjo  @TRahman2414  (30% of the back end + the full security audit)

Two of us are building now (Ahnaf and Turjo), so you have two jobs: **finish your part of the back end** and **audit everything**. Dates are Malaysia time. Ahnaf builds all screens and content, so your pull requests should stay in the files listed here.

## Start here (paste this into your AI assistant)
> You are helping me, **Turjo**, build and audit my part of FirstHour Malaysia with Ahnaf. Read, in order: `handoff/turjo.md` (my tasks), `handoff/CONTRACT.md` (shared types), `devpost/prd.md` (what the product does), `devpost/spec.md` (how it is built, see Fact reader, Screenshot handling, Important Failure Modes), `devpost/scope.md`. Work on a branch named `turjo/<topic>`, open a pull request to `main`, and only edit the files listed under my tasks (ask Ahnaf before touching `src/pages`, `src/components`, `data/` or `src/i18n/`). Run `npm install && npm test && npm run build` before every pull request (if `npm` is missing use `node node_modules/vitest/vitest.mjs run`). Every phone number and instruction in the app must come from a dated official source, never from AI.

Run it: `npm install`, then `VITE_FIXTURE=1 npm run dev` and press "Try the sample case". Live reading needs one key in `.env` (copy `.env.example`): `GEMINI_API_KEY` (free) or `ANTHROPIC_API_KEY`.

## Part 1: back end, 30%  (due Oct 26, 12:00)
What is already on `main`: `src/lib/plan.ts`, `scan.ts`, `extract.ts`, `server/validate.ts`, `server/extract.ts`, the `/api/extract` middleware in `vite.config.ts`, 21 passing tests, a basic CI (`.github/workflows/ci.yml`). You own these files:

- [ ] **`src/lib/image.ts`** (Ahnaf creates a stub with the interface below; you fill it in). Accepts PNG or JPEG up to 5 MB, draws it on a canvas (re-encoding strips EXIF and GPS), scales the longest side to at most 1600 px, returns base64 JPEG held in memory only. Never writes to disk or storage. Interface (do not change; the screens call it):
  ```ts
  export type ImageResult = { ok: true; base64: string } | { ok: false; reason: "type" | "size" | "unreadable" };
  export function prepareImage(file: File): Promise<ImageResult>;
  ```
  Add tests for the parts that can run without a browser (type and size checks).
- [ ] **Harden `/api/extract`** (in `vite.config.ts` and `server/extract.ts`): reject non-JSON and non-`POST`; body limit (already 8 MB; lower it if images are at most ~2 MB after resizing); cap evidence length; per-IP in-memory rate limit (for example 20 requests per minute); a timeout on the provider call (for example 20 s); generic error messages only; **never log evidence, images, keys or provider errors that echo them**. Keep the 503 `no_key` and 502 `reader_failed` behaviour (the app relies on it for the offline state).
- [ ] **`scripts/check-sources.mjs`**: fails (exit 1) if any step in `data/steps.json` lacks `sources[0].url` or `retrievedOn`, if the date is not `YYYY-MM-DD`, or if it is more than 14 days older than today. Also check `data/banks.json` entries and `data/recovery-rules.json` sources. `npm run check-sources` already points at it.
- [ ] **CI** (`.github/workflows/ci.yml`): add `npm run check-sources`, `npm audit --audit-level=high` (document accepted findings), and a gitleaks secret scan job.

## Part 2: full security audit  (due Oct 26, 20:00; sign-off before the repo goes public)
Cover everything in the repo, not only your files.

- [ ] **`SECURITY.md`** (one page): what is collected (nothing stored), where evidence goes (browser memory, then `/api/extract`, then the AI provider), what the AI sees, what can go wrong and what we do. **State plainly that on Gemini's free tier Google may use what is sent to improve its products, so only fictional evidence should be used with it.**
- [ ] A short plain-language **"What we store" statement** in English (Ahnaf translates it to Bangla and adds it to the app).
- [ ] **Rendering and XSS**: confirm there is no `dangerouslySetInnerHTML`, no `eval`, no unescaped user text; `tel:` and `href` values come only from `data/*.json`. Add a Content-Security-Policy `<meta>` to `index.html` (no inline scripts, fonts and scripts same-origin only, `connect-src 'self'`) and check the app still works in dev and build.
- [ ] **Prompt-injection tests** (`tests/injection.test.ts`): hostile evidence ("ignore previous instructions", fake phone numbers, HTML, extremely long text, unicode tricks) through `validateFacts`. Pass condition: output stays schema-valid and **no number or step outside `data/*.json` ever reaches the plan or the call script**. Note the one known gap and decide: `startedHow` is free text that appears in the call script, so check it cannot carry a fake hotline into the script (suggest a rule such as stripping digit runs of 3 or more that are not in the quote).
- [ ] **Dependencies and secrets**: `npm audit`, lockfile committed, no third-party scripts or analytics, fonts bundled locally. Check `.gitignore` covers `.env*` and `devpost/learner-profile.md`.
- [ ] **Git history scan**: full history for keys, tokens, personal data and real victim evidence before the repo becomes public.
- [ ] **Attacker walkthrough** of the demo: huge file, wrong file type, hostile text, offline mode, no key, bad key.
- [ ] **Written sign-off** as a comment on a pull request. **Ahnaf does not make the repo public without it.** List any accepted risks.


## Part 3: your next task, in parallel with the audit  (due Oct 26, 19:00 MYT)
Ahnaf is recording the video and cannot also check the app end to end, and nobody on the team has read the Bangla yet.
- [ ] **Bangla review (if you read Bangla; if not, tell Ahnaf now).** Read every string in `src/i18n/bn.json` next to `src/i18n/en.json`, especially the step texts (`step.*`), the warning texts (`flag.*`, `check.*`) and the disclaimer. Check meaning, calm natural wording, and that nothing promises money will come back. Fix by pull request (`turjo/bangla-review`), then set `reviewedBy` in `src/i18n/meta.json` to your name. Do not change keys, only values.
- [ ] **QA run.** Follow `docs/qa-scenarios.md`: run the 5 scenarios in the live app (`npm run dev` with a Gemini key in `.env`, or `VITE_FIXTURE=1 npm run dev` for the sample), at phone width (375 x 812) in English and Bangla. Also test a PNG screenshot, a huge image, and a text file renamed to .png. Open a GitHub issue labelled `qa` for each mismatch with: steps, expected, actual.
- [ ] Post both results as a short comment on issue #17.

## How to hand work back
Open a pull request for each part, tag @Ahnaf-Code55, and keep the description short: what changed, how you tested it, anything you could not verify. If you find a serious problem in files you do not own, open a GitHub issue labelled `security` instead of editing them.

## Done means
`SECURITY.md` merged, CI enforces source and secret checks, hostile-input tests pass, CSP in place, history scan clean, sign-off posted, image handling working with tests.
