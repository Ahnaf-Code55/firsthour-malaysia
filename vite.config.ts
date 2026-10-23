import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Serves POST /api/extract from the dev server so the API key never reaches the browser bundle.
function extractApi(keys: { gemini?: string; anthropic?: string }): Plugin {
  return {
    name: "extract-api",
    configureServer(server) {
      server.middlewares.use("/api/extract", async (req, res) => {
        const send = (code: number, body: object) => { res.statusCode = code; res.setHeader("content-type", "application/json"); res.end(JSON.stringify(body)); };
        if (req.method !== "POST") return send(405, { error: "method" });
        if (!keys.gemini && !keys.anthropic) return send(503, { error: "no_key" });
        let size = 0; const chunks: Buffer[] = [];
        for await (const c of req) { size += c.length; if (size > 8e6) return send(413, { error: "too_large" }); chunks.push(c); }
        try {
          const { evidence = "", image } = JSON.parse(Buffer.concat(chunks).toString());
          const { readFacts } = await server.ssrLoadModule("/server/extract.ts");
          send(200, { facts: await readFacts(String(evidence).slice(0, 8000), keys, typeof image === "string" ? image : undefined) });
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
