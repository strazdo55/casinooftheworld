import { SITE_URL, GOOGLE_SITE_VERIFICATION } from "./env.mjs";
import { jsonLdScript } from "./schema.mjs";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/**
 * @param {object} opts
 * @param {string} opts.title - Page title without site suffix
 * @param {string} opts.description
 * @param {string} opts.canonicalPath - e.g. /blog/slug or /online-casinos.html
 * @param {number} [opts.depth=0]
 * @param {string} [opts.ogImage] - path from site root
 * @param {string} [opts.type=website] - website | article
 * @param {string} [opts.keywords]
 * @param {string} [opts.published] - ISO date for articles
 * @param {string} [opts.author]
 * @param {object[]} [opts.structuredData] - schema.org @graph nodes
 */
export function buildHead({
  title,
  description,
  canonicalPath,
  depth = 0,
  ogImage = "assets/images/brand/logo.svg",
  type = "website",
  keywords = "",
  published = "",
  author = "Casino of the World",
  structuredData = null,
}) {
  const canonical = `${SITE_URL}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`;
  const image = `${SITE_URL}/${ogImage.replace(/^\//, "")}`;
  const fullTitle = `${title} | Casino of the World`;

  const articleMeta =
    type === "article"
      ? `
  <meta property="article:published_time" content="${esc(published)}">
  <meta property="article:author" content="${esc(author)}">`
      : "";

  const keywordsMeta = keywords
    ? `\n  <meta name="keywords" content="${esc(keywords)}">`
    : "";

  const gscMeta = GOOGLE_SITE_VERIFICATION
    ? `\n  <meta name="google-site-verification" content="${esc(GOOGLE_SITE_VERIFICATION)}">`
    : "";

  const ldJson =
    structuredData?.length > 0 ? jsonLdScript(structuredData) : "";

  return `  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description)}">${keywordsMeta}
  <meta name="robots" content="index, follow">
  <meta name="author" content="${esc(author)}">${gscMeta}
  <link rel="canonical" href="${esc(canonical)}">
  <meta property="og:site_name" content="Casino of the World">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="${type}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${esc(image)}">
  <meta property="og:locale" content="en_US">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(fullTitle)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(image)}">${articleMeta}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">
  <link rel="icon" href="/assets/images/brand/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/images/brand/logo.svg">${ldJson}`;
}

export function replaceHead(html, headInner) {
  return html.replace(/<head>[\s\S]*?<\/head>/, `<head>\n${headInner}\n</head>`);
}
