# Devpost submission pack (paste into the project form)

Event: Build With AI: Basics. Required: demo video (1 to 3 min), public repo URL with `scope.md`, `prd.md`, `spec.md`, and a short description (what it does, who it's for, what you learned). All three are ready.

**Project name:** FirstHour Malaysia

**Tagline (58 characters):** The first safe hour after a scam, for students in Malaysia

**Video demo link:** (paste the YouTube or Vimeo link after uploading `demo-video/firsthour-demo.mp4`, 85 seconds)

**"Try it out" links:** https://github.com/Ahnaf-Code55/firsthour-malaysia (run with `VITE_FIXTURE=1 npm run dev`, press "Try the sample case")

**License URL (needs the repo to be public):** https://github.com/Ahnaf-Code55/firsthour-malaysia/blob/main/LICENSE (MIT)

**Built with:** react, typescript, vite, gemini-api, claude, kokoro, vitest, node.js, devpost-learn-skills

**Image gallery:** `demo-video/gallery/1-threads.jpg` to `5-summary.jpg` (video frames). Thumbnail: `1-threads.jpg`.

**Team:** Ahnaf (lead, front end, content, most of the back end) and Turjo (security, back end hardening, QA). Add teammates on Devpost as you see fit.

---

## About the project (paste)

### What it does
FirstHour Malaysia gives someone who has just sent money to a scammer a calm, sourced plan for the next hour, in English or Bangla. They paste the scam messages or add a screenshot. FirstHour pulls out the facts (amount, time, who was paid, the account number) and shows the exact line each one came from. Then it shows what to do first: call your bank's fraud line, call the National Scam Response Centre on 997, check the account on Semak Mule, make a police report. Each step has a tap-to-call button, the official source and the date we checked it. It fills in a call script they can copy for the bank, keeps a timeline as they tick steps off, and warns them if a later message offers to recover their money for a fee. It ends with a printable summary for the police and the bank.

### Who it's for
International students in Malaysia, who often face a scam alone, in a second language, with no idea who to call. The first test case is someone who sent about RM 1,200 by bank transfer after a fake police call.

### What makes it different
Most scam tools detect or prevent scams before the money moves. FirstHour starts after the loss. The AI only reads facts out of the evidence. Every phone number and instruction comes from a dated official source, and a fact is dropped if its quote isn't in what the person wrote. FirstHour never contacts a bank, files a report or promises to get money back.

### How we built it
React, TypeScript and Vite. A small server endpoint reads the evidence with an AI model (Gemini on the free tier, or Anthropic) and the reply is checked before anything is shown. The plan itself is built by plain code from sourced JSON files. A fixture mode runs the full demo with no key and no network. Planned and built with the Devpost Learn skills (`devpost/scope.md`, `prd.md`, `spec.md`, `checklist.md`). Several AI models reviewed the work: one wrote QA scenarios, one reviewed the Bangla wording and checked sources, one attacked the code and found real bugs (free text that could carry a phone number into the call script, a slow regex, stale responses). The demo video was built as a motion film from the live app, with a locally generated voice-over.

### What we learned
The risk in an emergency tool is an invented phone number, so we split "the AI reads" from "code plans from sourced files", and turned that rule into tests. Official sources disagree (NSRC's hours differ between pages), so the app shows both and says to call the bank if nobody answers. Two teammates dropped offline on the last day, which taught us to keep the shared data shape small and the handoff files clear enough for anyone to pick up.

### Honest limits
Bank transfer and e-wallet within the first hour only. Three banks are sourced (Maybank, CIMB, Public Bank). The Bangla text was written by Claude and reviewed by AI, with a human review pending. The demo video shows live AI reading of fictional messages; if the AI provider is down, the app falls back to a saved reading of the same fictional messages and labels it on screen. No real victim data is used anywhere.

### What's next
More payment types and time windows, Malay once a native reviewer is on the team, and a sharing option for family members.
