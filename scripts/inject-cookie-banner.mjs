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

async function main() {
  let updated = 0;
  for (const file of await walk(ROOT)) {
    let html = await fs.readFile(file, "utf8");
    if (!html.includes("site-footer") || html.includes(MARKER)) continue;
    html = html.replace(
      /<footer class="site-footer">/,
      `${SNIPPET}\n<footer class="site-footer">`
    );
    await fs.writeFile(file, html);
    updated++;
    console.log("Cookie banner:", path.relative(ROOT, file));
  }
  console.log(`Done. Updated ${updated} HTML file(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
