import { useState } from "react";
import { t } from "../i18n/t";
import type { Fact, Facts, Lang } from "../types";

type Key = "amount" | "occurredAt" | "payee" | "account" | "startedHow";
const KEYS: Key[] = ["amount", "occurredAt", "payee", "account", "startedHow"];

const read = (f: Facts, k: Key) => (k === "amount" ? (f.amount ? String(f.amount.value.value) : "") : ((f[k] as Fact<string> | undefined)?.value ?? ""));

export default function FactsList({ lang, facts, onChange }: { lang: Lang; facts: Facts; onChange: (f: Facts) => void }) {
  function edit(k: Key, text: string) {
    const next: Facts = { ...facts };
    if (!text.trim()) delete next[k];
    else if (k === "amount") next.amount = { value: { value: Number(text.replace(/[^0-9.]/g, "")) || 0, currency: facts.amount?.value.currency ?? "MYR" }, edited: true };
    else if (k === "account") next.account = { value: text.replace(/\D/g, ""), edited: true };
    else next[k] = { value: text, edited: true };
    onChange(next);
  }
  const [editing, setEditing] = useState(false);
  const empty = KEYS.every((k) => !read(facts, k));
  const show = editing || empty;
  return (
    <div className="facts">
      {!empty && <button className="link" onClick={() => setEditing(!editing)}>{t(lang, editing ? "facts.done" : "facts.edit")}</button>}
      {KEYS.map((k) => {
        const f = facts[k];
        if (!show && !f) return null;
        return (
          <div key={k} className="fact">
            {show ? (
              <>
                <label htmlFor={`f-${k}`}>{t(lang, `fact.${k}`)}</label>
                <input id={`f-${k}`} value={read(facts, k)} inputMode={k === "amount" || k === "account" ? "numeric" : "text"} onChange={(e) => edit(k, e.target.value)} />
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
