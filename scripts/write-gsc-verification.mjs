import fs from "fs/promises";
import path from "path";
import { ROOT, GOOGLE_SITE_VERIFICATION } from "./lib/env.mjs";

/**
 * Optional HTML-file verification (alternative to meta tag in buildHead).
 * Set GOOGLE_SITE_VERIFICATION_FILENAME=googleXXXXXXXX.html in .env if Search Console
 * gave you a file upload method.
 */
async function main() {
  const filename = process.env.GOOGLE_SITE_VERIFICATION_FILENAME || "";
  if (!filename) {
    console.log(
      "GSC file skip: set GOOGLE_SITE_VERIFICATION_FILENAME=googleXXXX.html in .env (optional)."
    );
    return;
  }

  if (!GOOGLE_SITE_VERIFICATION) {
    console.warn(
      "GSC file skip: GOOGLE_SITE_VERIFICATION token required for file content."
    );
    return;
  }

  const out = path.join(ROOT, filename);
  const body = `google-site-verification: ${filename}\n`;
  await fs.writeFile(out, body);
  console.log("Wrote Search Console verification file:", filename);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
