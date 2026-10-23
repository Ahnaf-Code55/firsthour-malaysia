import { useEffect, useMemo, useState } from "react";
import demo from "../data/demo-scenario.json";
import steps from "../data/steps.json";
import scripts from "../data/call-scripts.json";
import { t } from "./i18n/t";
import { extractFacts } from "./lib/extract";
import { buildPlan } from "./lib/plan";
import StartPage from "./pages/StartPage";
import PlanPage from "./pages/PlanPage";
import Disclaimer from "./components/Disclaimer";
import type { Answers, Facts, Step, Ticks } from "./types";

const view = () => (location.hash === "#/plan" ? "plan" : "start");

export default function App() {
  const [page, setPage] = useState(view());
  const [answers, setAnswers] = useState<Answers>({ payment: "bank_transfer", window: "under_1h", lang: "en" });
  const [evidence, setEvidence] = useState("");
  const [facts, setFacts] = useState<Facts>({});
  const [readerOffline, setReaderOffline] = useState(false);
  const [ticks, setTicks] = useState<Ticks>({});
  const lang = answers.lang;

  useEffect(() => {
    const on = () => setPage(view());
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const plan = useMemo(() => buildPlan(facts, answers, steps as Step[], scripts, ticks), [facts, answers, ticks]);

  async function go(text: string, a: Answers) {
    const r = await extractFacts(text);
    setFacts(r.facts);
    setReaderOffline(r.source === "offline" && text.trim() !== "");
    setTicks({});
    location.hash = "#/plan";
  }
  function sample() {
    const a = { ...answers, ...demo.answers } as Answers;
    setAnswers(a);
    setEvidence(demo.evidence);
    void go(demo.evidence, a);
  }

  return (
    <>
      <header className="top">
        <a href="#/" className="brand">{t(lang, "app.name")}</a>
        <button className="lang" onClick={() => setAnswers({ ...answers, lang: lang === "en" ? "bn" : "en" })}>
          {t(lang, "lang.toggle")}
        </button>
      </header>
      <main>
        {page === "plan" ? (
          <PlanPage lang={lang} plan={plan} facts={facts} setFacts={setFacts} ticks={ticks} readerOffline={readerOffline}
            onTick={(id) => setTicks((x) => { const n = { ...x }; if (n[id]) delete n[id]; else n[id] = new Date().toISOString(); return n; })} />
        ) : (
          <StartPage lang={lang} answers={answers} setAnswers={setAnswers} evidence={evidence} setEvidence={setEvidence}
            onGo={() => go(evidence, answers)} onSample={sample} />
        )}
      </main>
      <Disclaimer lang={lang} />
    </>
  );
}
