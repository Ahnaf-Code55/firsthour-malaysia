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
  it("flags an upfront payment request for a Bangla refund", () => {
    expect(ids("টাকা ফেরত পেতে আগে ৩০০ টাকা পাঠান")).toContain("recovery-fee");
  });
  it("flags a Bangla police recovery-unit impersonation", () => {
    expect(ids("আমি পুলিশের টাকা উদ্ধার ইউনিটের কর্মকর্তা")).toContain("fake-agent");
  });
  it("does not flag unrelated Bangla messages with overlapping words", () => {
    for (const text of [
      "দোকান টাকা ফেরত পাঠিয়েছে",
      "আমি পুলিশের কর্মকর্তার সঙ্গে কথা বলেছি",
      "ক্লাসের ফি জমা দিতে আগে ৩০০ টাকা পাঠান",
    ]) expect(ids(text)).toEqual([]);
  });
  it("every flag carries a dated source", () => {
    for (const f of scanMessage(demo.followUp, R)) expect(f.sources[0].retrievedOn).toMatch(/^\d{4}-/);
  });

  it("is not fooled by line breaks or sentence breaks", () => {
    expect(ids("To recover your money, pay\nRM50.")).toContain("recovery-fee");
    expect(ids("Refund approved. Open https://example.com/verify")).toContain("refund-link");
  });
  it("stays fast on a hostile 300 KB message", () => {
    const t0 = Date.now();
    ids("https://x".repeat(32000));
    expect(Date.now() - t0).toBeLessThan(500);
  });
});
