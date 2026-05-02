import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import { analyzeGraph } from "./src/server/analyzer";
import { extractBlock } from "./src/server/extractor";

const WEB_APP_ROOT = path.resolve(__dirname, "../web-app");
const MONOREPO_ROOT = path.resolve(__dirname, "../..");

export default defineConfig({
  plugins: [
    react(),
    {
      name: "dev-graph-api",
      configureServer(server) {
        // GET /api/graph — full codebase analysis
        server.middlewares.use("/api/graph", async (_req, res) => {
          try {
            const graph = await analyzeGraph(WEB_APP_ROOT);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(graph));
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: message }));
          }
        });

        // GET /api/file?path=src/...&line=N — extract enclosing function at line
        server.middlewares.use("/api/file", (req, res) => {
          try {
            const url = new URL(req.url ?? "", "http://localhost");
            const relPath = url.searchParams.get("path");
            const line = parseInt(url.searchParams.get("line") ?? "1", 10);
            if (!relPath) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Missing path param" }));
              return;
            }
            // If relPath is already absolute, use it directly; otherwise resolve from webAppRoot
            const abs = path.isAbsolute(relPath)
              ? relPath
              : path.resolve(WEB_APP_ROOT, relPath);
            if (!abs.startsWith(MONOREPO_ROOT)) {
              res.statusCode = 403;
              res.end(JSON.stringify({ error: "Forbidden" }));
              return;
            }
            // .prisma files can't be parsed by ts-morph — extract block by braces
            if (abs.endsWith(".prisma")) {
              const allLines = fs.readFileSync(abs, "utf-8").split("\n");
              const total = allLines.length;
              const safeLine = Math.min(Math.max(1, line), total);
              // Walk forward from target line to find closing brace of the block
              let fnStart = safeLine - 1;
              let fnEnd = fnStart;
              while (fnEnd < total - 1 && !/^\}/.test(allLines[fnEnd])) fnEnd++;
              const code = allLines.slice(fnStart, fnEnd + 1).join("\n");
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({
                functionName: allLines[fnStart].trim().replace(/\s*\{.*/, ""),
                code,
                startLine: 1,
                targetLine: safeLine,
                fnStartLine: fnStart + 1,
                fnEndLine: fnEnd + 1,
                absolutePath: abs,
              }));
              return;
            }

            const tsConfigPath = path.join(WEB_APP_ROOT, "tsconfig.json");
            const block = extractBlock(abs, line, tsConfigPath);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ...block, absolutePath: abs }));
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: message }));
          }
        });
      },
    },
  ],
  server: {
    port: 3001,
  },
});
