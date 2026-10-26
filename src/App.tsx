import { useEffect, useMemo, useRef, useState } from "react";
import demo from "../data/demo-scenario.json";
import steps from "../data/steps.json";
import scripts from "../data/call-scripts.json";
import { t } from "./i18n/t";
import { extractFacts } from "./lib/extract";
import { buildPlan } from "./lib/plan";
import StartPage from "./pages/StartPage";
import PlanPage from "./pages/PlanPage";
import SummaryPage from "./pages/SummaryPage";
import Disclaimer from "./components/Disclaimer";
import type { Answers, ExtractResult, Facts, Step, Ticks } from "./types";

const view = () => (location.hash === "#/plan" ? "plan" : location.hash === "#/summary" ? "summary" : "start");

export default function App() {
  const [page, setPage] = useState(view());
  const [answers, setAnswers] = useState<Answers>({ payment: "bank_transfer", window: "under_1h", lang: "en" });
  const [evidence, setEvidence] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [facts, setFacts] = useState<Facts>({});
  const [source, setSource] = useState<ExtractResult["source"]>("offline");
  const [loading, setLoading] = useState(false);
  const [ticks, setTicks] = useState<Ticks>({});
  const run = useRef(0);
  const lang = answers.lang;

  useEffect(() => {
    const on = () => setPage(view());
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const plan = useMemo(() => buildPlan(facts, answers, steps as Step[], scripts, ticks), [facts, answers, ticks]);

  async function go(text: string, img?: string) {
    const mine = ++run.current;
    setLoading(true);
    const r = await extractFacts(text, img);
    if (mine !== run.current) return; // a newer submission replaced this one
    setFacts(r.facts);
    setSource(r.source);
    setTicks({});
    setLoading(false);
    location.hash = "#/plan";
  }
  function sample() {
    setAnswers({ ...answers, ...demo.answers } as Answers);
    setEvidence(demo.evidence);
    setImage(undefined);
    void go(demo.evidence);
  }
  const readerOffline = source === "offline" && (evidence.trim() !== "" || !!image);

  return (
    <>
      <header className="top noprint">
        <a href="#/" className="brand">{t(lang, "app.name")}</a>
        <button className="lang" onClick={() => setAnswers({ ...answers, lang: lang === "en" ? "bn" : "en" })}>{t(lang, "lang.toggle")}</button>
      </header>
      <main>
        {loading && <p role="status" className="banner">{t(lang, "plan.reading")}</p>}
        {page === "plan" ? (
          <PlanPage lang={lang} plan={plan} facts={facts} setFacts={setFacts} ticks={ticks} readerOffline={readerOffline} source={source}
            onTick={(id) => setTicks((x) => { const n = { ...x }; if (n[id]) delete n[id]; else n[id] = new Date().toISOString(); return n; })} />
        ) : page === "summary" ? (
          <SummaryPage lang={lang} plan={plan} facts={facts} ticks={ticks} />
        ) : (
          <StartPage lang={lang} answers={answers} setAnswers={setAnswers} evidence={evidence} setEvidence={setEvidence}
            image={image} setImage={setImage} onGo={() => go(evidence, image)} onSample={sample} />
        )}
      </main>
      <Disclaimer lang={lang} />
    </>
  );
}
