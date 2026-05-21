/** Clean URL helpers (folder/index.html → /path/) */

export function htmlHrefToClean(href) {
  if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
    return href;
  }
  if (href.startsWith("/") && !href.endsWith(".html")) return href;

  let p = href.replace(/^\.\//, "");
  while (p.startsWith("../")) p = p.slice(3);

  if (p === "index.html") return "/";
  if (p.endsWith("/index.html")) return `/${p.slice(0, -"/index.html".length)}/`;
  if (p.endsWith(".html")) return `/${p.slice(0, -5)}/`;
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

export function redirectStubHtml(cleanPath) {
  const target = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=${target}">
  <link rel="canonical" href="https://casinooftheworld.com${target}">
  <script>location.replace("${target}");</script>
  <title>Redirecting…</title>
</head>
<body><p><a href="${target}">Continue</a></p></body>
</html>
`;
}

/** Rewrite .html hrefs in HTML to clean paths */
export function rewriteHtmlLinks(html) {
  return html.replace(/href="([^"]+)"/g, (full, href) => {
    if (!href.endsWith(".html")) return full;
    if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
      return full;
    }
    return `href="${htmlHrefToClean(href)}"`;
  });
}
