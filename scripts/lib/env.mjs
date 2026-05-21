import { config } from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
config({ path: path.join(root, ".env") });

export const ROOT = root;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
export const GEMINI_TEXT_MODEL =
  process.env.GEMINI_TEXT_MODEL || "gemini-2.0-flash";
export const GEMINI_IMAGE_MODEL =
  process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
export const SITE_URL =
  process.env.SITE_URL || "https://casinooftheworld.com";
/** Search Console HTML-tag verification token (meta name=google-site-verification). */
export const GOOGLE_SITE_VERIFICATION =
  process.env.GOOGLE_SITE_VERIFICATION || "";

export function requireGemini() {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY missing in .env");
  }
}

/** CLI browser login stores a valid token; a stale .env key overrides it and causes 401. */
export function firecrawlEnv() {
  const env = { ...process.env };
  if (process.env.FIRECRAWL_USE_ENV_KEY !== "1") {
    delete env.FIRECRAWL_API_KEY;
  }
  return env;
}
