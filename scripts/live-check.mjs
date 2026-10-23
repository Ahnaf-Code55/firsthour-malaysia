// Runs the sample case through POST /api/extract N times (dev server must be running) and counts correct readings.
// Usage: node scripts/live-check.mjs [url] [runs]
import { readFileSync } from "node:fs";
const demo = JSON.parse(readFileSync("data/demo-scenario.json", "utf8"));
const url = process.argv[2] ?? "http://localhost:5199/api/extract";
const N = Number(process.argv[3] ?? 10);
let ok = 0;
for (let i = 1; i <= N; i++) {
  try {
    const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ evidence: demo.evidence }) });
    const j = await r.json();
    const f = j.facts ?? {};
    const miss = [];
    if (f.amount?.value?.value !== 1200) miss.push("amount");
    if (f.account?.value !== "1234567890123") miss.push("account");
    if (!/ali bin hassan/i.test(f.payee?.value ?? "")) miss.push("payee");
    if (!f.occurredAt) miss.push("occurredAt");
    if (!f.startedHow) miss.push("startedHow");
    console.log(i, r.status, miss.length ? "MISSING " + miss.join(",") : "ok", j.error ?? "");
    if (!miss.length) ok++;
  } catch {
    console.log(i, "request failed");
  }
}
console.log(`${ok}/${N} fully correct`);
