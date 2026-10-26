import { t } from "../i18n/t";
import StepList from "../components/StepList";
import FactsList from "../components/FactsList";
import CallScript from "../components/CallScript";
import CheckMessage from "../components/CheckMessage";
import Timeline from "../components/Timeline";
import type { Facts, Lang, Plan, Ticks } from "../types";

type Props = { lang: Lang; plan: Plan; facts: Facts; setFacts: (f: Facts) => void; ticks: Ticks; readerOffline: boolean; source: string; onTick: (id: string) => void };

export default function PlanPage({ lang, plan, facts, setFacts, ticks, readerOffline, source, onTick }: Props) {
  return (
    <section>
      <h1><a href="#/" className="back" aria-label={t(lang, "plan.back")}>‹</a> {t(lang, "plan.heading")}</h1>
      {plan.outOfScope && <p className="banner">{t(lang, "plan.out_of_scope")}</p>}
      <h2>{t(lang, "facts.heading")}</h2>
      {readerOffline ? <p className="banner">{t(lang, "facts.offline")}</p> : Object.keys(facts).length === 0 && <p className="muted">{t(lang, "facts.hint")}</p>}
      <FactsList lang={lang} facts={facts} onChange={setFacts} />
      {source === "fixture" && <p className="muted small">{t(lang, "reader.fixture")}</p>}
      {source === "live" && !Object.values(facts).some((f) => f?.snippet) && <p className="banner small">{t(lang, "reader.image")}</p>}
      {source === "live" && Object.values(facts).some((f) => f?.snippet) && <p className="muted small">{t(lang, "reader.live")}</p>}
      <h2>{t(lang, "plan.steps")}</h2>
      <StepList lang={lang} steps={plan.steps} ticks={ticks} onTick={onTick} />
      {plan.script && (<><h2>{t(lang, "script.heading")}</h2><CallScript lang={lang} text={plan.script.filled} /></>)}
      <h2>{t(lang, "plan.timeline")}</h2>
      <Timeline lang={lang} events={plan.timeline} steps={plan.steps} />
      <h2>{t(lang, "check.heading")}</h2>
      <CheckMessage lang={lang} />
      <p><a className="primary" href="#/summary">{t(lang, "plan.summary_link")}</a></p>
    </section>
  );
}
