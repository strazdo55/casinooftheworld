import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import { header } from "./lib/html.mjs";

function inferActivePath(relativePath) {
  const rel = relativePath.replace(/\\/g, "/");
  if (rel === "index.html") return "/";
  if (rel === "blog/index.html" || rel.startsWith("blog/")) return "/blog/";
  const top = rel.split("/")[0].replace(/\.html$/i, "");
  const map = {
    "online-casinos": "/online-casinos/",
    bonuses: "/bonuses/",
    games: "/games/",
    banking: "/banking/",
    reviews: "/reviews/",
    "europe-casinos": "/europe-casinos/",
    "casinos-by-country": "/casinos-by-country/",
    "sports-betting": "/sports-betting/",
    blog: "/blog/",
    about: "/about/",
    contact: "/contact/",
    privacy: "/privacy/",
    terms: "/terms/",
    "affiliate-disclosure": "/affiliate-disclosure/",
  };
  return map[top] || `/${top}/`;
}

async function walk(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith(".") || e.name === "node_modules") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, files);
    else if (e.name.endsWith(".html")) files.push(full);
  }
  return files;
}

const HEADER_RE = /<header class="site-header">[\s\S]*?<\/header>/;

async function main() {
  const files = await walk(ROOT);
  let updated = 0;
  for (const file of files) {
    const rel = path.relative(ROOT, file);
    let html = await fs.readFile(file, "utf8");
    if (!HEADER_RE.test(html)) continue;
    const replacement = header(inferActivePath(rel)).trim();
    const next = html.replace(HEADER_RE, replacement);
    if (next !== html) {
      await fs.writeFile(file, next);
      updated++;
    }
  }
  console.log(`Headers synced on ${updated} pages.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
