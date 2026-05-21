import fs from "fs";
import path from "path";
import { ROOT } from "./env.mjs";

export const BLOG_SLUGS = new Set(
  JSON.parse(fs.readFileSync(path.join(ROOT, "data/blog.json"), "utf8")).map(
    (p) => p.slug
  )
);

/** Canonical blog post URL */
export function blogPostHref(slug) {
  return `/blog/${slug}/`;
}

export function htmlHrefToClean(href) {
  if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
    return href;
  }

  let p = href.replace(/^\.\//, "");
  while (p.startsWith("../")) p = p.slice(3);

  if (p.endsWith(".html")) {
    if (p === "index.html") return "/";
    if (p.endsWith("/index.html")) return `/${p.slice(0, -"/index.html".length)}/`;
    const base = p.slice(0, -5);
    if (base.startsWith("blog/")) return `/${base}/`;
    const leaf = base.split("/").pop();
    if (BLOG_SLUGS.has(leaf)) return blogPostHref(leaf);
    return `/${base}/`;
  }

  const clean = href.startsWith("/") ? href : `/${p}`;
  const m = clean.match(/^\/([a-z0-9-]+)\/?$/);
  if (m && BLOG_SLUGS.has(m[1])) return blogPostHref(m[1]);

  return href.startsWith("/") ? href : `/${p}`;
}

/** `online-casinos.html` → `online-casinos/index.html` */
export function htmlFileToDirIndex(relativePath) {
  if (relativePath === "index.html" || relativePath === "404.html") {
    return relativePath;
  }
  if (relativePath.endsWith("/index.html")) return relativePath;
  if (!relativePath.endsWith(".html")) return relativePath;
  const base = relativePath.slice(0, -5);
  return `${base}/index.html`;
}

/** Redirect .html → folder URL; works on custom domain and github.io project paths */
export function redirectStubHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Redirecting…</title>
  <script>
    (function () {
      var p = location.pathname;
      if (!p.endsWith(".html")) return;
      var target = p.slice(0, -5) + "/" + location.search + location.hash;
      location.replace(target);
    })();
  </script>
</head>
<body>
  <p>Redirecting… <a href="#" id="continue">Continue</a></p>
  <script>
    (function () {
      var p = location.pathname;
      if (!p.endsWith(".html")) return;
      document.getElementById("continue").href =
        p.slice(0, -5) + "/" + location.search + location.hash;
    })();
  </script>
</body>
</html>
`;
}

/** Redirect /slug/ at site root → /blog/slug/ (GitHub Pages short URLs) */
export function rootBlogRedirectHtml(slug) {
  const target = blogPostHref(slug);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=${target}">
  <link rel="canonical" href="https://casinooftheworld.com${target}">
  <script>location.replace("${target}");</script>
  <title>Redirecting…</title>
</head>
<body><p><a href="${target}">Continue to article</a></p></body>
</html>
`;
}

/** Rewrite .html hrefs and fix bare /blog-slug/ paths */
export function rewriteHtmlLinks(html) {
  return html.replace(/href="([^"]+)"/g, (full, href) => {
    if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
      return full;
    }
    return `href="${htmlHrefToClean(href)}"`;
  });
}
