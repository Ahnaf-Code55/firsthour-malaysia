import en from "./en.json";
import type { Lang } from "../types";

const dict: Record<Lang, Record<string, string>> = { en, bn: en };

export function t(lang: Lang, key: string, vars: Record<string, string> = {}): string {
  const s = dict[lang][key] ?? en[key as keyof typeof en] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}
