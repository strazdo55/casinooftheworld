import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import {
  htmlFileToDirIndex,
  htmlHrefToClean,
  redirectStubHtml,
  rewriteHtmlLinks,
} from "./lib/paths.mjs";

const SKIP_MOVE = new Set(["index.html", "404.html"]);

async function walkHtml(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith(".") && e.name !== "node_modules") {
      await walkHtml(p, files);
    } else if (e.name.endsWith(".html")) {
      files.push(path.relative(ROOT, p).replace(/\\/g, "/"));
    }
  }
  return files;
}

async function moveToDirIndex(rel) {
  if (SKIP_MOVE.has(rel) || rel.endsWith("/index.html")) return null;

  const target = htmlFileToDirIndex(rel);
  if (target === rel) return null;

  const src = path.join(ROOT, rel);
  const dest = path.join(ROOT, target);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.rename(src, dest);
  return { from: rel, to: target };
}

async function main() {
  const files = await walkHtml(ROOT);
  const moved = [];

  for (const rel of files) {
    const m = await moveToDirIndex(rel);
    if (m) moved.push(m);
  }

  for (const { from, to } of moved) {
    const clean = htmlHrefToClean(from);
    const stub = path.join(ROOT, from);
    await fs.writeFile(stub, redirectStubHtml(clean));
    console.log("Moved:", from, "→", to, "+ redirect stub");
  }

  const allHtml = await walkHtml(ROOT);
  for (const rel of allHtml) {
    const full = path.join(ROOT, rel);
    let html = await fs.readFile(full, "utf8");
    const next = rewriteHtmlLinks(html);
    if (next !== html) {
      await fs.writeFile(full, next);
      console.log("Links:", rel);
    }
  }

  const enrichmentPath = path.join(ROOT, "data/blog-enrichment.json");
  let enrichment = await fs.readFile(enrichmentPath, "utf8");
  const enrichedNext = rewriteHtmlLinks(enrichment);
  if (enrichedNext !== enrichment) {
    await fs.writeFile(enrichmentPath, enrichedNext);
    console.log("Updated: data/blog-enrichment.json");
  }

  console.log(`Done. Moved ${moved.length} pages to folder/index.html layout.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
