/**
 * Append new posts from data/blog-batch.json, scaffold enrichment, build articles.
 * Usage: node scripts/add-blog-batch.mjs [--dry-run]
 */
import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import { blogPostHref } from "./lib/paths.mjs";

const dryRun = process.argv.includes("--dry-run");
const batchPath = path.join(ROOT, "data/blog-batch.json");
const blogPath = path.join(ROOT, "data/blog.json");
const enrichmentPath = path.join(ROOT, "data/blog-enrichment.json");

const existing = JSON.parse(await fs.readFile(blogPath, "utf8"));
const batch = JSON.parse(await fs.readFile(batchPath, "utf8"));
const enrichment = JSON.parse(await fs.readFile(enrichmentPath, "utf8"));

const slugs = new Set(existing.map((p) => p.slug));
const toAdd = batch.filter((p) => !slugs.has(p.slug));

if (!toAdd.length) {
  console.log("No new posts to add.");
  process.exit(0);
}

console.log(`Adding ${toAdd.length} new blog posts...`);

for (const post of toAdd) {
  if (!enrichment[post.slug]) {
    enrichment[post.slug] = {
      keywords: post.keywords || post.searchQuery,
      context: `<p class="article-context">Explore related guides on <a href="/online-casinos/">top online casinos</a> and <a href="/blog/">our casino blog</a>.</p>`,
      related: [
        { href: "/online-casinos/", label: "Best online casinos compared" },
        { href: "/bonuses/", label: "Casino bonuses & free spins" },
        { href: "/banking/", label: "Banking & payout methods" },
      ],
      external: [
        {
          href: "https://www.ncpgambling.org/",
          label: "NCPG — responsible gambling resources",
        },
        {
          href: "https://www.ecogra.org/",
          label: "eCOGRA — player protection standards",
        },
      ],
    };
  }
}

const merged = [...existing, ...toAdd];

if (dryRun) {
  console.log(
    "Dry run — would add:",
    toAdd.map((p) => p.slug).join(", ")
  );
  process.exit(0);
}

await fs.writeFile(blogPath, JSON.stringify(merged, null, 2) + "\n");
await fs.writeFile(enrichmentPath, JSON.stringify(enrichment, null, 2) + "\n");
console.log("Updated blog.json and blog-enrichment.json");
console.log("Run: npm run build:blog");
