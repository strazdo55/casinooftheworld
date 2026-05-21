import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import { redirectStubHtml } from "./lib/paths.mjs";

async function walk(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith(".") && e.name !== "node_modules") {
      await walk(p, files);
    } else if (e.name.endsWith(".html") && e.name !== "index.html" && e.name !== "404.html") {
      files.push(p);
    }
  }
  return files;
}

const stub = redirectStubHtml();
let count = 0;

for (const full of await walk(ROOT)) {
  const rel = path.relative(ROOT, full).replace(/\\/g, "/");
  const content = await fs.readFile(full, "utf8");
  if (!content.includes("Redirecting") || content.length > 2000) continue;
  await fs.writeFile(full, stub);
  console.log("Fixed stub:", rel);
  count++;
}

console.log(`Updated ${count} redirect stubs.`);
