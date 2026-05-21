import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";

const operators = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/operators.json"), "utf8")
);

async function fetchLogo(op) {
  const outDir = path.join(ROOT, "assets/images/operators");
  await fs.mkdir(outDir, { recursive: true });
  const out = path.join(outDir, `${op.slug}.png`);

  const urls = [
    `https://www.google.com/s2/favicons?domain=${op.domain}&sz=128`,
    `https://logo.clearbit.com/${op.domain}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 200) continue;
      await fs.writeFile(out, buf);
      console.log("Saved logo:", op.slug);
      return;
    } catch {
      /* try next */
    }
  }
  console.warn("No logo for", op.slug);
}

for (const op of operators) {
  await fetchLogo(op);
}
