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

const LOGO_TEXT_RE = /<span class="logo-text">Casino of the World<\/span>/g;
const LOGO_TEXT_NEW =
  '<span class="logo-text">Casino of the <span class="logo-accent">World</span></span>';

async function patch(file) {
  let html = await fs.readFile(file, "utf8");
  let next = html;
  let changed = false;

  if (IMG_RE.test(html)) {
    IMG_RE.lastIndex = 0;
    next = next.replace(IMG_RE, LOGO_SVG);
    changed = true;
  } else if (INLINE_RE.test(html)) {
    next = next.replace(INLINE_RE, LOGO_SVG);
    changed = true;
  }

  if (LOGO_TEXT_RE.test(next)) {
    LOGO_TEXT_RE.lastIndex = 0;
    next = next.replace(LOGO_TEXT_RE, LOGO_TEXT_NEW);
    changed = true;
  }

  if (!changed) {
    return;
  }

  if (next !== html) {
    await fs.writeFile(file, next);
    console.log("Patched:", path.relative(ROOT, file));
  }
}

await walk(ROOT);
console.log("Logo patch done.");
