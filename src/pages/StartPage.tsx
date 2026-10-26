import { useState } from "react";
import { t } from "../i18n/t";
import { prepareImage } from "../lib/image";
import type { Answers, Lang, Payment, Window } from "../types";

const PAYMENTS: Payment[] = ["bank_transfer", "ewallet", "card", "cash_deposit", "crypto", "other"];
const WINDOWS: Window[] = ["under_1h", "1_to_24h", "over_24h"];

type Props = {
  lang: Lang; answers: Answers; setAnswers: (a: Answers) => void;
  evidence: string; setEvidence: (s: string) => void; image?: string; setImage: (s?: string) => void; onGo: () => void; onSample: () => void;
};

export default function StartPage({ lang, answers, setAnswers, evidence, setEvidence, image, setImage, onGo, onSample }: Props) {
  const [imgError, setImgError] = useState("");
  async function pick(file?: File) {
    setImgError("");
    if (!file) return;
    const r = await prepareImage(file);
    if (r.ok) setImage(r.base64); else { setImage(undefined); setImgError(r.reason); }
  }
  return (
    <section>
      <h1>{t(lang, "start.heading")}</h1>
      <p className="muted">{t(lang, "app.tagline")}</p>
      <button className="primary" onClick={onSample}>{t(lang, "start.sample")}</button>

      <label htmlFor="payment">{t(lang, "start.payment")}</label>
      <select id="payment" value={answers.payment} onChange={(e) => setAnswers({ ...answers, payment: e.target.value as Payment })}>
        {PAYMENTS.map((p) => <option key={p} value={p}>{t(lang, `payment.${p}`)}</option>)}
      </select>

      <label htmlFor="window">{t(lang, "start.window")}</label>
      <select id="window" value={answers.window} onChange={(e) => setAnswers({ ...answers, window: e.target.value as Window })}>
        {WINDOWS.map((w) => <option key={w} value={w}>{t(lang, `window.${w}`)}</option>)}
      </select>

      <label htmlFor="evidence">{t(lang, "start.evidence")}</label>
      <textarea id="evidence" rows={7} value={evidence} onChange={(e) => setEvidence(e.target.value)} />
      <p className="muted">{t(lang, "start.evidence_hint")}</p>
      <label htmlFor="shot">{t(lang, "start.screenshot")}</label>
      <input id="shot" type="file" accept="image/png,image/jpeg" onChange={(e) => pick(e.target.files?.[0])} />
      <p className="muted">{t(lang, "start.screenshot_hint")}</p>
      {image && <p>{t(lang, "image.added")} <button className="link" onClick={() => setImage(undefined)}>{t(lang, "image.remove")}</button></p>}
      {imgError && <p className="banner" role="alert">{t(lang, `image.${imgError}`)}</p>}
      <button className="primary" onClick={onGo}>{t(lang, "start.go")}</button>
    </section>
  );
}
