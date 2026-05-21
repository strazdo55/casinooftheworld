import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import { LOGO_SVG } from "./lib/brand.mjs";

const IMG_RE =
  /<img\s+src="(?:\.\.\/)*assets\/images\/brand\/logo\.svg[^"]*"\s*[^>]*>/gi;
const INLINE_RE =
  /<svg class="logo-mark"[\s\S]*?<\/svg>/;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== "node_modules") await walk(p);
    else if (e.name.endsWith(".html")) await patch(p);
  }
}

async function patch(file) {
  let html = await fs.readFile(file, "utf8");
  let next = html;

  if (IMG_RE.test(html)) {
    IMG_RE.lastIndex = 0;
    next = next.replace(IMG_RE, LOGO_SVG);
  } else if (INLINE_RE.test(html)) {
    next = next.replace(INLINE_RE, LOGO_SVG);
  } else {
    return;
  }

  if (next !== html) {
    await fs.writeFile(file, next);
    console.log("Patched:", path.relative(ROOT, file));
  }
}

await walk(ROOT);
console.log("Logo patch done.");
