import type { RedFlag, Source } from "../types";

export type Rule = { id: string; labelKey: string; explainKey: string; patterns: { en: string[]; bn: string[] }; sources: Source[] };

// Matches both languages: someone on the Bangla screen may paste an English message.
export function scanMessage(raw: string, rules: Rule[]): RedFlag[] {
  const text = raw.slice(0, 5000).replace(/\s+/g, " "); // cap length (regex cost) and ignore line breaks
  return rules
    .filter((r) => [...r.patterns.en, ...r.patterns.bn].some((p) => new RegExp(p, "iu").test(text)))
    .map(({ id, labelKey, explainKey, sources }) => ({ id, labelKey, explainKey, sources }));
}
