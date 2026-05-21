import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import { modal } from "./lib/promo.mjs";

const PROMO_MARKER = 'class="modal-eyebrow"';
const RAIL_RE = /<aside class="side-rail[\s\S]*?<\/aside>\s*/g;

async function walk(dir, files = []) {
  for (const name of await fs.readdir(dir, { withFileTypes: true })) {
    if (name.name.startsWith(".") || name.name === "node_modules") continue;
    const full = path.join(dir, name.name);
    if (name.isDirectory()) await walk(full, files);
    else if (name.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function stripOldPromo(html) {
  let out = html.replace(RAIL_RE, "");
  out = out.replace(
    /<div class="modal-overlay"[\s\S]*?<div class="toast"[^>]*>[\s\S]*?<\/div>\s*/i,
    ""
  );
  return out;
}

function insertModal(html) {
  if (html.includes('<div class="cookie-consent"')) {
    return html.replace(/<div class="cookie-consent"/, `${modal()}\n<div class="cookie-consent"`);
  }
  return html.replace(
    /<script src="\/js\/main\.js"><\/script>/,
    `${modal()}\n<script src="/js/main.js"></script>`
  );
}

async function main() {
  let updated = 0;
  for (const file of await walk(ROOT)) {
    let html = await fs.readFile(file, "utf8");
    if (!html.includes("site-footer") || !html.includes('<script src="/js/main.js">')) {
      continue;
    }
    const before = html;
    html = stripOldPromo(html);
    if (html.includes(PROMO_MARKER)) continue;
    html = insertModal(html);
    if (html === before) continue;
    await fs.writeFile(file, html);
    updated++;
  }
  console.log(`Lead modal injected on ${updated} page(s). Use migrate-quick-tools for tools strip.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
