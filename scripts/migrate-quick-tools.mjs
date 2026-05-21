import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import { modal, quickToolsStrip, filterBarWithTools } from "./lib/promo.mjs";

const RAIL_RE = /<aside class="side-rail[\s\S]*?<\/aside>\s*/g;
const OLD_FILTER_RE =
  /<div class="filter-bar">\s*<div class="container filter-inner">\s*<span>Find the best:<\/span>\s*<div class="filter-options">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/;

const TOPIC_LINKS = `
      <a href="/online-casinos/">Top Casinos</a>
      <a href="/bonuses/">Bonuses &amp; Free Spins</a>
      <a href="/games/">Slots &amp; Live Dealer</a>
      <a href="/banking/">Banking &amp; Payouts</a>
      <a href="/europe-casinos/">Europe &amp; Asia</a>
    `;

async function walk(dir, files = []) {
  for (const name of await fs.readdir(dir, { withFileTypes: true })) {
    if (name.name.startsWith(".") || name.name === "node_modules") continue;
    const full = path.join(dir, name.name);
    if (name.isDirectory()) await walk(full, files);
    else if (name.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function stripRails(html) {
  return html.replace(RAIL_RE, "");
}

function fixShellClosing(html) {
  return html.replace(
    /(\s*)<\/div>\s*<\/div>\s*<footer class="site-footer">/,
    "\n</div>\n<footer class=\"site-footer\">"
  );
}

function addQuickTools(html, isHome) {
  if (html.includes('class="quick-tools"')) return html;

  if (isHome) {
    if (OLD_FILTER_RE.test(html)) {
      return html.replace(OLD_FILTER_RE, filterBarWithTools(TOPIC_LINKS));
    }
    return html;
  }

  if (!html.includes('class="quick-tools"')) {
    return html.replace(/<\/header>\s*\n/, `</header>\n${quickToolsStrip()}\n`);
  }
  return html;
}

function ensureModal(html) {
  if (html.includes('class="modal-eyebrow"')) return html;
  if (html.includes('<div class="cookie-consent"')) {
    return html.replace(/<div class="cookie-consent"/, `${modal()}\n<div class="cookie-consent"`);
  }
  return html.replace(
    /<script src="\/js\/main\.js"><\/script>/,
    `${modal()}\n<script src="/js/main.js"></script>`
  );
}

async function main() {
  let n = 0;
  for (const file of await walk(ROOT)) {
    const rel = path.relative(ROOT, file);
    if (!rel.endsWith(".html") || rel.includes("node_modules")) continue;
    let html = await fs.readFile(file, "utf8");
    if (!html.includes("site-footer")) continue;

    const before = html;
    html = stripRails(html);
    html = fixShellClosing(html);
    html = addQuickTools(html, rel === "index.html");
    html = ensureModal(html);

    if (html !== before) {
      await fs.writeFile(file, html);
      n++;
    }
  }
  console.log(`Quick tools migration applied to ${n} page(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
