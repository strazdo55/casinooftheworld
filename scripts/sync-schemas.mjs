import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import { buildSchemaGraph, jsonLdScript } from "./lib/schema.mjs";
import { schemaOptsFromHtml } from "./lib/schema-pages.mjs";

const LD_JSON_RE = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;

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
    if (!html.includes("application/ld+json") || !html.includes("canonical")) continue;

    const opts = await schemaOptsFromHtml(html);
    if (!opts.title || !opts.description) continue;

    const graph = buildSchemaGraph(opts);
    const script = jsonLdScript(graph);
    const next = html.replace(LD_JSON_RE, script.trim());
    if (next === html) continue;
    await fs.writeFile(file, next);
    updated++;
  }
  console.log(`Linked schema @graph updated on ${updated} page(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
