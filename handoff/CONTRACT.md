# Shared contract (draft, final once `devpost/spec.md` is merged)

Everyone builds against these shapes. Change them only by pull request that all four owners approve.

**Proposed stack:** React + TypeScript + Vite, static app, pure functions for logic, JSON files for content, optional small Node endpoint for the AI extraction call. Fixture mode (`VITE_FIXTURE=1`) must run the whole demo with **no API key and no network**.

## Folders
```
data/steps.json              Rasha   knowledge base of steps
data/call-scripts.json       Rasha   bank-call script templates
data/recovery-rules.json     Rasha   recovery-fee scam red flags
data/demo-scenario.json      Rasha   fictional demo case (inputs + evidence text)
src/i18n/{en,ms,bn}.json     Rasha   all wording; same keys in all three
src/lib/extract.ts           Ahnaf   evidence -> facts (fixture + AI)
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

type Facts = {
  amount?: { value: number; currency: string };
  occurredAt?: string; payee?: string; account?: string; channel?: Channel;
  claims: { text: string; snippet: string }[]; // each fact quotes its evidence
};

type Plan = { steps: Step[]; script?: { id: string; filled: string }; timeline: TimelineEvent[] };
type TimelineEvent = { at: string; labelKey?: string; text?: string; snippet?: string };
type RedFlag = { id: string; labelKey: string; explainKey: string; sources: Source[] };
```

## Rules of the contract
- **Numbers and instructions come only from `data/*.json`.** The AI may extract facts from evidence; it may never invent or change a phone number, hour or step.
- Every `Step` has at least one `Source` with `retrievedOn`.
- Every i18n key exists in `en`, `ms` and `bn`. `src/i18n/meta.json` records `{ "ms": {"reviewedBy": "..."}, "bn": {"reviewedBy": "..."} }`; unreviewed emergency text is not allowed in the demo.
- Fictional demo data only.
