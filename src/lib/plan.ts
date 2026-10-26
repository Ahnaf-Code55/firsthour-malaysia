import type { Answers, CallScript, Facts, Plan, Step, Ticks, TimelineEvent } from "../types";

const IN_SCOPE_PAYMENTS = ["bank_transfer", "ewallet"];

const matches = (s: Step, a: Answers) =>
  (s.appliesTo.payment === "any" || s.appliesTo.payment.includes(a.payment)) &&
  (s.appliesTo.window === "any" || s.appliesTo.window.includes(a.window));

export const money = (a: { value: number; currency: string }) =>
  a.currency === "MYR" ? `RM ${a.value.toLocaleString("en-MY")}` : `${a.currency} ${a.value.toLocaleString("en-MY")}`;

export function fillScript(template: string, f: Facts): string {
  const v = {
    time: f.occurredAt?.value || "[time?]",
    amount: f.amount ? money(f.amount.value) : "[amount?]",
    payee: f.payee?.value || "[payee?]",
    account: f.account?.value || "[account?]",
    started: f.startedHow?.value ? `It started with this: ${f.startedHow.value.replace(/\.$/, "")}.` : "",
  };
  return template.replace(/\{(\w+)\}/g, (_, k) => v[k as keyof typeof v] ?? "").replace(/\s{2,}/g, " ");
}

export function buildPlan(facts: Facts, answers: Answers, steps: Step[], scripts: CallScript[] = [], ticks: Ticks = {}): Plan {
  const picked = steps.filter((s) => matches(s, answers)).sort((a, b) => a.priority - b.priority);
  const timeline: TimelineEvent[] = [];
  if (facts.occurredAt) timeline.push({ at: "", labelKey: "timeline.sent", text: facts.occurredAt.value, snippet: facts.occurredAt.snippet });
  for (const [id, at] of Object.entries(ticks)) timeline.push({ at, labelKey: "timeline.ticked", text: id });
  timeline.sort((a, b) => a.at.localeCompare(b.at));
  const scriptId = picked.flatMap((s) => s.actions).find((a) => a.type === "script");
  const tpl = scriptId && scripts.find((c) => c.id === scriptId.scriptId);
  return {
    steps: picked,
    script: tpl ? { id: tpl.id, filled: fillScript(tpl.template, facts) } : undefined,
    timeline,
    outOfScope: !(IN_SCOPE_PAYMENTS.includes(answers.payment) && answers.window === "under_1h"),
  };
}
