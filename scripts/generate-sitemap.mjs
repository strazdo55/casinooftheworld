import fs from "fs/promises";
import path from "path";
import { ROOT, SITE_URL } from "./lib/env.mjs";

const posts = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/blog.json"), "utf8")
);
const operators = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/operators.json"), "utf8")
);

const STATIC_PATHS = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/online-casinos/", priority: "0.9", changefreq: "weekly" },
  { loc: "/bonuses/", priority: "0.85", changefreq: "weekly" },
  { loc: "/banking/", priority: "0.85", changefreq: "weekly" },
  { loc: "/games/", priority: "0.8", changefreq: "weekly" },
  { loc: "/europe-casinos/", priority: "0.85", changefreq: "weekly" },
  { loc: "/casinos-by-country/", priority: "0.8", changefreq: "weekly" },
  { loc: "/sports-betting/", priority: "0.75", changefreq: "weekly" },
  { loc: "/reviews/", priority: "0.9", changefreq: "weekly" },
  { loc: "/blog/", priority: "0.9", changefreq: "daily" },
  { loc: "/about/", priority: "0.5", changefreq: "monthly" },
  { loc: "/contact/", priority: "0.5", changefreq: "monthly" },
  { loc: "/affiliate-disclosure/", priority: "0.4", changefreq: "yearly" },
  { loc: "/privacy/", priority: "0.4", changefreq: "yearly" },
  { loc: "/terms/", priority: "0.4", changefreq: "yearly" },
];

async function lastmodForFile(relativePath) {
  try {
    const stat = await fs.stat(path.join(ROOT, relativePath));
    return stat.mtime.toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function urlEntry({ loc, priority, changefreq, lastmod }) {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const entries = [];

for (const p of STATIC_PATHS) {
  const filePath = p.loc === "/" ? "index.html" : `${p.loc.replace(/^\//, "").replace(/\/$/, "")}/index.html`;
  entries.push(
    urlEntry({
      ...p,
      lastmod: await lastmodForFile(filePath),
    })
  );
}

for (const post of posts) {
  entries.push(
    urlEntry({
      loc: `/blog/${post.slug}/`,
      priority: "0.7",
      changefreq: "monthly",
      lastmod: post.date?.slice(0, 10) || (await lastmodForFile(`blog/${post.slug}/index.html`)),
    })
  );
}

for (const op of operators) {
  entries.push(
    urlEntry({
      loc: `/reviews/${op.slug}/`,
      priority: "0.75",
      changefreq: "weekly",
      lastmod: await lastmodForFile(`reviews/${op.slug}/index.html`),
    })
  );
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

await fs.writeFile(path.join(ROOT, "sitemap.xml"), xml);
console.log("sitemap.xml:", entries.length, "URLs");
