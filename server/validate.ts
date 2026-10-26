import type { Channel, Facts } from "../src/types";

const CHANNELS: Channel[] = ["phone_call", "sms", "whatsapp", "job_offer", "other"];
const clean = (s: unknown, max = 120) => (typeof s === "string" ? s.replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, max) : "");
const digits = (s: string) => s.replace(/\D/g, "");
// Free text must never carry something actionable (a phone number, link or email) into the call script.
const actionable = (s: string) => /https?:\/\/|www\.|@|\d[\d\s().-]{5,}\d/i.test(s);
// Free-text facts are repeated in the call script. Keep them free of every 3+ digit
// run so a guessed date, injected hotline or OCR-read account cannot become an instruction.
const hasRiskyNumber = (s: string, allowTime = false) => {
  const normalized = s.normalize("NFKC");
  if (allowTime && /^\p{Nd}{1,2}:\p{Nd}{2}(?:\s+\p{L}+)?$/u.test(normalized)) return false;
  // Count Unicode numeric code points after normalization, regardless of separators.
  // This catches spaces, punctuation, zero-width marks, and non-ASCII digit scripts.
  return [...normalized].filter((char) => /\p{N}/u.test(char)).length >= 3;
};
const safeTime = (value: string, snippet?: string) => {
  const normalized = value.normalize("NFKC");
  const match = normalized.match(/^(?:[01]?\d|2[0-3]):[0-5]\d(?:\s+(?:today|yesterday))?$/i);
  return !!match && (!snippet || snippet.normalize("NFKC").includes(match[0])) ;
};
// A payee is a person or company name, never a sentence: at most 5 words, each capitalised (or a Malay name particle), no digits.
const NAME_WORD = /^(?:\p{Lu}[\p{L}.'’-]*|bin|binti|bte|bt|a\/l|a\/p|s\/o|d\/o)$/u;
const safeName = (v: string) => { const w = v.trim().split(/\s+/); return v.length <= 50 && w.length <= 5 && w.every((x) => NAME_WORD.test(x)) && !/[\p{N}]/u.test(v); };
const tokens = (s: string) => (s.match(/\d[\d -]*\d|\d/g) ?? []).map(digits);
const CHANNEL_DESCRIPTIONS = {
  phone_call: "a phone call",
  sms: "a text message",
  whatsapp: "a WhatsApp message",
  job_offer: "a job offer",
  other: "another contact",
} as const;

type Raw = Record<string, { value?: unknown; currency?: unknown; snippet?: unknown } | undefined>;

// The model's reply is untrusted. A fact survives only if its quote appears verbatim in what the person
// wrote and its value is visible inside that quote. With a screenshot only, quotes cannot be checked,
// so the quote is dropped and the person sees and edits the value.
export function validateFacts(raw: unknown, evidence: string, imageOnly = false): Facts {
  const r = (raw && typeof raw === "object" ? raw : {}) as Raw;
  const out: Facts = {};

  const grounded = (f: Raw[string]) => {
    const snippet = typeof f?.snippet === "string" && f.snippet.length <= 200 ? f.snippet : "";
    if (imageOnly) return { ok: true, snippet: undefined as string | undefined };
    return { ok: !!snippet && evidence.includes(snippet), snippet };
  };

  const a = r.amount, ag = grounded(a);
  const amt = Number(a?.value);
  if (a && ag.ok && Number.isFinite(amt) && amt > 0 && amt < 1e9 && (imageOnly || (ag.snippet!.replace(/,/g, "").match(/\d+(?:\.\d+)?/g) ?? []).some((n) => Number(n) === amt)))
    out.amount = { value: { value: amt, currency: /^[A-Z]{3}$/.test(String(a.currency)) ? String(a.currency) : "MYR" }, snippet: ag.snippet };

  for (const k of ["occurredAt"] as const) {
    const f = r[k], g = grounded(f), v = clean(f?.value);
    if (f && v && g.ok && safeTime(v, g.snippet) && !actionable(v) && !hasRiskyNumber(v, true)) out.occurredAt = { value: v.slice(0, 80), snippet: g.snippet };
  }
  const pe = r.payee, pg = grounded(pe), pv = clean(pe?.value, 60);
  if (pe && pv && pg.ok && safeName(pv) && !actionable(pv) && (imageOnly || pg.snippet!.toLowerCase().includes(pv.toLowerCase()))) out.payee = { value: pv, snippet: pg.snippet };
  const acc = r.account, ac = grounded(acc), accv = digits(String(acc?.value ?? ""));
  if (acc && ac.ok && accv.length >= 6 && accv.length <= 20 && (imageOnly || tokens(ac.snippet!).includes(accv))) out.account = { value: accv, snippet: ac.snippet };

  const ch = r.channel, cg = grounded(ch);
  if (ch && cg.ok && CHANNELS.includes(ch.value as Channel)) {
    out.channel = { value: ch.value as Channel, snippet: cg.snippet };
    out.startedHow = { value: CHANNEL_DESCRIPTIONS[ch.value as Channel], snippet: cg.snippet };
  }
  return out;
}
