import { t } from "../i18n/t";
import { hhmm } from "../lib/time";
import type { Lang, Step, TimelineEvent } from "../types";



export default function Timeline({ lang, events, steps }: { lang: Lang; events: TimelineEvent[]; steps: Step[] }) {
  if (!events.length) return <p className="muted">{t(lang, "timeline.empty")}</p>;
  const stepTitle = (id: string) => t(lang, steps.find((s) => s.id === id)?.titleKey ?? id);
  return (
    <ul className="timeline">
      {events.map((e, i) => (
        <li key={i}>
          <time>{hhmm(e.at)}</time>{" "}
          {e.labelKey === "timeline.ticked" ? t(lang, e.labelKey, { step: stepTitle(e.text!) }) : t(lang, e.labelKey!, { when: e.text ?? "" })}
        </li>
      ))}
    </ul>
  );
}
