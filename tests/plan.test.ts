import { describe, expect, it } from "vitest";
import steps from "../data/steps.json";
import demo from "../data/demo-scenario.json";
import scripts from "../data/call-scripts.json";
import { buildPlan, fillScript } from "../src/lib/plan";
import type { Facts, Step } from "../src/types";

const S = steps as Step[];
const facts = demo.facts as Facts;
const a = (payment: any, window: any) => ({ payment, window, lang: "en" as const });

describe("buildPlan", () => {
  it("bank transfer under 1h: bank first, in scope", () => {
    const p = buildPlan(facts, a("bank_transfer", "under_1h"), S);
    expect(p.outOfScope).toBe(false);
    expect(p.steps[0].id).toBe("call-bank");
    expect(p.steps.map((s) => s.id)).toContain("call-nsrc");
  });
  it("ewallet gets the in-app step, not the bank step", () => {
    const ids = buildPlan(facts, a("ewallet", "under_1h"), S).steps.map((s) => s.id);
    expect(ids).toContain("report-in-app");
    expect(ids).not.toContain("call-bank");
  });
  it("unknown payment falls back to generic steps only", () => {
    const p = buildPlan({}, a("crypto", "over_24h"), S);
    expect(p.outOfScope).toBe(true);
    expect(p.steps.length).toBeGreaterThan(0);
    expect(p.steps.every((s) => s.appliesTo.payment === "any" && s.appliesTo.window === "any")).toBe(true);
  });
  it("ticks become timeline entries in time order", () => {
    const p = buildPlan(facts, a("bank_transfer", "under_1h"), S, scripts, { "call-nsrc": "2026-10-23T06:40:00Z", "call-bank": "2026-10-23T06:35:00Z" });
    expect(p.timeline.map((e) => e.text)).toEqual(["14:32", "call-bank", "call-nsrc"]);
  });
  it("every step has a dated source", () => {
    for (const s of S) {
      expect(s.sources.length).toBeGreaterThan(0);
      for (const src of s.sources) expect(src.retrievedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe("call script", () => {
  it("fills facts and shows placeholders for missing ones", () => {
    const full = buildPlan(facts, a("bank_transfer", "under_1h"), S, scripts).script!.filled;
    expect(full).toContain("RM 1,200");
    expect(full).toContain("Ali Bin Hassan");
    expect(full).toContain("1234567890123");
    expect(fillScript(scripts[0].template, {})).toContain("[amount?]");
  });
  it("editing a fact changes the script", () => {
    const edited = { ...facts, amount: { value: { value: 900, currency: "MYR" }, edited: true } };
    expect(buildPlan(edited, a("bank_transfer", "under_1h"), S, scripts).script!.filled).toContain("RM 900");
  });
  it("e-wallet has no bank script", () => {
    expect(buildPlan(facts, a("ewallet", "under_1h"), S, scripts).script).toBeUndefined();
  });
});

describe("demo scenario", () => {
  it("every fact quote appears verbatim in the evidence", () => {
    for (const f of Object.values(facts)) expect(demo.evidence).toContain(f!.snippet!);
  });
});
