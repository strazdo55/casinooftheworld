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

  const extra = {
    velobet:
      "https://static.casino.guru/pict/529248/6219_500x250_dark_2.svg?timestamp=1760349458000&imageDataId=1484566",
  };

  const urls = [
    extra[op.slug],
    `https://www.google.com/s2/favicons?domain=${op.domain}&sz=128`,
    `https://logo.clearbit.com/${op.domain}`,
  ].filter(Boolean);

  for (const url of urls) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) continue;
      const ct = res.headers.get("content-type") || "";
      const text = ct.includes("svg") ? await res.text() : null;
      if (text?.includes("base64,")) {
        const m = text.match(/base64,([A-Za-z0-9+/=]+)/);
        if (m) {
          const buf = Buffer.from(m[1], "base64");
          if (buf.length >= 200) {
            await fs.writeFile(out, buf);
            console.log("Saved logo:", op.slug, "(from SVG)");
            return;
          }
        }
      }
      const buf = text ? Buffer.from(text, "utf8") : Buffer.from(await res.arrayBuffer());
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
