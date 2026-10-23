# Saif  @hsaif2208-a11y  (all screens)

You own everything the judges see. The video is mostly your screens, so polish matters more than extra features. Dates are Malaysia time.

## Foundation  (due Oct 24)
- [ ] Vite + React + TypeScript project, routing, design tokens (colour, type, spacing), one calm, trustworthy visual style. Avoid generic "AI app" looks; it should feel like a careful, human helper.
- [ ] Language switcher (EN / MS / BN) reading `src/i18n/*.json`. Bangla font that renders well on phones.
- [ ] "Load demo scenario" button that loads `data/demo-scenario.json` (Rasha provides the data).

## Screens  (due Oct 25)
- [ ] **1 Intake:** payment method, time since loss, how the scam started; paste evidence text or add a screenshot. Respect Turjo's upload limits.
- [ ] **2 Facts:** extracted amount, time, payee, channel, each with the evidence snippet beside it. Editable.
- [ ] **3 Plan:** steps in priority order with "do this now" first; call buttons (`tel:`), official links, source and retrieved-on date visible on each step.
- [ ] **4 Call script:** filled script, big **Copy** button, readable at arm's length.
- [ ] **5 Timeline:** chronological events from the evidence.
- [ ] **6 Recovery-scam warning:** paste a follow-up message; a clear warning banner appears with the reason. This is the demo's surprise beat, so make it memorable.
- [ ] **7 Report:** printable summary (print CSS or PDF) with timeline and plan.
- [ ] Always visible: "This tool does not contact your bank, file reports, or promise recovery."

## Quality  (Oct 25 to Oct 26)
- [ ] Mobile first (phone width), keyboard and screen-reader basics, colour contrast.
- [ ] Empty, loading and error states for every screen.
- [ ] Motion for the key beats only (evidence organised, step 1 appears, warning appears). Respect reduced-motion.
- [ ] Run the demo script end to end three times with Rasha; fix anything that looks off on camera.

## Done means
The 75-second demo runs smoothly in all three languages in fixture mode, on a phone-sized window and a laptop, with no layout breaks.
