import fs from "fs/promises";
import path from "path";
import { ROOT, SITE_URL } from "./lib/env.mjs";

const posts = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/blog.json"), "utf8")
);

const STATIC_PATHS = [
  "/",
  "/online-casinos/",
  "/bonuses/",
  "/banking/",
  "/games/",
  "/europe-casinos/",
  "/casinos-by-country/",
  "/sports-betting/",
  "/reviews/",
  "/blog/",
  "/about/",
  "/contact/",
  "/affiliate-disclosure/",
  "/privacy/",
  "/terms/",
];

async function reviewPaths() {
  const dir = path.join(ROOT, "reviews");
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && e.name !== "index.html")
    .map((e) => `/reviews/${e.name}/`);
}

function urlEntry(loc, priority = "0.7") {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const urls = [
  ...STATIC_PATHS.map((p) => urlEntry(p, p === "/" ? "1.0" : "0.8")),
  ...posts.map((p) => urlEntry(`/blog/${p.slug}/`, "0.7")),
  ...(await reviewPaths()).map((p) => urlEntry(p, "0.6")),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

await fs.writeFile(path.join(ROOT, "sitemap.xml"), xml);
console.log("sitemap.xml:", urls.length, "URLs");
