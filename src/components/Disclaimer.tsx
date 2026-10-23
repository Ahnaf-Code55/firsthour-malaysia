import { t } from "../i18n/t";
import type { Lang } from "../types";

export default function Disclaimer({ lang }: { lang: Lang }) {
  return (
    <footer className="disclaimer">
      <p>{t(lang, "disclaimer")}</p>
      <p>{t(lang, "nothing_saved")}</p>
    </footer>
  );
}
