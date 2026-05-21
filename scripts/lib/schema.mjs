import { SITE_URL } from "./env.mjs";

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

function abs(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p.endsWith("/") || p.includes(".") ? p : `${p}/`}`;
}

function absAsset(assetPath) {
  return `${SITE_URL}/${String(assetPath).replace(/^\//, "")}`;
}

export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Casino of the World",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absAsset("assets/images/brand/logo.png"),
    },
  };
}

export function webSiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "Casino of the World",
    description:
      "Independent online casino reviews, slot guides, live dealer comparisons, and bonus analysis.",
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

export function webPageNode({ title, description, url }) {
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

export function articleNode({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
}) {
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: title,
    description,
    image: [image],
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: { "@id": `${url}#webpage` },
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en-US",
  };
}

export function breadcrumbNode(items) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${abs(items[items.length - 1].path)}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

/**
 * @param {object} opts
 * @param {'article'|'webpage'} opts.pageType
 * @param {string} opts.title
 * @param {string} opts.description
 * @param {string} opts.canonicalPath
 * @param {string} [opts.ogImage]
 * @param {string} [opts.published]
 * @param {string} [opts.author]
 * @param {{name:string,path:string}[]} [opts.breadcrumbs]
 * @param {boolean} [opts.includeWebSite]
 */
export function buildSchemaGraph(opts) {
  const url = abs(opts.canonicalPath);
  const image = absAsset(opts.ogImage || "assets/images/brand/logo.png");
  const graph = [organizationNode()];

  if (opts.includeWebSite) {
    graph.push(webSiteNode());
  }

  graph.push(
    webPageNode({
      title: opts.title,
      description: opts.description,
      url,
    })
  );

  if (opts.pageType === "article") {
    graph.push(
      articleNode({
        title: opts.title,
        description: opts.description,
        url,
        image,
        datePublished: opts.published,
        dateModified: opts.published,
        author: opts.author || "Casino of the World",
      })
    );
  }

  if (opts.breadcrumbs?.length) {
    graph.push(breadcrumbNode(opts.breadcrumbs));
  }

  return graph;
}

export function jsonLdScript(graph) {
  const payload = {
    "@context": "https://schema.org",
    "@graph": graph,
  };
  const json = JSON.stringify(payload, null, 2).replace(/</g, "\\u003c");
  return `\n  <script type="application/ld+json">\n${json}\n  </script>`;
}

export function homeBreadcrumbs() {
  return [{ name: "Home", path: "/" }];
}

export function pageBreadcrumbs(name, pagePath) {
  return [
    { name: "Home", path: "/" },
    { name, path: pagePath },
  ];
}

export function articleBreadcrumbs(title, slug) {
  return [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog/" },
    { name: title, path: `/blog/${slug}/` },
  ];
}

export function reviewBreadcrumbs(operatorName, slug) {
  return [
    { name: "Home", path: "/" },
    { name: "Reviews", path: "/reviews/" },
    { name: operatorName, path: `/reviews/${slug}/` },
  ];
}
