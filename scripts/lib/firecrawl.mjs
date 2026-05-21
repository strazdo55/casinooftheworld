import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import { ROOT, firecrawlEnv } from "./env.mjs";

export function runFirecrawl(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("firecrawl", args, {
      cwd: ROOT,
      env: firecrawlEnv(),
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`firecrawl ${args.join(" ")} failed: ${stderr || stdout}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

export async function firecrawlScrape(url, outFile) {
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await runFirecrawl([
    "scrape",
    url,
    "--only-main-content",
    "-o",
    outFile,
  ]);
  return fs.readFile(outFile, "utf8");
}

export async function firecrawlSearch(query, outFile, extra = []) {
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await runFirecrawl([
    "search",
    query,
    "--json",
    "--limit",
    "5",
    ...extra,
    "-o",
    outFile,
  ]);
  const raw = await fs.readFile(outFile, "utf8");
  return JSON.parse(raw);
}
