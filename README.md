# FirstHour Malaysia

The first safe hour after a scam. For international students in Malaysia who have just realized they were scammed (fake police, immigration or courier calls): add your evidence, get a prioritized plan, a bank-call script, an evidence timeline, and a warning about "recovery fee" follow-up scams. English and Bangla.

Entry for Devpost's [Build With AI: Basics](https://learn-ai-basics.devpost.com/). Deadline: **Oct 26, 2026, 5:00 pm ET** (Oct 27, 5:00 am Malaysia time).

**Start here: [HANDOFF.md](HANDOFF.md).**

This tool does not contact your bank, file reports, or promise to recover money. Demo data is fictional.

## Run it
```bash
npm install
VITE_FIXTURE=1 npm run dev     # demo with no key and no internet; press "Try the sample case"
npm test                       # logic tests
npm run build                  # type check + production build
```
Live reading of messages needs one key in `.env` (see `.env.example`): `GEMINI_API_KEY` (free, from Google AI Studio) or `ANTHROPIC_API_KEY`. Then `npm run dev`. Free-tier Gemini may use what you send to improve Google products, so use only fictional evidence with it.
