import { useRef, useState } from "react";
import { t } from "../i18n/t";
import type { Lang } from "../types";

export default function CallScript({ lang, text }: { lang: Lang; text: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      ref.current?.select();
      setState("manual");
    }
    setTimeout(() => setState("idle"), 2500);
  }
  return (
    <div>
      <textarea ref={ref} className="script" readOnly rows={7} value={text} aria-label={t(lang, "script.heading")} />
      <button className="primary" onClick={copy} aria-live="polite">
        {state === "copied" ? t(lang, "script.copied") : state === "manual" ? t(lang, "script.manual") : t(lang, "script.copy")}
      </button>
      <p className="muted">{t(lang, "script.english")}</p>
    </div>
  );
}
