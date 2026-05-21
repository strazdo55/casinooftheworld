import { ROOT } from "./env.mjs";
import {
  articleBreadcrumbs,
  pageBreadcrumbs,
  reviewBreadcrumbs,
} from "./schema.mjs";
import { getFaqs, reviewFaqs } from "./faqs.mjs";
import fs from "fs/promises";
import path from "path";

const STATIC_PAGES = {
  "/": {
    pageType: "webpage",
    faqKey: "home",
    breadcrumbs: [{ name: "Home", path: "/" }],
    ogImage: "assets/images/hero/home-hero.png",
  },
  "/online-casinos/": {
    pageType: "webpage",
    faqKey: "online-casinos",
    breadcrumbs: pageBreadcrumbs("Online Casinos", "/online-casinos/"),
  },
  "/bonuses/": { pageType: "webpage", faqKey: "bonuses", breadcrumbs: pageBreadcrumbs("Bonuses", "/bonuses/") },
  "/banking/": { pageType: "webpage", faqKey: "banking", breadcrumbs: pageBreadcrumbs("Banking", "/banking/") },
  "/games/": { pageType: "webpage", faqKey: "games", breadcrumbs: pageBreadcrumbs("Games", "/games/") },
  "/europe-casinos/": {
    pageType: "webpage",
    faqKey: "europe-casinos",
    breadcrumbs: pageBreadcrumbs("Europe & Asia Casinos", "/europe-casinos/"),
  },
  "/casinos-by-country/": {
    pageType: "webpage",
    faqKey: "casinos-by-country",
    breadcrumbs: pageBreadcrumbs("Casinos by Country", "/casinos-by-country/"),
  },
  "/sports-betting/": {
    pageType: "webpage",
    faqKey: "sports-betting",
    breadcrumbs: pageBreadcrumbs("Sports Betting", "/sports-betting/"),
  },
  "/reviews/": {
    pageType: "webpage",
    faqKey: "reviews",
    breadcrumbs: pageBreadcrumbs("Reviews", "/reviews/"),
    itemList: "operators",
  },
  "/blog/": {
    pageType: "webpage",
    faqKey: "blog",
    breadcrumbs: pageBreadcrumbs("Blog", "/blog/"),
    itemList: "blog",
  },
  "/about/": { pageType: "webpage", faqKey: "about", breadcrumbs: pageBreadcrumbs("About", "/about/") },
  "/contact/": { pageType: "webpage", faqKey: "contact", breadcrumbs: pageBreadcrumbs("Contact", "/contact/") },
  "/affiliate-disclosure/": {
    pageType: "webpage",
    faqKey: "affiliate-disclosure",
    breadcrumbs: pageBreadcrumbs("Affiliate Disclosure", "/affiliate-disclosure/"),
  },
  "/privacy/": { pageType: "webpage", faqKey: "privacy", breadcrumbs: pageBreadcrumbs("Privacy", "/privacy/") },
  "/terms/": { pageType: "webpage", faqKey: "terms", breadcrumbs: pageBreadcrumbs("Terms", "/terms/") },
};

let operatorsCache;
let postsCache;

async function loadData() {
  if (!operatorsCache) {
    operatorsCache = JSON.parse(
      await fs.readFile(path.join(ROOT, "data/operators.json"), "utf8")
    );
  }
  if (!postsCache) {
    postsCache = JSON.parse(
      await fs.readFile(path.join(ROOT, "data/blog.json"), "utf8")
    );
  }
  return { operators: operatorsCache, posts: postsCache };
}

export function parseMetaFromHtml(html) {
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || "";
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] || "";
  const ogTitle = html.match(/<meta property="og:title" content="([^"]*)"/)?.[1] || "";
  const title = ogTitle.replace(/\s*\|\s*Casino of the World\s*$/i, "").trim();
  const ogImageFull = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1] || "";
  const imagePath = ogImageFull
    ? ogImageFull.replace(/^https?:\/\/[^/]+\//, "").replace(/^\//, "")
    : "assets/images/brand/logo.svg";
  const published =
    html.match(/<meta property="article:published_time" content="([^"]+)"/)?.[1] || "";
  return { canonical, description, title, ogImage: imagePath, published };
}

export async function schemaOptsForCanonical(canonicalUrl) {
  const { operators, posts } = await loadData();
  let path = canonicalUrl.replace(/^https?:\/\/[^/]+/, "");
  if (!path.startsWith("/")) path = `/${path}`;
  if (!path.endsWith("/")) path = `${path}/`;

  const blogMatch = path.match(/^\/blog\/([^/]+)\/$/);
  if (blogMatch && blogMatch[1] !== "index.html") {
    const slug = blogMatch[1];
    const post = posts.find((p) => p.slug === slug);
    if (post) {
      return {
        pageType: "article",
        title: post.title,
        description: post.excerpt,
        canonicalPath: path,
        ogImage: post.image,
        published: post.date,
        author: post.author,
        breadcrumbs: articleBreadcrumbs(post.title, slug),
        faqs: getFaqs("blog"),
      };
    }
  }

  const reviewMatch = path.match(/^\/reviews\/([^/]+)\/$/);
  if (reviewMatch) {
    const slug = reviewMatch[1];
    const op = operators.find((o) => o.slug === slug);
    if (op) {
      return {
        pageType: "review",
        title: `${op.name} Casino Review`,
        description: `${op.name} review (2026): ${op.bestFor}. Bonuses, games, ${op.payout} payouts, licensing, and banking for UK/EU/international players.`,
        canonicalPath: path,
        ogImage: op.logo,
        breadcrumbs: reviewBreadcrumbs(op.name, slug),
        faqs: reviewFaqs(op),
        review: {
          name: op.name,
          url: op.cta?.startsWith("http") ? op.cta : `https://${op.domain}/`,
        },
      };
    }
  }

  const staticDef = STATIC_PAGES[path];
  if (staticDef) {
    const opts = {
      pageType: staticDef.pageType,
      canonicalPath: path,
      breadcrumbs: staticDef.breadcrumbs,
      faqs: getFaqs(staticDef.faqKey),
      ogImage: staticDef.ogImage,
    };
    if (staticDef.itemList === "operators") {
      opts.itemList = operators.map((o) => ({
        name: `${o.name} Review`,
        path: `/reviews/${o.slug}/`,
      }));
    }
    if (staticDef.itemList === "blog") {
      opts.itemList = posts.map((p) => ({
        name: p.title,
        path: `/blog/${p.slug}/`,
      }));
    }
    return opts;
  }

  return {
    pageType: "webpage",
    canonicalPath: path,
    breadcrumbs: pageBreadcrumbs("Page", path),
    faqs: [],
  };
}

export async function schemaOptsFromHtml(html) {
  const meta = parseMetaFromHtml(html);
  const base = await schemaOptsForCanonical(meta.canonical);
  return {
    ...base,
    title: meta.title || base.title,
    description: meta.description || base.description,
    published: meta.published || base.published,
    ogImage: meta.ogImage || base.ogImage,
  };
}
