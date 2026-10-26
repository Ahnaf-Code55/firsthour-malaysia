# Saif  @hsaif2208-a11y  (all screens)

> **Oct 26: offline, work reassigned.** This file is kept for reference. Ahnaf is covering these tasks (see `HANDOFF.md`). If you are back, tell Ahnaf which part to take and work by pull request.

## Start here (paste this into your AI assistant)
> You are helping me, **Saif**, build my part of FirstHour Malaysia with three teammates. Read, in order: `handoff/saif.md` (my tasks), `handoff/CONTRACT.md` (shared types), `devpost/prd.md` (what the product does), `devpost/spec.md` (how it is built), `devpost/scope.md`. A working starter UI is already on `main` (`src/pages`, `src/components`, `src/styles`); restyle and finish it, and build the CheckMessage component (use `scanMessage` in `src/lib/scan.ts`), the Printable summary page and the states. Follow `prd.md > Look and Feel` and `spec.md > Look and Feel`. Work on a branch named `saif/<topic>`, open a pull request to `main`, and do not edit files owned by someone else without asking. Run `npm install && npm test && npm run build` before every pull request. Every phone number and instruction in the app must come from a dated official source, never from AI.

Run it: `npm install`, then `VITE_FIXTURE=1 npm run dev` and press "Try the sample case". Your GitHub issues list the checkboxes below.

You own everything the judges see. The video is mostly your screens, so polish matters more than extra features. Dates are Malaysia time.

## Foundation  (due Oct 24)
- [ ] Vite + React + TypeScript project, routing, design tokens (colour, type, spacing), one calm, trustworthy visual style (see `devpost/prd.md > Look and Feel`: high contrast, large type, one steady accent colour, red only for the scam warning, a clean Bangla font, no neon or gradient-AI look). Avoid generic "AI app" looks; it should feel like a careful, human helper.
- [ ] Language switcher (EN / BN) reading `src/i18n/*.json`. Bangla font that renders well on phones.
- [ ] "Load demo scenario" button that loads `data/demo-scenario.json` (Rasha provides the data).

## Screens  (due Oct 25)
Three surfaces, as approved in `devpost/prd.md`. The EN / BN toggle is on every surface and keeps everything entered.
- [ ] **Start:** payment method (bank transfer or e-wallet), "When did you send it?", a box for pasted messages or one screenshot (respect Turjo's upload limits), a prominent "Try the sample case" button, and the always-visible disclaimer.
- [ ] **Your plan** (one scrolling page, in this order):
  - facts with the evidence snippet beside each, editable (editing updates the script at once);
  - "Do this now" steps with tap-to-call, the source name and checked-on date on each, and a tick box (a tick adds a timestamped timeline entry);
  - the filled call script (English) with a big **Copy** button that shows "Copied";
  - the timeline;
  - "Got a message offering to recover your money? Check it": a red warning with the reason and the PDRM source on a match; "No known recovery-scam signs. Never pay to get money back." otherwise (never "safe").
- [ ] **Printable summary:** facts, steps with ticks, timeline and sources on one or two pages. Note on screen: "Print your summary before closing."
- [ ] States from `prd.md > States and Boundaries`: first open, no evidence, reading tool offline (manual fact fields), bad screenshot, payment type or time outside the POC (banner plus generic steps).

## Quality  (Oct 25 to Oct 26)
- [ ] Mobile first (phone width), keyboard and screen-reader basics, colour contrast.
- [ ] Empty, loading and error states for every screen.
- [ ] Motion for the key beats only (evidence organised, step 1 appears, warning appears). Respect reduced-motion.
- [ ] Run the demo script end to end three times with Rasha; fix anything that looks off on camera.

## Done means
The 75-second demo runs smoothly in both languages in fixture mode, on a phone-sized window and a laptop, with no layout breaks.
