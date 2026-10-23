import type { Answers, Facts, Plan, Step, Ticks, TimelineEvent } from "../types";

const IN_SCOPE_PAYMENTS = ["bank_transfer", "ewallet"];

const matches = (s: Step, a: Answers) =>
  (s.appliesTo.payment === "any" || s.appliesTo.payment.includes(a.payment)) &&
  (s.appliesTo.window === "any" || s.appliesTo.window.includes(a.window));

export function buildPlan(facts: Facts, answers: Answers, steps: Step[], ticks: Ticks = {}): Plan {
  const picked = steps.filter((s) => matches(s, answers)).sort((a, b) => a.priority - b.priority);
  const timeline: TimelineEvent[] = [];
  if (facts.occurredAt) timeline.push({ at: "", labelKey: "timeline.sent", text: facts.occurredAt.value, snippet: facts.occurredAt.snippet });
  for (const [id, at] of Object.entries(ticks)) timeline.push({ at, labelKey: "timeline.ticked", text: id });
  timeline.sort((a, b) => a.at.localeCompare(b.at));
  return {
    steps: picked,
    timeline,
    outOfScope: !(IN_SCOPE_PAYMENTS.includes(answers.payment) && answers.window === "under_1h"),
  };
}
