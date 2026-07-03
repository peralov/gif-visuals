import { cpSync, existsSync, readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";

const DIST = "dist";
const PUBLIC = "public";
const STATIC_DIRS = ["client", "css", "gifs", "img", "mobile"];

for (const dir of STATIC_DIRS) {
  const src = join(PUBLIC, dir);
  if (existsSync(src)) {
    cpSync(src, join(DIST, dir), { recursive: true });
  }
}

writeFileSync(join(DIST, ".nojekyll"), "");

const files = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path);
    else files.push(path);
  }
}
walk(DIST);

const summary = {
  fileCount: files.length,
  hasIndexHtml: existsSync(join(DIST, "index.html")),
  hasNoJekyll: existsSync(join(DIST, ".nojekyll")),
  hasClient: existsSync(join(DIST, "client")),
  hasCss: existsSync(join(DIST, "css")),
  hasGifs: existsSync(join(DIST, "gifs")),
  topLevel: readdirSync(DIST),
};

console.log("Pages dist prepared:", JSON.stringify(summary, null, 2));

// #region agent log
fetch("http://127.0.0.1:7639/ingest/8745ffb5-4bbe-4d46-bcc3-41dbb44299cb", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Debug-Session-Id": "864d37",
  },
  body: JSON.stringify({
    sessionId: "864d37",
    runId: "prepare-dist",
    hypothesisId: "A,C,E",
    location: "scripts/prepare-pages-dist.mjs",
    message: "dist artifact summary",
    data: summary,
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion
