import en from "./en.json";
import bn from "./bn.json";
import type { Lang } from "../types";

const dict: Record<Lang, Record<string, string>> = { en, bn };

export function t(lang: Lang, key: string, vars: Record<string, string> = {}): string {
  const s = dict[lang][key] ?? dict.en[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}
