import { describe, expect, it } from "vitest";
import steps from "../data/steps.json";
import rules from "../data/recovery-rules.json";
import en from "../src/i18n/en.json";
import { buildPlan } from "../src/lib/plan";
import { scanMessage, type Rule } from "../src/lib/scan";
import type { Answers, Step } from "../src/types";

// Scenarios are described in docs/qa-scenarios.md. Keep both files in sync.
const allSteps = steps as Step[];
const allRules = rules as Rule[];
const answers = (payment: Answers["payment"], window: Answers["window"]): Answers => ({ payment, window, lang: "en" });

describe("QA scenarios (docs/qa-scenarios.md)", () => {
  it("1. fake police call: bank transfer, under 1 hour", () => {
    const plan = buildPlan({}, answers("bank_transfer", "under_1h"), allSteps);
    expect(plan.steps.map((s) => s.id)).toEqual(["call-bank", "call-nsrc", "police-report", "semak-mule", "no-recovery-fee"]);
    expect(plan.outOfScope).toBe(false);
  });

  it("2. courier parcel: e-wallet, under 1 hour", () => {
    const plan = buildPlan({}, answers("ewallet", "under_1h"), allSteps);
    expect(plan.steps.map((s) => s.id)).toEqual(["report-in-app", "call-nsrc", "police-report", "semak-mule", "no-recovery-fee"]);
    expect(plan.outOfScope).toBe(false);
  });

  it("3. job offer: bank transfer, 1 to 24 hours (out of scope)", () => {
    const plan = buildPlan({}, answers("bank_transfer", "1_to_24h"), allSteps);
    expect(plan.steps.map((s) => s.id)).toEqual(["call-nsrc", "police-report", "semak-mule", "no-recovery-fee"]);
    expect(plan.outOfScope).toBe(true);
  });

  it("4. e-wallet link: e-wallet, over 24 hours (out of scope)", () => {
    const plan = buildPlan({}, answers("ewallet", "over_24h"), allSteps);
    expect(plan.steps.map((s) => s.id)).toEqual(["call-nsrc", "police-report", "semak-mule", "no-recovery-fee"]);
    expect(plan.outOfScope).toBe(true);
  });

  it("5. recovery-fee follow-up: bank transfer, under 1 hour, then a recovery message", () => {
    const plan = buildPlan({}, answers("bank_transfer", "under_1h"), allSteps);
    expect(plan.steps.map((s) => s.id)).toEqual(["call-bank", "call-nsrc", "police-report", "semak-mule", "no-recovery-fee"]);
    const followUp =
      "Hi, I am Officer Daniel from the NSRC recovery unit. We can recover your RM1,200 but you must first pay a RM300 processing fee. Click https://nsrc-refund.example/claim to open your case.";
    expect(scanMessage(followUp, allRules).map((f) => f.id)).toEqual(["recovery-fee", "fake-agent", "refund-link"]);
  });
});

describe("false-positive guard", () => {
  it("an ordinary message has no flags", () => {
    expect(scanMessage("Hi, are you free for lunch?", allRules)).toEqual([]);
  });
});

describe("i18n wording", () => {
  it("no check.* English string contains the word safe", () => {
    const checkStrings = Object.entries(en)
      .filter(([key]) => key.startsWith("check."))
      .map(([, value]) => value);
    expect(checkStrings.length).toBeGreaterThan(0);
    for (const text of checkStrings) expect(text.toLowerCase()).not.toContain("safe");
  });
});

describe("fixed findings", () => {
  it("a fee to get money back is flagged as a recovery fee", () => {
    expect(scanMessage("Pay RM300 processing fee to get your money back.", allRules).map((f) => f.id)).toContain("recovery-fee");
  });
  it("flags a Bangla upfront payment request for a refund", () => {
    expect(scanMessage("টাকা ফেরত পেতে আগে ৩০০ টাকা পাঠান", allRules).map((f) => f.id)).toContain("recovery-fee");
  });
  it("flags a Bangla police recovery-unit impersonation", () => {
    expect(scanMessage("আমি পুলিশের টাকা উদ্ধার ইউনিটের কর্মকর্তা", allRules).map((f) => f.id)).toContain("fake-agent");
  });
});
