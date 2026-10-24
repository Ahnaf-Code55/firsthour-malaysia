import { describe, expect, it } from "vitest";
import demo from "../data/demo-scenario.json";
import steps from "../data/steps.json";
import scripts from "../data/call-scripts.json";
import rules from "../data/recovery-rules.json";
import { extractFacts } from "../src/lib/extract";
import { buildPlan } from "../src/lib/plan";
import { scanMessage, type Rule } from "../src/lib/scan";
import type { Answers, Step } from "../src/types";

// The whole demo path in fixture mode: sample evidence -> facts -> plan -> script -> follow-up warning.
describe("sample case end to end (fixture mode)", () => {
  it("runs from evidence to plan, script and recovery-scam warning", async () => {
    const answers = { ...demo.answers, lang: "en" } as Answers;
    const r = await extractFacts(demo.evidence);
    expect(r.source).toBe("fixture");
    const plan = buildPlan(r.facts, answers, steps as Step[], scripts);
    expect(plan.outOfScope).toBe(false);
    expect(plan.steps[0].id).toBe("call-bank");
    expect(plan.steps.every((s) => s.sources.length > 0)).toBe(true);
    expect(plan.script?.filled).toMatch(/RM 1,200.*Ali Bin Hassan.*1234567890123/);
    expect(scanMessage(demo.followUp, rules as Rule[]).length).toBeGreaterThan(0);
  });
  it("unreadable evidence still gives a plan, with empty facts", async () => {
    const r = await extractFacts("some other text");
    expect(r.source).toBe("offline");
    const plan = buildPlan(r.facts, { ...demo.answers, lang: "en" } as Answers, steps as Step[], scripts);
    expect(plan.steps.length).toBeGreaterThan(0);
    expect(plan.script?.filled).toContain("[amount?]");
  });
});
