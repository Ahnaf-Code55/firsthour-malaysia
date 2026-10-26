import { describe, expect, it } from "vitest";
import en from "../src/i18n/en.json";
import bn from "../src/i18n/bn.json";
import steps from "../data/steps.json";
import rules from "../data/recovery-rules.json";
import banks from "../data/banks.json";

describe("i18n", () => {
  it("en and bn have identical keys", () => {
    expect(Object.keys(bn).sort()).toEqual(Object.keys(en).sort());
  });
  it("no empty strings", () => {
    for (const d of [en, bn]) for (const v of Object.values(d)) expect(v.trim()).not.toBe("");
  });
  it("every key used by data files exists", () => {
    const keys = [...steps.flatMap((s) => [s.titleKey, s.bodyKey, ...s.actions.map((a: any) => a.labelKey).filter(Boolean)]), ...rules.flatMap((r) => [r.labelKey, r.explainKey])];
    for (const k of keys) expect(en).toHaveProperty([k]);
  });
  it("banks have a dated source", () => {
    for (const b of banks) expect(b.source.retrievedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
