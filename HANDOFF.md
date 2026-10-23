# Handoff

Status: **scope not written yet.** Plan docs (`devpost/scope.md`, `prd.md`, `spec.md`) land here next; tasks below are the owner split and will be refined into GitHub issues once scope is done.

## Goal
Win a top-3 prize ($1,250 / $750 / $500). Judged on **Design**, **Innovation/Idea**, **Presentation**. Reviewers do not run the code, so the **demo video** (1-3 min) must show the full journey working.

Pitch line: *"After the loss."* Other scam entries detect or prevent scams. FirstHour starts when the money has already gone.

## Deadlines (Malaysia time, MYT)
| When | What |
|---|---|
| Oct 24 | scope, PRD, spec merged; data shape agreed |
| Oct 25 | features done, security review started |
| Oct 26, 14:00 | code freeze, only bug fixes after |
| Oct 26, 18:00 | demo video recorded |
| Oct 26, 23:00 | submitted on Devpost (real deadline is Oct 27, 05:00 MYT) |

## Owners
| Person | GitHub | Owns |
|---|---|---|
| Ahnaf (lead, Devpost Representative) | @Ahnaf-Code55 | scope/PRD/spec, evidence-to-facts extraction (with a fixture mode so the demo runs without any API key), merging, Devpost submission |
| Turjo | @TRahman2414 | **all security**: privacy rules (nothing stored), safe handling of uploads and text, threat model, dependency and secrets scan, check that every number has a dated source, final review before submission |
| Saif | @hsaif2208-a11y | **all screens**: intake form, text paste and screenshot upload, EN/BN switcher, action list, evidence timeline, call-script screen with copy button, recovery-scam warning banner, printable report, mobile layout, demo polish and animation, seeded demo scenario wired into the UI |
| Rasha | @RashaOsman2 | **content and demo**: knowledge base of 6 to 8 steps (bank transfer under 1 h, plus e-wallet) (each with a dated official source URL), call-script templates, recovery-scam red-flag rules, all emergency wording in EN/BN, QA of 5 scam scenarios, README and Devpost description, demo script and video |

**Your task list:** [Ahnaf](handoff/ahnaf.md) · [Turjo](handoff/turjo.md) · [Saif](handoff/saif.md) · [Rasha](handoff/rasha.md)

Saif and Rasha depend on one shared data shape (steps, sources, translations): [handoff/CONTRACT.md](handoff/CONTRACT.md). It is a draft until `spec.md` is merged; agree any change before building.

## Rules
- Branches `<name>/<topic>`, pull requests into `main`, one reviewer from another owner. No direct pushes to `main`.
- **No secrets** in the repo (`.env` is ignored; use `.env.example`). **No real victim data**: demo evidence is fictional.
- Every phone number, hour or instruction shown in the app needs a source URL and a retrieved-on date. Where official sources disagree (e.g. NSRC hours), cite both and do not state one as settled.
- Never promise recovery of money. The app does not contact banks or file reports.
- Event requirements: new project, public repo containing `scope.md`, `prd.md`, `spec.md`, a 1-3 min demo video, a short description (what it does, who it's for, what we learned).
- The repo is **private** now and becomes **public at submission**: do not commit anything you would not want public.

## Prize
Paid to the Representative, who splits it among members. Agree the split in writing before submitting. Winners cover wire fees, currency fees and taxes.
