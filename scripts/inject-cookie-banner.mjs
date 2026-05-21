import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import { cookieConsent } from "./lib/html.mjs";

const MARKER = 'id="cookie-consent"';
const SNIPPET = cookieConsent();

async function walk(dir, files = []) {
  for (const name of await fs.readdir(dir, { withFileTypes: true })) {
    if (name.name.startsWith(".") || name.name === "node_modules") continue;
    const full = path.join(dir, name.name);
    if (name.isDirectory()) await walk(full, files);
    else if (name.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function stripOldBanner(html) {
  return html.replace(
    /<div class="cookie-consent"[\s\S]*?<\/div>\s*(?=<footer|<script)/,
    ""
  );
}

async function main() {
  let updated = 0;
  for (const file of await walk(ROOT)) {
    if (!file.includes("site-footer") && !(await fs.readFile(file, "utf8")).includes("site-footer"))
      continue;
    let html = await fs.readFile(file, "utf8");
    html = stripOldBanner(html);
    if (html.includes(MARKER)) continue;
    if (!html.includes("<script src=\"/js/main.js\">")) continue;
    html = html.replace(
      /<script src="\/js\/main\.js"><\/script>/,
      `${SNIPPET}\n<script src="/js/main.js"></script>`
    );
    await fs.writeFile(file, html);
    updated++;
  }
  console.log(`Cookie banner placed before script on ${updated} page(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
