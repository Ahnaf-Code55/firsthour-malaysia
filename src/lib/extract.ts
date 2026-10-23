import demo from "../../data/demo-scenario.json";
import type { ExtractResult, Facts } from "../types";

export const FIXTURE = import.meta.env.VITE_FIXTURE === "1";

export async function extractFacts(evidence: string): Promise<ExtractResult> {
  // Slice 5 adds the live server call; until then only the sample case is readable.
  if (evidence.trim() === demo.evidence.trim()) return { facts: demo.facts as Facts, source: "fixture" };
  return { facts: {}, source: "offline" };
}
