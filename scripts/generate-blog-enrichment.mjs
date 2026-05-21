import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import { linksForPost } from "./lib/semantic-links.mjs";
import { AUTHORITY } from "./lib/links.mjs";

const posts = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/blog.json"), "utf8")
);

const EXTERNAL_DEFAULT = [
  AUTHORITY.ukgc,
  AUTHORITY.mga,
  AUTHORITY.ecogra,
  AUTHORITY.begambleaware,
];

const out = {};

for (const post of posts) {
  const links = linksForPost(post.slug, post.category);
  out[post.slug] = {
    keywords: post.keywords || post.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(),
    context: "",
    related: links.map((l) => ({ href: l.href, label: l.anchor })),
    external: EXTERNAL_DEFAULT,
  };
}

await fs.writeFile(
  path.join(ROOT, "data/blog-enrichment.json"),
  JSON.stringify(out, null, 2) + "\n"
);
console.log("blog-enrichment.json:", Object.keys(out).length, "posts");
