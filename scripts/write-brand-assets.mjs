import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import { LOGO_FILE_SVG, FAVICON_SVG } from "./lib/brand.mjs";

const brandDir = path.join(ROOT, "assets/images/brand");

await fs.mkdir(brandDir, { recursive: true });
await fs.writeFile(path.join(brandDir, "logo.svg"), LOGO_FILE_SVG.trim() + "\n");
await fs.writeFile(path.join(brandDir, "favicon.svg"), FAVICON_SVG.trim() + "\n");
console.log("Brand assets written: logo.svg, favicon.svg");
