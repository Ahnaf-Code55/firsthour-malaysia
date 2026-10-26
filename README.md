# FirstHour Malaysia

**The first safe hour after a scam.** For international students in Malaysia who have just sent money to a scammer (fake police, immigration or courier calls). Paste the scam messages or add a screenshot and FirstHour shows what it found, each fact next to the exact line it came from, then a plan for the next hour: call your bank, call the National Scam Response Centre on 997, check the account on Semak Mule, make a police report. Every number and instruction has an official source and the date we checked it. It fills in a call script you can copy for the bank, keeps a timeline as you tick steps off, warns you if a later message offers to recover your money for a fee, and ends with a printable summary. English and Bangla.

Other scam tools detect or prevent scams before the money moves. FirstHour starts **after the loss**.

Entry for Devpost's [Build With AI: Basics](https://learn-ai-basics.devpost.com/).

> FirstHour does not contact your bank, file reports, or promise to recover money. Demo data is fictional.

## How it works
- **The AI only reads.** A small server endpoint asks an AI model (Gemini free tier or Anthropic) to pull out facts: amount, time, who was paid, account number, how it started. A fact is thrown away unless its quote appears word for word in what you wrote.
- **Plain code plans.** `src/lib/plan.ts` builds the plan from `data/steps.json`, `data/banks.json` and `data/call-scripts.json`. The AI never writes a step or a phone number.
- **Nothing is saved.** Everything stays in the browser tab. See [SECURITY.md](SECURITY.md) and [docs/what-we-store.md](docs/what-we-store.md).

## Run it
```bash
npm install
VITE_FIXTURE=1 npm run dev     # demo with no key and no internet; press "Try the sample case"
npm test                       # tests
npm run build                  # type check + production build
npm run check-sources          # every step has a dated official source
```
Live reading needs one key in `.env` (copy `.env.example`): `GEMINI_API_KEY` (free, from [Google AI Studio](https://aistudio.google.com)) or `ANTHROPIC_API_KEY`, then `npm run dev`. Free-tier Gemini may use what you send to improve Google products, so use only fictional evidence with it. If the AI provider fails, the sample case falls back to a saved reading and says so on screen.

## Plans and how it was built
Planned with the Devpost Learn skills: [scope](devpost/scope.md), [PRD](devpost/prd.md), [spec](devpost/spec.md), [build checklist](devpost/checklist.md). Reviewed by several AI models and a four-person team: see [HANDOFF.md](HANDOFF.md), [docs/qa-scenarios.md](docs/qa-scenarios.md) and [docs/demo-script.md](docs/demo-script.md).

## Limits
Bank transfer and e-wallet within the first hour. Three banks sourced (Maybank, CIMB, Public Bank). No Malay yet. Screenshots are resized and stripped of metadata in the browser, and read by the AI only when a key is set.
