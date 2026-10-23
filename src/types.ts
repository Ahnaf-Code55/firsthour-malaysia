export type Payment = "bank_transfer" | "ewallet" | "card" | "cash_deposit" | "crypto" | "other";
export type Window = "under_1h" | "1_to_24h" | "over_24h";
export type Channel = "phone_call" | "sms" | "whatsapp" | "job_offer" | "other";
export type Lang = "en" | "bn";

export type Source = { name: string; url: string; retrievedOn: string };

export type Action =
  | { type: "call"; labelKey: string; tel: string; source: Source }
  | { type: "link"; labelKey: string; url: string }
  | { type: "script"; scriptId: string };

export type Step = {
  id: string;
  priority: number;
  urgency: "now" | "today" | "later";
  titleKey: string;
  bodyKey: string;
  appliesTo: { payment: Payment[] | "any"; window: Window[] | "any" };
  actions: Action[];
  sources: Source[];
  picker?: "banks";
};

export type Fact<T> = { value: T; snippet?: string; edited?: boolean };
export type Facts = {
  amount?: Fact<{ value: number; currency: string }>;
  occurredAt?: Fact<string>;
  payee?: Fact<string>;
  account?: Fact<string>;
  startedHow?: Fact<string>;
  channel?: Fact<Channel>;
};
export type Answers = { payment: Payment; window: Window; lang: Lang };
export type Ticks = Record<string, string>;
export type ExtractResult = { facts: Facts; source: "live" | "fixture" | "offline" };

export type TimelineEvent = { at: string; labelKey?: string; text?: string; snippet?: string };
export type Plan = {
  steps: Step[];
  script?: { id: string; filled: string };
  timeline: TimelineEvent[];
  outOfScope: boolean;
};
export type RedFlag = { id: string; labelKey: string; explainKey: string; sources: Source[] };
export type Bank = { id: string; name: string; tel: string; source: Source };
export type CallScript = { id: string; template: string };
