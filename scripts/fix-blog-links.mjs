import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import {
  BLOG_SLUGS,
  blogPostHref,
  htmlHrefToClean,
  rewriteHtmlLinks,
  rootBlogRedirectHtml,
} from "./lib/paths.mjs";

async function walkHtml(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith(".") && e.name !== "node_modules") {
      await walkHtml(p, files);
    } else if (e.name.endsWith(".html")) {
      files.push(p);
    }
  }
  return files;
}

async function fixEnrichment() {
  const p = path.join(ROOT, "data/blog-enrichment.json");
  const data = JSON.parse(await fs.readFile(p, "utf8"));

  function walk(obj) {
    if (Array.isArray(obj)) return obj.map(walk);
    if (obj && typeof obj === "object") {
      const out = {};
      for (const [k, v] of Object.entries(obj)) {
        if (k === "href" && typeof v === "string") out[k] = htmlHrefToClean(v);
        else if (typeof v === "string") out[k] = rewriteHtmlLinks(v);
        else out[k] = walk(v);
      }
      return out;
    }
    return obj;
  }

  await fs.writeFile(p, JSON.stringify(walk(data), null, 2) + "\n");
  console.log("Updated data/blog-enrichment.json");
}

async function writeRootBlogRedirects() {
  for (const slug of BLOG_SLUGS) {
    const dir = path.join(ROOT, slug);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, "index.html"), rootBlogRedirectHtml(slug));
    console.log("Root redirect:", slug + "/ → " + blogPostHref(slug));
  }
}

async function main() {
  for (const full of await walkHtml(ROOT)) {
    let html = await fs.readFile(full, "utf8");
    const before = html;
    html = rewriteHtmlLinks(html);

    for (const slug of BLOG_SLUGS) {
      html = html.replaceAll(`href="/${slug}/"`, `href="${blogPostHref(slug)}"`);
      html = html.replaceAll(`href="/${slug}"`, `href="${blogPostHref(slug)}"`);
      html = html.replaceAll(`href="blog/${slug}.html"`, `href="${blogPostHref(slug)}"`);
      html = html.replaceAll(`href="blog/${slug}/"`, `href="${blogPostHref(slug)}"`);
      html = html.replaceAll(`href="../blog/${slug}.html"`, `href="${blogPostHref(slug)}"`);
      html = html.replaceAll(`href="${slug}.html"`, `href="${blogPostHref(slug)}"`);
    }

    if (html !== before) {
      await fs.writeFile(full, html);
      console.log("Fixed:", path.relative(ROOT, full));
    }
  }

  await fixEnrichment();
  await writeRootBlogRedirects();
  console.log("Blog link fix complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
