# Handoff

Status: **scope and PRD approved** (`devpost/scope.md`, `devpost/prd.md`); `spec.md` approved; `5-build` is next. **Oct 26 update: Saif and Rasha are offline, so the work is split between two people: Ahnaf (all front end, content, 70% of the back end) and Turjo (30% of the back end plus the full security audit).**

## Goal
Win a top-3 prize ($1,250 / $750 / $500). Judged on **Design**, **Innovation/Idea**, **Presentation**. Reviewers do not run the code, so the **demo video** (1-3 min) must show the full journey working.

Pitch line: *"After the loss."* Other scam entries detect or prevent scams. FirstHour starts when the money has already gone.

## Deadlines (Malaysia time, MYT)
| When | What |
|---|---|
| Oct 24 | scope, PRD, spec merged; data shape agreed |
| Oct 25 | features done, security review started |
| Oct 26, 14:00 | code freeze, only bug fixes after (Turjo's audit may continue until 20:00) |
| Oct 26, 18:00 | demo video recorded |
| Oct 26, 23:00 | submitted on Devpost (real deadline is Oct 27, 05:00 MYT) |

## Owners (two-person split from Oct 26)
| Person | GitHub | Owns |
|---|---|---|
| Ahnaf (lead, Devpost Representative) | @Ahnaf-Code55 | **All front end and design** (the three surfaces in `devpost/prd.md`, English and Bangla, look and feel, states, demo polish); **content** (steps, banks, recovery rules, translations, demo script, Devpost description); **70% of the back end** (plan, scan, extract, validate, Gemini/Anthropic reader, tests, CI core); merging; the video; the Devpost submission |
| Turjo | @TRahman2414 | **30% of the back end** (screenshot handling `src/lib/image.ts`, `/api/extract` hardening, `scripts/check-sources.mjs`, CI checks) and the **full security audit** (threat model, `SECURITY.md`, CSP, XSS and prompt-injection tests, dependency and secrets scan, git-history scan, attacker walkthrough, written sign-off before the repo goes public) |
| Saif, Rasha | offline | Their old task files ([saif](handoff/saif.md), [rasha](handoff/rasha.md)) are kept for reference. If either returns, they can take over a named part by pull request. |

**Task lists:** [Ahnaf](handoff/ahnaf.md) · [Turjo](handoff/turjo.md)

Everyone builds against one shared data shape: [handoff/CONTRACT.md](handoff/CONTRACT.md). It is final now that `spec.md` is approved; agree any change before building.

## Rules
- Branches `<name>/<topic>`, pull requests into `main`, one reviewer from another owner. No direct pushes to `main`.
- **No secrets** in the repo (`.env` is ignored; use `.env.example`). **No real victim data**: demo evidence is fictional.
- Every phone number, hour or instruction shown in the app needs a source URL and a retrieved-on date. Where official sources disagree (e.g. NSRC hours), cite both and do not state one as settled.
- Never promise recovery of money. The app does not contact banks or file reports.
- Event requirements: new project, public repo containing `scope.md`, `prd.md`, `spec.md`, a 1-3 min demo video, a short description (what it does, who it's for, what we learned).
- The repo is **private** now and becomes **public at submission**: do not commit anything you would not want public.

## Prize
Paid to the Representative, who splits it among members. Agree the split in writing before submitting. Winners cover wire fees, currency fees and taxes.
