import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { MAX_BODY_BYTES, validateExtractRequest } from "./server/request";

// Serves POST /api/extract from the dev server so the API key never reaches the browser bundle.
function extractApi(keys: { gemini?: string; anthropic?: string }): Plugin {
  return {
    name: "extract-api",
    configureServer(server) {
      const WINDOW_MS = 60_000;
      const MAX_REQUESTS = 20;
      const requests = new Map<string, { startedAt: number; count: number }>();
      server.middlewares.use("/api/extract", async (req, res) => {
        const send = (code: number, body: object) => { res.statusCode = code; res.setHeader("content-type", "application/json"); res.end(JSON.stringify(body)); };
        if (req.method !== "POST") return send(405, { error: "method" });
        const origin = req.headers.origin;
        if (origin) {
          try { if (new URL(origin).host !== req.headers.host) return send(403, { error: "origin" }); }
          catch { return send(403, { error: "origin" }); }
        }
        if (!/^application\/json(?:\s*;|$)/i.test(String(req.headers["content-type"] ?? ""))) return send(415, { error: "type" });
        if (!keys.gemini && !keys.anthropic) return send(503, { error: "no_key" });
        const now = Date.now();
        const ip = req.socket.remoteAddress ?? "unknown";
        let bucket = requests.get(ip);
        if (!bucket || now - bucket.startedAt >= WINDOW_MS) bucket = { startedAt: now, count: 0 };
        bucket.count++;
        requests.set(ip, bucket);
        if (requests.size > 1_000) for (const [key, entry] of requests) if (now - entry.startedAt >= WINDOW_MS) requests.delete(key);
        if (bucket.count > MAX_REQUESTS) {
          res.setHeader("retry-after", String(Math.ceil((WINDOW_MS - (now - bucket.startedAt)) / 1_000)));
          return send(429, { error: "rate_limited" });
        }
        let size = 0; const chunks: Buffer[] = [];
        try {
          for await (const c of req) {
            size += c.length;
            if (size > MAX_BODY_BYTES) { req.resume(); return send(413, { error: "too_large" }); }
            chunks.push(c);
          }
        } catch {
          if (res.destroyed || res.writableEnded) return;
          return send(400, { error: "invalid_request" });
        }
        let body: unknown;
        try { body = JSON.parse(Buffer.concat(chunks).toString()); }
        catch { return send(400, { error: "invalid_request" }); }
        const checked = validateExtractRequest(body);
        if (!checked.ok) return send(checked.status, { error: checked.error });
        const { evidence, image } = checked;
        try {
          const { readFacts } = await server.ssrLoadModule("/server/extract.ts");
          send(200, { facts: await readFacts(evidence, keys, image) });
        } catch {
          send(502, { error: "reader_failed" }); // never log the evidence
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
  plugins: [react(), extractApi({ gemini: env.GEMINI_API_KEY || undefined, anthropic: env.ANTHROPIC_API_KEY || undefined })],
  test: { include: ["tests/**/*.test.ts"] },
  };
});
