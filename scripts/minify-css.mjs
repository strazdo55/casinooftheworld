import fs from "fs/promises";
import path from "path";
import CleanCSS from "clean-css";
import { ROOT } from "./lib/env.mjs";

const src = path.join(ROOT, "css/main.css");
const out = path.join(ROOT, "css/main.min.css");

async function main() {
  const input = await fs.readFile(src, "utf8");
  const result = new CleanCSS({ level: 2 }).minify(input);
  if (result.errors?.length) {
    console.warn("CSS minify warnings:", result.errors);
  }
  await fs.writeFile(out, result.styles);
  const before = input.length;
  const after = result.styles.length;
  console.log(
    `CSS minified: ${(before / 1024).toFixed(1)}KB → ${(after / 1024).toFixed(1)}KB (${Math.round((1 - after / before) * 100)}% smaller)`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
