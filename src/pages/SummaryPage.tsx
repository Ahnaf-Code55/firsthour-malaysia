import { t } from "../i18n/t";
import { hhmm } from "../lib/time";
import Timeline from "../components/Timeline";
import type { Facts, Lang, Plan, Ticks } from "../types";

const KEYS = ["amount", "occurredAt", "payee", "account", "startedHow"] as const;
const val = (f: Facts, k: (typeof KEYS)[number]) => (k === "amount" ? (f.amount ? `RM ${f.amount.value.value.toLocaleString("en-MY")}` : "") : f[k]?.value ?? "");

export default function SummaryPage({ lang, plan, facts, ticks }: { lang: Lang; plan: Plan; facts: Facts; ticks: Ticks }) {
  return (
    <section className="summary">
      <p className="noprint"><a href="#/plan">{t(lang, "summary.back")}</a></p>
      <h1>{t(lang, "summary.heading")}</h1>
      <p className="muted">{t(lang, "summary.hint")}</p>
      <button className="primary noprint" onClick={() => window.print()}>{t(lang, "summary.print")}</button>
      <p className="noprint muted">{t(lang, "nothing_saved")}</p>

      <h2>{t(lang, "summary.facts")}</h2>
      <dl className="facts-print">
        {KEYS.map((k) => (
          <div key={k}><dt>{t(lang, `fact.${k}`)}</dt><dd>{val(facts, k) || t(lang, "summary.none")}</dd></div>
        ))}
      </dl>

      <h2>{t(lang, "plan.steps")}</h2>
      <ol>
        {plan.steps.map((s) => (
          <li key={s.id}>
            <strong>{t(lang, s.titleKey)}</strong>{" "}
            <span>{ticks[s.id] ? `✓ ${t(lang, "summary.done_at", { at: hhmm(ticks[s.id]) })}` : `☐ ${t(lang, "summary.not_done")}`}</span>
          </li>
        ))}
      </ol>

      {plan.script && (<><h2>{t(lang, "summary.script")}</h2><p className="script-print">{plan.script.filled}</p></>)}

      <h2>{t(lang, "plan.timeline")}</h2>
      <Timeline lang={lang} events={plan.timeline} steps={plan.steps} />

      <h2>{t(lang, "summary.sources")}</h2>
      <ul className="sources-print">
        {[...new Map(plan.steps.flatMap((s) => s.sources).map((x) => [x.url, x])).values()].map((x) => (
          <li key={x.url}>{x.name}, {t(lang, "plan.checked")} {x.retrievedOn}<br /><small>{x.url}</small></li>
        ))}
      </ul>
    </section>
  );
}
