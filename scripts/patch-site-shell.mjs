import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";

const RAIL_RE = /<aside class="side-rail[\s\S]*?<\/aside>\s*/;

async function walk(dir, files = []) {
  for (const name of await fs.readdir(dir, { withFileTypes: true })) {
    if (name.name.startsWith(".") || name.name === "node_modules") continue;
    const full = path.join(dir, name.name);
    if (name.isDirectory()) await walk(full, files);
    else if (name.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function patchShell(html) {
  if (html.includes("site-shell")) return html;

  let out = html.replace(/<\/header>\s*/, "</header>\n<div class=\"site-shell\">\n  <div class=\"site-shell__content\">\n");

  const rail = out.match(RAIL_RE)?.[0];
  if (rail) {
    out = out.replace(RAIL_RE, "");
    out = out.replace(
      /<footer class="site-footer">/,
      `  </div>\n  ${rail.trim()}\n</div>\n<footer class="site-footer">`
    );
  } else {
    out = out.replace(
      /<footer class="site-footer">/,
      '  </div>\n</div>\n<footer class="site-footer">'
    );
  }

  return out;
}

async function main() {
  let n = 0;
  for (const file of await walk(ROOT)) {
    let html = await fs.readFile(file, "utf8");
    if (!html.includes("site-footer")) continue;
    const next = patchShell(html);
    if (next === html) continue;
    await fs.writeFile(file, next);
    n++;
  }
  console.log(`Site shell layout applied to ${n} page(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
