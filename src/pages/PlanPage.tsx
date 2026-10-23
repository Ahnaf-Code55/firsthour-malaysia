import { t } from "../i18n/t";
import StepList from "../components/StepList";
import Timeline from "../components/Timeline";
import type { Facts, Lang, Plan, Ticks } from "../types";

type Props = { lang: Lang; plan: Plan; facts: Facts; ticks: Ticks; readerOffline: boolean; onTick: (id: string) => void };

export default function PlanPage({ lang, plan, ticks, onTick }: Props) {
  return (
    <section>
      <p><a href="#/">{t(lang, "plan.back")}</a></p>
      <h1>{t(lang, "plan.heading")}</h1>
      {plan.outOfScope && <p className="banner">{t(lang, "plan.out_of_scope")}</p>}
      <h2>{t(lang, "plan.steps")}</h2>
      <StepList lang={lang} steps={plan.steps} ticks={ticks} onTick={onTick} />
      <h2>{t(lang, "plan.timeline")}</h2>
      <Timeline lang={lang} events={plan.timeline} steps={plan.steps} />
    </section>
  );
}
