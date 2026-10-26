import { useState } from "react";
import rules from "../../data/recovery-rules.json";
import { t } from "../i18n/t";
import { scanMessage, type Rule } from "../lib/scan";
import type { Lang, RedFlag } from "../types";

export default function CheckMessage({ lang }: { lang: Lang }) {
  const [text, setText] = useState("");
  const [flags, setFlags] = useState<RedFlag[] | null>(null);
  return (
    <div>
      <textarea id="check" aria-label={t(lang, "check.heading")} rows={4} value={text} onChange={(e) => { setText(e.target.value); setFlags(null); }} />
      <button className="primary" onClick={() => setFlags(scanMessage(text, rules as Rule[]))} disabled={!text.trim()}>{t(lang, "check.button")}</button>
      <div aria-live="polite">
        {flags && flags.length > 0 && (
          <div className="warning" role="alert">
            <h3>{t(lang, "check.warning")}</h3>
            <ul>
              {flags.map((f) => (
                <li key={f.id}>
                  <strong>{t(lang, f.labelKey)}</strong>
                  <p>{t(lang, f.explainKey)}</p>
                  {f.sources.map((s) => <p key={s.url} className="source"><a href={s.url} target="_blank" rel="noreferrer noopener">{s.name}</a>, {t(lang, "plan.checked")} {s.retrievedOn}</p>)}
                </li>
              ))}
            </ul>
          </div>
        )}
        {flags && flags.length === 0 && <p className="neutral">{t(lang, "check.none")}</p>}
      </div>
    </div>
  );
}
