import { useState } from "react";
import { t } from "../i18n/t";
import type { Fact, Facts, Lang } from "../types";

type Key = "amount" | "occurredAt" | "payee" | "account" | "startedHow";
const KEYS: Key[] = ["amount", "occurredAt", "payee", "account", "startedHow"];

const read = (f: Facts, k: Key) => (k === "amount" ? (f.amount ? String(f.amount.value.value) : "") : ((f[k] as Fact<string> | undefined)?.value ?? ""));

export default function FactsList({ lang, facts, onChange }: { lang: Lang; facts: Facts; onChange: (f: Facts) => void }) {
  // Start in edit mode when nothing was read, and stay there until the person presses "Done editing".
  const [editing, setEditing] = useState(Object.keys(facts).length === 0);
  const [draft, setDraft] = useState<string | null>(null); // amount typed so far, e.g. "12."
  function edit(k: Key, text: string) {
    const next: Facts = { ...facts };
    if (k === "amount") {
      setDraft(text);
      const n = Number(text.replace(/,/g, ""));
      if (!text.trim()) delete next.amount;
      else if (Number.isFinite(n) && n >= 0 && n < 1e9) next.amount = { value: { value: n, currency: facts.amount?.value.currency ?? "MYR" }, edited: true };
      else return;
    } else if (!text.trim()) delete next[k];
    else if (k === "account") next.account = { value: text.replace(/\D/g, ""), edited: true };
    else next[k] = { value: text, edited: true };
    onChange(next);
  }
  return (
    <div className="facts">
      <button className="link" onClick={() => setEditing(!editing)}>{t(lang, editing ? "facts.done" : "facts.edit")}</button>
      {KEYS.map((k) => {
        const f = facts[k];
        if (!editing && !f) return null;
        return (
          <div key={k} className="fact">
            {editing ? (
              <>
                <label htmlFor={`f-${k}`}>{t(lang, `fact.${k}`)}</label>
                <input id={`f-${k}`} value={k === "amount" && draft !== null ? draft : read(facts, k)} inputMode={k === "amount" || k === "account" ? "decimal" : "text"}
                  onChange={(e) => edit(k, e.target.value)} onBlur={() => setDraft(null)} />
              </>
            ) : (
              <p className="row"><span className="muted">{t(lang, `fact.${k}`)}</span> <strong>{read(facts, k)}</strong></p>
            )}
            {f?.edited ? <p className="quote">{t(lang, "fact.edited")}</p>
              : f?.snippet ? <p className="quote">{t(lang, "fact.from")} <q>{f.snippet}</q></p> : null}
          </div>
        );
      })}
    </div>
  );
}
