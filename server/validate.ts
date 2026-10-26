import type { Channel, Facts } from "../src/types";

const CHANNELS: Channel[] = ["phone_call", "sms", "whatsapp", "job_offer", "other"];
const clean = (s: unknown, max = 120) => (typeof s === "string" ? s.replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, max) : "");
const normalizeDigits = (s: string) => s.normalize("NFKC").replace(/[০-৯]/g, (digit) => String(digit.charCodeAt(0) - 0x09e6));
const digits = (s: string) => normalizeDigits(s).replace(/\D/g, "");
const normalizedTime = (s: string) => normalizeDigits(s).toLowerCase().replace(/(\d)\s*(am|pm)\b/g, "$1 $2").replace(/\s+/g, " ").trim();
const safeTime = (value: string, snippet?: string) => {
  const normalized = normalizedTime(value);
  const match = normalized.match(/^(\d{1,2}):([0-5]\d)(?: (am|pm))?(?: (today|yesterday|আজ|গতকাল))?$/);
  if (!match) return false;
  const hour = Number(match[1]);
  if (match[3] ? hour < 1 || hour > 12 : hour > 23) return false;
  if (!snippet) return true; // Screenshot-only facts have no text quote to compare.
  const quoted = normalizedTime(snippet);
  let at = quoted.indexOf(normalized);
  while (at >= 0) {
    const before = quoted[at - 1] ?? "", after = quoted[at + normalized.length] ?? "";
    if (!/[\p{L}\p{N}:]/u.test(before) && !/[\p{L}\p{N}:]/u.test(after)) return true;
    at = quoted.indexOf(normalized, at + 1);
  }
  return false;
};
const tokens = (s: string) => (normalizeDigits(s).match(/\d[\d -]*\d|\d/g) ?? []).map(digits);
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
  const amt = typeof a?.value === "number" ? a.value : Number(normalizeDigits(String(a?.value ?? "")));
  if (a && ag.ok && Number.isFinite(amt) && amt > 0 && amt < 1e9 && (imageOnly || (normalizeDigits(ag.snippet!).replace(/,/g, "").match(/\d+(?:\.\d+)?/g) ?? []).some((n) => Number(n) === amt)))
    out.amount = { value: { value: amt, currency: /^[A-Z]{3}$/.test(String(a.currency)) ? String(a.currency) : "MYR" }, snippet: ag.snippet };

  for (const k of ["occurredAt"] as const) {
    const f = r[k], g = grounded(f), v = clean(f?.value);
    if (f && v && g.ok && safeTime(v, g.snippet)) out.occurredAt = { value: v.slice(0, 80), snippet: g.snippet };
  }
  // A quoted phrase can still be an instruction disguised as a name. The person
  // enters the payee manually; no model-derived payee reaches the call script.
  const acc = r.account, ac = grounded(acc), accv = digits(String(acc?.value ?? ""));
  if (acc && ac.ok && accv.length >= 6 && accv.length <= 20 && (imageOnly || tokens(ac.snippet!).includes(accv))) out.account = { value: accv, snippet: ac.snippet };

  const ch = r.channel, cg = grounded(ch);
  if (ch && cg.ok && CHANNELS.includes(ch.value as Channel)) {
    out.channel = { value: ch.value as Channel, snippet: cg.snippet };
    out.startedHow = { value: CHANNEL_DESCRIPTIONS[ch.value as Channel], snippet: cg.snippet };
  }
  return out;
}
