import { t } from "../i18n/t";
import type { Lang, Step, Ticks } from "../types";

type Props = { lang: Lang; steps: Step[]; ticks: Ticks; onTick: (id: string) => void };

export default function StepList({ lang, steps, ticks, onTick }: Props) {
  return (
    <ol className="steps">
      {steps.map((s) => (
        <li key={s.id} className={ticks[s.id] ? "done" : ""}>
          <label className="tick">
            <input type="checkbox" checked={!!ticks[s.id]} onChange={() => onTick(s.id)} />
            <span>{t(lang, "plan.done")}</span>
          </label>
          <h3>{t(lang, s.titleKey)}</h3>
          <p>{t(lang, s.bodyKey)}</p>
          {s.actions.map((a, i) =>
            a.type === "call" ? <a key={i} className="primary" href={`tel:${a.tel}`}>{t(lang, a.labelKey)}</a>
            : a.type === "link" ? <a key={i} className="primary" href={a.url} target="_blank" rel="noreferrer noopener">{t(lang, a.labelKey)}</a>
            : null)}
          <p className="source">
            {t(lang, "plan.source")}:{" "}
            {s.sources.map((src) => (
              <span key={src.url}><a href={src.url} target="_blank" rel="noreferrer noopener">{src.name}</a>, {t(lang, "plan.checked")} {src.retrievedOn}. </span>
            ))}
          </p>
        </li>
      ))}
    </ol>
  );
}
