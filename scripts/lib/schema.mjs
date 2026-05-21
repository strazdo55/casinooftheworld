import { SITE_URL } from "./env.mjs";

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOGO_ID = `${ORG_ID}/logo`;

function abs(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const needsSlash = !p.includes(".") && !p.endsWith("/");
  return `${SITE_URL}${needsSlash ? `${p}/` : p}`;
}

function absAsset(assetPath) {
  return `${SITE_URL}/${String(assetPath).replace(/^\//, "")}`;
}

export function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Casino of the World",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      "@id": LOGO_ID,
      url: absAsset("assets/images/brand/logo.svg"),
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

export function webPageNode({
  title,
  description,
  url,
  breadcrumbId = null,
  image = null,
  mainEntityId = null,
  hasPartIds = [],
}) {
  const node = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
  if (breadcrumbId) node.breadcrumb = { "@id": breadcrumbId };
  if (image) {
    node.primaryImageOfPage = {
      "@type": "ImageObject",
      url: image,
    };
  }
  if (mainEntityId) node.mainEntity = { "@id": mainEntityId };
  if (hasPartIds.length) {
    node.hasPart = hasPartIds.map((id) => ({ "@id": id }));
  }
  return node;
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
  const pageId = `${url}#webpage`;
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
    mainEntityOfPage: { "@id": pageId },
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en-US",
  };
}

export function reviewNode({
  title,
  description,
  url,
  image,
  author,
  itemName,
  itemUrl,
}) {
  const pageId = `${url}#webpage`;
  return {
    "@type": "Review",
    "@id": `${url}#review`,
    name: title,
    reviewBody: description,
    image: image ? [image] : undefined,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: { "@id": ORG_ID },
    itemReviewed: {
      "@type": "Organization",
      name: itemName,
      url: itemUrl,
    },
    mainEntityOfPage: { "@id": pageId },
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en-US",
  };
}

export function faqPageNode(faqs, url) {
  if (!faqs?.length) return null;
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: stripHtml(f.q),
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtml(f.a),
      },
    })),
  };
}

export function breadcrumbNode(items) {
  const lastPath = items[items.length - 1].path;
  return {
    "@type": "BreadcrumbList",
    "@id": `${abs(lastPath)}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

export function itemListNode({ url, name, items }) {
  return {
    "@type": "ItemList",
    "@id": `${url}#itemlist`,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: abs(item.path),
    })),
  };
}

/**
 * @param {object} opts
 * @param {'article'|'review'|'webpage'} opts.pageType
 * @param {string} opts.title
 * @param {string} opts.description
 * @param {string} opts.canonicalPath
 * @param {string} [opts.ogImage]
 * @param {string} [opts.published]
 * @param {string} [opts.author]
 * @param {{name:string,path:string}[]} [opts.breadcrumbs]
 * @param {{q:string,a:string}[]} [opts.faqs]
 * @param {object} [opts.review] - { name, url } for itemReviewed
 * @param {{name:string,path:string}[]} [opts.itemList]
 */
export function buildSchemaGraph(opts) {
  const url = abs(opts.canonicalPath);
  const image = absAsset(opts.ogImage || "assets/images/brand/logo.svg");
  const graph = [organizationNode(), webSiteNode()];

  const breadcrumbId = opts.breadcrumbs?.length
    ? `${abs(opts.breadcrumbs[opts.breadcrumbs.length - 1].path)}#breadcrumb`
    : null;

  let mainEntityId = null;
  const hasPartIds = [];

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
    mainEntityId = `${url}#article`;
  }

  if (opts.pageType === "review" && opts.review) {
    graph.push(
      reviewNode({
        title: opts.title,
        description: opts.description,
        url,
        image,
        author: opts.author || "Casino of the World",
        itemName: opts.review.name,
        itemUrl: opts.review.url,
      })
    );
    mainEntityId = `${url}#review`;
  }

  const faqNode = faqPageNode(opts.faqs, url);
  if (faqNode) {
    graph.push(faqNode);
    if (!mainEntityId) mainEntityId = `${url}#faq`;
    else hasPartIds.push(`${url}#faq`);
  }

  if (opts.itemList?.length) {
    const list = itemListNode({
      url,
      name: opts.title,
      items: opts.itemList,
    });
    graph.push(list);
    hasPartIds.push(`${url}#itemlist`);
  }

  if (opts.breadcrumbs?.length) {
    graph.push(breadcrumbNode(opts.breadcrumbs));
  }

  graph.push(
    webPageNode({
      title: opts.title,
      description: opts.description,
      url,
      breadcrumbId,
      image,
      mainEntityId,
      hasPartIds,
    })
  );

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
