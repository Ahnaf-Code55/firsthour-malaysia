import { describe, expect, it } from "vitest";
import rules from "../data/recovery-rules.json";
import demo from "../data/demo-scenario.json";
import { scanMessage, type Rule } from "../src/lib/scan";

const R = rules as Rule[];
const ids = (t: string) => scanMessage(t, R).map((f) => f.id);

describe("scanMessage", () => {
  it("flags the demo recovery-fee message with fee, agent and link", () => {
    expect(ids(demo.followUp)).toEqual(expect.arrayContaining(["recovery-fee", "fake-agent", "refund-link"]));
  });
  it("does not flag a harmless message", () => {
    expect(ids("Hi, are we still meeting for lunch on Friday?")).toEqual([]);
  });
  it("flags a Bangla fee-for-recovery message", () => {
    expect(ids("আপনার টাকা ফেরত পেতে ৩০০ টাকা ফি জমা দিন")).toContain("recovery-fee");
  });
  it("every flag carries a dated source", () => {
    for (const f of scanMessage(demo.followUp, R)) expect(f.sources[0].retrievedOn).toMatch(/^\d{4}-/);
  });
});
