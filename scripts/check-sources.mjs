import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const today = new Date();
today.setUTCHours(0, 0, 0, 0);
const MAX_AGE_DAYS = 14;
const errors = [];

function readJson(path) {
  try { return JSON.parse(readFileSync(resolve(path), "utf8")); }
  catch (error) {
    errors.push(`${path}: could not read valid JSON (${error instanceof Error ? error.message : "unknown error"})`);
    return undefined;
  }
}

function checkSource(source, label) {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    errors.push(`${label}: missing source object`);
    return;
  }
  if (typeof source.url !== "string" || !/^https?:\/\//i.test(source.url)) errors.push(`${label}: source URL must be http(s)`);
  if (typeof source.retrievedOn !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(source.retrievedOn)) {
    errors.push(`${label}: retrievedOn must use YYYY-MM-DD`);
    return;
  }
  const date = new Date(`${source.retrievedOn}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== source.retrievedOn) {
    errors.push(`${label}: retrievedOn is not a real calendar date`);
    return;
  }
  const age = Math.floor((today.getTime() - date.getTime()) / 86_400_000);
  if (age > MAX_AGE_DAYS) errors.push(`${label}: source is ${age} days old (maximum ${MAX_AGE_DAYS})`);
  if (age < 0) errors.push(`${label}: retrievedOn is in the future`);
}

const steps = readJson("data/steps.json");
if (Array.isArray(steps)) steps.forEach((step, i) => {
  const label = `data/steps.json[${i}]${step?.id ? ` (${step.id})` : ""}`;
  if (!Array.isArray(step?.sources) || !step.sources.length) errors.push(`${label}: sources[0] is required`);
  checkSource(step?.sources?.[0], `${label}.sources[0]`);
});
else if (steps !== undefined) errors.push("data/steps.json: expected an array");

for (const path of ["data/banks.json", "data/recovery-rules.json"]) {
  const items = readJson(path);
  if (Array.isArray(items)) items.forEach((item, i) => {
    const label = `${path}[${i}]${item?.id ? ` (${item.id})` : ""}`;
    if (path === "data/banks.json") checkSource(item?.source, `${label}.source`);
    else {
      if (!Array.isArray(item?.sources) || !item.sources.length) errors.push(`${label}: at least one source is required`);
      for (const [j, source] of (item?.sources ?? []).entries()) checkSource(source, `${label}.sources[${j}]`);
    }
  });
  else if (items !== undefined) errors.push(`${path}: expected an array`);
}

if (errors.length) {
  console.error(`Source check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("Source check passed: required URLs and retrieval dates are present and current.");
}
