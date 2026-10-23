import demo from "../../data/demo-scenario.json";
import type { ExtractResult, Facts } from "../types";

export const FIXTURE = import.meta.env.VITE_FIXTURE === "1";

// Order: fixture mode -> saved sample facts only. Otherwise ask the server; if it is down or has no key,
// the sample case still falls back to its saved facts (labelled "fixture") and anything else is "offline".
export async function extractFacts(evidence: string, image?: string): Promise<ExtractResult> {
  const isSample = evidence.trim() === demo.evidence.trim();
  const saved: ExtractResult = isSample ? { facts: demo.facts as Facts, source: "fixture" } : { facts: {}, source: "offline" };
  if (FIXTURE || (!evidence.trim() && !image)) return saved;
  try {
    const r = await fetch("/api/extract", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ evidence, image }) });
    if (!r.ok) return saved;
    const { facts } = (await r.json()) as { facts: Facts };
    return Object.keys(facts).length ? { facts, source: "live" } : saved;
  } catch {
    return saved;
  }
}
