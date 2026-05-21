import fs from "fs/promises";
import path from "path";
import { ROOT } from "./env.mjs";
import { sanitizeResearch } from "./sanitize-sources.mjs";

const RESEARCH_DIR = path.join(ROOT, ".firecrawl");

export async function loadOperatorResearch(op) {
  const file = op.researchFile;
  if (!file) return "";
  try {
    const raw = await fs.readFile(path.join(RESEARCH_DIR, file), "utf8");
    return sanitizeResearch(raw);
  } catch {
    return "";
  }
}
