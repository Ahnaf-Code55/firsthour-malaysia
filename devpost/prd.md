---
doc: prd
status: approved
---

# FirstHour — Product Requirements

FirstHour gives someone who has just sent money to a scammer a calm, sourced plan for the next hour, in English or Bangla. Built for international students in Malaysia.
Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

> Drafted from the approved scope; the proposed items were approved with the plan.

## The Core Journey
1. The person opens FirstHour. They see one screen asking what happened. There is a clear "Try the sample case" button.
2. They choose how they paid (bank transfer or e-wallet), answer "When did you send it?", and paste the scam messages or add a screenshot.
3. They press the main button. FirstHour shows **Your plan** on one scrolling page:
   - the facts it found (amount, time, who was paid, how the scam started), each next to the exact line of evidence it came from;
   - the steps to do now, most urgent first ("Call your bank, then NSRC 997"), each with a tap-to-call button and the official source and date;
   - a call script, filled in with their facts, that they can copy and read to the bank;
   - a timeline of what happened.
4. As they do each step they tick it, and the tick is added to the timeline with the time *(proposed)*.
5. Later, if someone contacts them offering to recover the money, they paste that message into "Check a message". FirstHour warns if it matches known recovery-scam signs and says why.
6. They open the printable summary, print or save it, and take it to the police and the bank.
7. Success: in about two minutes, a panicking person knows what to do first, has the words to say to the bank, and knows the "we'll recover your money for a fee" message is a second scam.

## Screens and Layout
*(proposed)* Three surfaces. The language toggle (English / Bangla) is visible on every one and keeps everything the person has entered.

1. **Start** — payment method, "When did you send it?", a box for pasted messages or a screenshot, the "Try the sample case" button, and the always-visible disclaimer.
2. **Your plan** — one scrolling page in this order: facts with their evidence, steps to do now, call script with a Copy button, timeline, "Check a message" box.
3. **Printable summary** — the facts, the steps (with ticks), the timeline and the sources on one or two pages.

Moving between them: Start → Your plan → Printable summary, and back at any time. Nothing is saved between visits.

## Look and Feel
Approved direction: calm and human, like a careful friend who knows the procedure: high contrast, large readable type, one steady accent colour, red used only for the scam warning, a clean Bangla font, and no "cyber", neon or gradient-AI look. Phone first.

## Features and Behavior

### Evidence and facts
- The person can paste text or add one screenshot, or skip both.
- FirstHour shows the facts it found, each with the line of evidence it came from. The person can edit any fact, and the call script updates at once.

### The plan
- Steps are ordered by urgency. Every phone number, hour and instruction shows its source name and the date it was checked.
- FirstHour never invents a number or a step. If official sources disagree (for example NSRC hours), it shows both.
- Ticking a step adds a timestamped entry to the timeline *(proposed)*.

### The call script
- A short script in English, filled with the person's facts, with a **Copy** button that confirms "Copied".

### Check a message
- The person pastes a later message. If it matches known recovery-scam signs (a fee to recover money, a fake agent, a "refund" link), a red warning shows the reason and the official source.
- If nothing matches: "No known recovery-scam signs. Never pay to get money back." It never says "safe".

### Language
- All steps and screens switch between English and Bangla. The call script stays in English.

### Acceptance criteria
- [ ] At phone width, after loading the sample case, step 1 is visible without scrolling.
- [ ] Every phone number and instruction shows a source and date.
- [ ] Editing a fact updates the call script immediately.
- [ ] Copy shows a "Copied" confirmation.
- [ ] The sample recovery-fee message triggers a warning with the reason and the PDRM source.
- [ ] Switching to Bangla changes all step text and loses nothing the person entered.
- [ ] The printable summary fits on one or two pages.

## States and Boundaries
*(proposed, all)*
- **First open** — only Start is shown, with the sample case button.
- **No evidence given** — the plan still appears; steps never depend on reading the evidence.
- **Evidence can't be read, or the reading tool is offline** — FirstHour says so, offers manual fact fields, and the plan is unchanged.
- **Screenshot unreadable or too large** — suggests pasting the text instead.
- **Payment type or time outside the POC** — a banner explains, and the generic steps (997, police report) are shown. Never a dead end.
- **Nothing is saved** — a note says "Print your summary before closing."
- **Disclaimer on every surface** — "FirstHour does not contact your bank, file reports, or promise to recover money."

## Product Decisions
- Starts after the loss, not before — every other scam entry in this event works before the money moves (`scope.md > The Unique Kernel`).
- Prize money is the goal, so the demo and the sourced details matter more than breadth.
- No Malay — nobody on the team can review emergency wording in it.
- English and Bangla only; the call script stays in English.
- Numbers and steps come only from official, dated sources; the AI never produces them.
- Approved: three surfaces, the tick-to-timeline feature, the calm look above, and a picker of three sourced banks plus "Other: use the number on your card or in your bank app".

## What We're Building
- Start, Your plan and Printable summary, with the English / Bangla toggle.
- Bank transfer under one hour and e-wallet, with 6 to 8 sourced steps.
- Facts with evidence snippets, the filled call script with Copy, the timeline with ticks, and "Check a message".
- A sample case that runs the whole demo.

## Deferred From the POC
- Card, cash deposit, crypto and over-24-hour paths — not enough time to source them.
- Malay — no reviewer.
- Remembering a case between visits — needs accounts or storage, against the privacy decision.

## Possible Later Enhancements
- More payment types and countries. A Malay version once reviewed. Sharing the summary with a family member.

## Non-Goals
- Contacting banks or filing reports for the person — it must never act on their behalf.
- Promising to recover money — not guaranteed.
- A chatbot or general scam detector — detection is the crowded cluster.
- Storing evidence — privacy.

## Open Questions
- **Bank fraud lines (decided):** a picker with three banks, each number from that bank's official page, plus "Other: use the number on your card or in your bank app." Rasha chooses the three banks.
- **E-wallet path (Rasha decides, can wait):** one provider with an official page plus a generic "report in your app" line if a page is found; otherwise the generic line only.
- **Order of step 1 (can wait):** whether NSRC 997 or the bank comes first depends on the official sources; Rasha decides.
