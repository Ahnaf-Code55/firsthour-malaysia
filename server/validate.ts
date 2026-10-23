import type { Channel, Facts } from "../src/types";

const CHANNELS: Channel[] = ["phone_call", "sms", "whatsapp", "job_offer", "other"];
const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
const clean = (s: unknown, max = 120) => (typeof s === "string" ? s.replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, max) : "");
const digits = (s: string) => s.replace(/\D/g, "");

type Raw = Record<string, { value?: unknown; currency?: unknown; snippet?: unknown } | undefined>;

// The model's reply is untrusted. A fact survives only if its quote appears verbatim in what the person
// wrote and its value is visible inside that quote. With a screenshot only, quotes cannot be checked,
// so the quote is dropped and the person sees and edits the value.
export function validateFacts(raw: unknown, evidence: string, imageOnly = false): Facts {
  const r = (raw && typeof raw === "object" ? raw : {}) as Raw;
  const text = norm(evidence);
  const out: Facts = {};

  const grounded = (f: Raw[string]) => {
    const snippet = clean(f?.snippet, 200);
    if (imageOnly) return { ok: true, snippet: undefined as string | undefined };
    return { ok: !!snippet && text.includes(norm(snippet)), snippet };
  };

  const a = r.amount, ag = grounded(a);
  const amt = Number(a?.value);
  if (a && ag.ok && Number.isFinite(amt) && amt > 0 && amt < 1e9 && (imageOnly || digits(ag.snippet!.replace(/,/g, "")).includes(String(Math.trunc(amt)))))
    out.amount = { value: { value: amt, currency: /^[A-Z]{3}$/.test(String(a.currency)) ? String(a.currency) : "MYR" }, snippet: ag.snippet };

  for (const k of ["occurredAt", "payee", "startedHow"] as const) {
    const f = r[k], g = grounded(f), v = clean(f?.value);
    if (f && v && g.ok && (imageOnly || k !== "payee" || norm(g.snippet!).includes(norm(v)))) out[k] = { value: v, snippet: g.snippet };
  }
  const acc = r.account, ac = grounded(acc), accv = digits(String(acc?.value ?? ""));
  if (acc && ac.ok && accv.length >= 6 && accv.length <= 20 && (imageOnly || digits(ac.snippet!).includes(accv))) out.account = { value: accv, snippet: ac.snippet };

  const ch = r.channel, cg = grounded(ch);
  if (ch && cg.ok && CHANNELS.includes(ch.value as Channel)) out.channel = { value: ch.value as Channel, snippet: cg.snippet };
  return out;
}
