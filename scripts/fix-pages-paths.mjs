import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith(".") && e.name !== "node_modules")
      await walk(p);
    else if (e.name.endsWith(".html")) await fix(p);
  }
}

async function fix(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  let html = await fs.readFile(file, "utf8");
  const before = html;

  /* Legacy script — do not strip /blog/ prefix (breaks clean URLs). */
  if (!rel.startsWith("blog/")) {
    html = html.replace(/href="\/blog\//g, 'href="/blog/');
  }

  html = html.replace(/href="\/index\.html"/g, 'href="index.html"');
  html = html.replace(/href="\/css\//g, (m, offset, s) => {
    const depth = rel.split("/").length - 1;
    const prefix = depth ? "../".repeat(depth) : "";
    return `href="${prefix}css/`;
  });

  if (html !== before) {
    await fs.writeFile(file, html);
    console.log("Fixed:", rel);
  }
}

await walk(ROOT);
console.log("Path fix done.");
