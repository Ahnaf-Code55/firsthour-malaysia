# Shared contract (final when `devpost/spec.md` is approved; see the spec for the full design)

Everyone builds against these shapes. **POC scope (approved in devpost/scope.md):** payments `bank_transfer` and `ewallet`, window `under_1h`, languages English and Bangla. The wider types stay in the union for later. Change them only by pull request that all four owners approve.

**Stack (see `devpost/spec.md > Stack`):** React + TypeScript + Vite, memory-only state, pure functions for logic, JSON files for content, one `POST /api/extract` endpoint hosted by the Vite dev server, Anthropic `claude-haiku-5-5` for fact reading. Fixture mode (`VITE_FIXTURE=1`) must run the whole demo with **no API key and no network**.

## Folders
```
data/steps.json              Rasha   knowledge base of steps
data/call-scripts.json       Rasha   bank-call script templates
data/recovery-rules.json     Rasha   recovery-fee scam red flags
data/demo-scenario.json      Rasha   fictional demo case (inputs + evidence text + saved facts for fixture mode)
data/banks.json              Rasha   the three sourced banks for the picker (name, fraud-line tel, Source)
src/i18n/{en,bn}.json     Rasha   all wording; same keys in both
src/lib/extract.ts           Ahnaf   evidence -> facts (fixture + server)
src/types.ts                 Ahnaf   the types below
server/extract.ts, validate.ts Ahnaf + Turjo  AI call and reply checks
src/lib/image.ts             Turjo   screenshot checks, EXIF strip
src/lib/plan.ts              Ahnaf   facts + answers + steps -> plan (pure, tested)
src/lib/scan.ts              Ahnaf   follow-up message -> red flags (pure, tested)
src/components, src/pages    Saif    UI
scripts/check-sources.mjs    Turjo   fails the build if a step lacks a dated source
SECURITY.md, docs/           Turjo / Rasha
```

## Types
```ts
type Payment = "bank_transfer" | "ewallet" | "card" | "cash_deposit" | "crypto" | "other";
type Window  = "under_1h" | "1_to_24h" | "over_24h";
type Channel = "phone_call" | "sms" | "whatsapp" | "job_offer" | "other";

type Source = { name: string; url: string; retrievedOn: string /* YYYY-MM-DD */ };

type Action =
  | { type: "call"; labelKey: string; tel: string; source: Source }
  | { type: "link"; labelKey: string; url: string }
  | { type: "script"; scriptId: string };

type Step = {
  id: string;
  priority: number;                 // 1 = do first
  urgency: "now" | "today" | "later";
  titleKey: string; bodyKey: string; // i18n keys
  appliesTo: { payment: Payment[] | "any"; window: Window[] | "any" };
  actions: Action[];
  sources: Source[];                // at least one, always
};

type Fact<T> = { value: T; snippet?: string; edited?: boolean }; // snippet = verbatim quote from the evidence
type Facts = {
  amount?: Fact<{ value: number; currency: string }>;
  occurredAt?: Fact<string>;
  payee?: Fact<string>;
  account?: Fact<string>;        // digits only
  startedHow?: Fact<string>;
  channel?: Fact<Channel>;
};
type Answers = { payment: Payment; window: Window; lang: "en" | "bn" };
type Ticks = Record<string, string>;                      // stepId -> ISO time
type ExtractResult = { facts: Facts; source: "live" | "fixture" | "offline" };

type Plan = { steps: Step[]; script?: { id: string; filled: string }; timeline: TimelineEvent[]; outOfScope: boolean };
// buildPlan(facts, answers, steps, scripts, ticks, now) -> Plan. Out of scope = only steps with appliesTo "any" (generic).
type TimelineEvent = { at: string; labelKey?: string; text?: string; snippet?: string };
type RedFlag = { id: string; labelKey: string; explainKey: string; sources: Source[] };
```

## Rules of the contract
- **Numbers and instructions come only from `data/*.json`.** The AI may extract facts from evidence; it may never invent or change a phone number, hour or step.
- Every `Step` has at least one `Source` with `retrievedOn`.
- Every i18n key exists in `en` and `bn` (no Malay: nobody on the team can review it). `src/i18n/meta.json` records `{ "bn": {"reviewedBy": "..."} }`; unreviewed emergency text is not allowed in the demo.
- A fact survives `server/validate.ts` only if its `snippet` appears verbatim in the evidence text. Missing facts show as `[amount?]` in the script.
- Steps that must show for every payment/time (997, police report) use `appliesTo: { payment: "any", window: "any" }`.
- Fictional demo data only.
