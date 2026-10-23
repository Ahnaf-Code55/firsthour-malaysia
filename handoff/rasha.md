# Rasha  @RashaOsman2  (content, translations, QA, demo)

## Start here (paste this into your AI assistant)
> You are helping me, **Rasha**, build my part of FirstHour Malaysia with three teammates. Read, in order: `handoff/rasha.md` (my tasks), `handoff/CONTRACT.md` (shared types), `devpost/prd.md` (what the product does), `devpost/spec.md` (how it is built), `devpost/scope.md`. Seed content is on `main` in `data/*.json` and `src/i18n/en.json`; extend and correct it with official dated sources only, and create `src/i18n/bn.json` with the same keys plus `meta.json` (and wire `bn` into `src/i18n/t.ts`). Run `npm test`: it checks that every step has a dated source and every fact quote is in the demo evidence. Work on a branch named `rasha/<topic>`, open a pull request to `main`, and do not edit files owned by someone else without asking. Run `npm install && npm test && npm run build` before every pull request. Every phone number and instruction in the app must come from a dated official source, never from AI.

Run it: `npm install`, then `VITE_FIXTURE=1 npm run dev` and press "Try the sample case". Your GitHub issues list the checkboxes below.

You own what the app says and the story we tell. Everything must be correct, sourced and dated. Dates are Malaysia time.

## Knowledge base  (due Oct 24)
- [ ] `data/steps.json`: 6 to 8 steps for bank transfer under 1 h plus e-wallet (card, cash, crypto and over-24 h are out of scope, see `devpost/scope.md`). Follow `handoff/CONTRACT.md`. Typical steps: call your bank's fraud line, call NSRC 997, check the account number with Semak Mule, make a police report, keep evidence, change passwords, warn about recovery-fee offers.
- [ ] Every step has a source URL and `retrievedOn` date from an official page (malaysia.gov.my, PDRM, BNM, the bank's own page). **No bank hotline numbers unless taken from that bank's official page.**
- [ ] Where sources disagree (NSRC hours: some say 24/7, some say 8 am to 8 pm) record both and word it safely, for example "call now; if no answer, contact your bank".
- [ ] Bank picker: official fraud-line pages for 3 banks (choose the 3 most used by students; Maybank and UOB pages are already known) with dated sources, plus "Other: use the number on your card or in your bank app". E-wallet: one provider's official report page plus a generic "report in your app" line, or the generic line only.
- [ ] `data/call-scripts.json`: bank-call script with placeholders `{amount}` `{time}` `{payee}` `{account}`.
- [ ] `data/recovery-rules.json`: red flags for "pay a fee and we recover your money", fake agents, "refund" links. Patterns in English and Bangla.
- [ ] `data/demo-scenario.json`: the fictional case (about RM 1,200 sent by bank transfer 4 minutes ago after a fake police call, plus the later recovery-fee message).

## Translations  (due Oct 25)
- [ ] `src/i18n/en.json` is the source; produce `bn.json` with the same keys. No Malay: nobody on the team can review it.
- [ ] Bangla emergency wording reviewed by a second person and recorded in `src/i18n/meta.json`. Unreviewed emergency text must not appear in the demo.
- [ ] Translate Turjo's "What we store" statement to Bangla.

## QA  (Oct 25 to Oct 26)
- [ ] `docs/qa-scenarios.md`: 5 scam scenarios (fake police call, courier parcel, job offer, e-wallet link, recovery-fee follow-up) with expected steps. Run them on every build, file issues for mismatches.

## Story and submission copy  (due Oct 25)
- [ ] `docs/demo-script.md`: shot-by-shot 75-second script. Open with the fake message and "RM 1,200 sent 4 minutes ago". Pitch line: *"The first safe hour after a scam."* Say clearly that other tools detect scams and FirstHour starts after the loss.
- [ ] `docs/devpost-description.md`: what it does, who it's for, what we learned (the event asks for all three).
- [ ] Polish `README.md`.

## Video  (Oct 26, recorded by 18:00)
- [ ] Record screen and voice-over, 1 to 3 minutes, English captions. Show the full journey working: live extraction on the fictional evidence if it is reliable; if fixture mode is used, say so in the description. Upload and hand the link to Ahnaf.

## Done means
Every instruction in the app has a dated official source, Bangla reviewed, QA scenarios pass, video and description ready before Oct 26 23:00.
