import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import { buildHead, replaceHead } from "./lib/meta.mjs";
import {
  buildSchemaGraph,
  articleBreadcrumbs,
  pageBreadcrumbs,
  homeBreadcrumbs,
  reviewBreadcrumbs,
} from "./lib/schema.mjs";
import {
  PAGE_ENRICHMENT,
  pageResources,
  enrichBlogArticle,
  relatedList,
  externalList,
} from "./lib/links.mjs";
import { pageShell, writePage, disclosure, compareTable, blogSidebar } from "./lib/html.mjs";

const posts = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/blog.json"), "utf8")
);
const enrichment = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/blog-enrichment.json"), "utf8")
);
const operators = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/operators.json"), "utf8")
);

function injectBeforeCloseMain(html, block) {
  if (html.includes("page-resources") || html.includes("article-related")) {
    return html;
  }
  const idx = html.lastIndexOf("</main>");
  if (idx === -1) return html;
  return html.slice(0, idx) + block + "\n" + html.slice(idx);
}

function schemaForPage(opts) {
  return buildSchemaGraph(opts);
}

function patchArticleBody(html, slug) {
  const data = enrichment[slug];
  if (!data) return html;
  if (html.includes('class="article-related"')) return html;

  const match = html.match(
    /(<div class="article-body">)([\s\S]*?)(<\/div>\s*<\/article>)/
  );
  if (!match) return html;

  const enriched = enrichBlogArticle(match[2], data, 1);
  return html.replace(match[0], `${match[1]}${enriched}${match[3]}`);
}

async function enrichBlogPost(post) {
  const file = path.join(ROOT, "blog", post.slug, "index.html");
  let html = await fs.readFile(file, "utf8");
  const data = enrichment[post.slug] || {};

  const canonicalPath = `/blog/${post.slug}/`;
  const head = buildHead({
    title: post.title,
    description: post.excerpt,
    canonicalPath,
    ogImage: post.image,
    type: "article",
    keywords: data.keywords || "",
    published: post.date,
    author: post.author,
    structuredData: schemaForPage({
      pageType: "article",
      title: post.title,
      description: post.excerpt,
      canonicalPath,
      ogImage: post.image,
      published: post.date,
      author: post.author,
      breadcrumbs: articleBreadcrumbs(post.title, post.slug),
    }),
  });

  html = replaceHead(html, head);
  html = patchArticleBody(html, post.slug);

  html = html.replace(
    /<p class="article-meta">Author: <a href="#">/g,
    `<p class="article-meta">Author: <a href="/about/">`
  );
  html = html.replace(
    /<p class="blog-meta"><a href="#">/g,
    `<p class="blog-meta"><a href="/about/">`
  );

  await fs.writeFile(file, html);
  console.log("Blog enriched:", post.slug);
}

async function enrichBlogIndex() {
  const file = path.join(ROOT, "blog/index.html");
  let html = await fs.readFile(file, "utf8");
  const meta = PAGE_ENRICHMENT["blog/index.html"];

  const head = buildHead({
    title: "Casino Blog — News, Slots & Live Dealer Guides",
    description:
      "Expert casino blog: slot reviews, US iGaming news, live dealer guides, bankroll tips, and payout comparisons. Updated for 2026.",
    canonicalPath: "/blog/",
    depth: 1,
    ogImage: posts[0].image,
    keywords: meta.keywords,
    structuredData: schemaForPage({
      title: "Casino Blog — News, Slots & Live Dealer Guides",
      description:
        "Expert casino blog: slot reviews, US iGaming news, live dealer guides, bankroll tips, and payout comparisons. Updated for 2026.",
      canonicalPath: "/blog/",
      ogImage: posts[0].image,
      breadcrumbs: pageBreadcrumbs("Blog", "/blog/"),
    }),
  });

  html = replaceHead(html, head);
  const block = pageResources({
    related: meta.related.map((r) => ({
      ...r,
      href: r.href.startsWith("../") ? r.href : r.href,
    })),
    external: meta.external,
  });
  html = injectBeforeCloseMain(html, block);

  await fs.writeFile(file, html);
  console.log("Blog index enriched");
}

async function resolvePageFile(relativePath) {
  const direct = path.join(ROOT, relativePath);
  try {
    await fs.access(direct);
    return direct;
  } catch {
    const nested = path.join(
      ROOT,
      relativePath.replace(/\.html$/i, "/index.html")
    );
    await fs.access(nested);
    return nested;
  }
}

async function enrichStaticPage(relativePath, meta) {
  const file = await resolvePageFile(relativePath);
  let html = await fs.readFile(file, "utf8");
  const depth = meta.depth || 0;

  const canonicalPath =
    meta.canonicalPath ||
    `/${relativePath.replace(/index\.html$/, "").replace(/\.html$/, "")}/`;
  const crumbLabel =
    meta.breadcrumbLabel ||
    meta.title?.replace(/\s*—.*$/, "").replace(/\s*\|.*$/, "").trim();
  const breadcrumbs =
    relativePath === "index.html"
      ? homeBreadcrumbs()
      : crumbLabel
        ? pageBreadcrumbs(crumbLabel, canonicalPath)
        : null;

  const head = buildHead({
    title: meta.title,
    description: meta.description,
    canonicalPath,
    depth,
    ogImage: meta.ogImage || "assets/images/brand/logo.png",
    keywords: meta.keywords || "",
    type: meta.type || "website",
    structuredData: schemaForPage({
      title: meta.title,
      description: meta.description,
      canonicalPath,
      ogImage: meta.ogImage || "assets/images/brand/logo.png",
      breadcrumbs,
      includeWebSite: canonicalPath === "/" || canonicalPath === "",
    }),
  });

  html = replaceHead(html, head);
  html = html.replace(
    /<div class="page-resources-intro"><p class="page-resources-intro">/g,
    '<p class="page-resources-intro">'
  );
  html = html.replace(/<\/p><\/div>\n(<section class="article-related")/g, "</p>\n$1");

  if (meta.intro || meta.related || meta.external) {
    const prefix = depth ? "../".repeat(depth) : "";
    const related = (meta.related || []).map((r) => ({
      href: r.href.startsWith("http") || r.href.startsWith("../") ? r.href : `${prefix}${r.href}`,
      label: r.label,
    }));
    const block = pageResources({
      intro: meta.intro,
      related,
      external: meta.external,
    });
    html = injectBeforeCloseMain(html, block);
  }

  await fs.writeFile(file, html);
  console.log("Page enriched:", relativePath);
}

async function enrichReviews() {
  for (const op of operators) {
    const file = path.join(ROOT, "reviews", op.slug, "index.html");
    let html = await fs.readFile(file, "utf8");

    const canonicalPath = `/reviews/${op.slug}/`;
    const head = buildHead({
      title: `${op.name} Casino Review`,
      description: `${op.name} review (2026): ${op.bestFor}. Welcome bonus, ${op.payout} payouts, games, and banking — independent analysis.`,
      canonicalPath,
      depth: 1,
      ogImage: op.logo,
      keywords: `${op.name} review, ${op.name} casino bonus, ${op.name} payout, online casino review`,
      structuredData: schemaForPage({
        title: `${op.name} Casino Review`,
        description: `${op.name} review (2026): ${op.bestFor}. Welcome bonus, ${op.payout} payouts, games, and banking — independent analysis.`,
        canonicalPath,
        ogImage: op.logo,
        breadcrumbs: reviewBreadcrumbs(op.name, op.slug),
      }),
    });

    html = replaceHead(html, head);

    if (!html.includes("article-related")) {
      const related = relatedList([
        { href: "../online-casinos.html", label: "Compare all online casinos" },
        { href: "../bonuses.html", label: "Casino bonuses explained" },
        { href: "../banking.html", label: "Banking & withdrawal guide" },
        {
          href: `../blog/fastest-payout-online-casinos.html`,
          label: "Fastest payout casinos",
        },
      ]);
      const external = externalList([
        { href: "https://www.ecogra.org/", label: "eCOGRA — fair gaming standards" },
        { href: "https://www.ncpgambling.org/", label: "NCPG — responsible gambling" },
        {
          href: `https://${op.domain}/`,
          label: `${op.name} official website`,
        },
      ]);
      html = html.replace(
        "</article>",
        `${related}\n${external}\n</article>`
      );
    }

    await fs.writeFile(file, html);
    console.log("Review enriched:", op.slug);
  }
}

// Regenerate core pages from generate-pages with enrichment
async function regenerateCorePages() {
  const { spawn } = await import("child_process");
  await new Promise((resolve, reject) => {
    const child = spawn("node", ["scripts/generate-pages.mjs"], {
      cwd: ROOT,
      stdio: "inherit",
    });
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error("generate-pages failed"))
    );
  });
}

async function enrichIndex() {
  const meta = PAGE_ENRICHMENT["index.html"];
  await enrichStaticPage("index.html", meta);

  let html = await fs.readFile(path.join(ROOT, "index.html"), "utf8");
  if (!html.includes("blog/best-new-online-slots-2026")) {
    html = html.replace(
      "<p class=\"lead\">Our editors test slot libraries",
      '<p class="lead">Our editors test slot libraries, live dealer studios, and withdrawal speeds. Explore <a href="/blog/best-new-online-slots-2026/">new slots for 2026</a>, <a href="/us-casinos/">US casinos</a>, and <a href="/reviews/">operator reviews</a>.'
    );
    await fs.writeFile(path.join(ROOT, "index.html"), html);
  }
  console.log("Index enriched");
}

async function main() {
  await regenerateCorePages();
  await enrichIndex();

  for (const [file, meta] of Object.entries(PAGE_ENRICHMENT)) {
    if (file === "blog/index.html" || file === "index.html" || file === "us-casinos.html")
      continue;
    await enrichStaticPage(file, meta);
  }

  await enrichBlogIndex();
  for (const post of posts) {
    await enrichBlogPost(post);
  }
  await enrichReviews();

  const legal = {
    "about.html": {
      title: "About Casino of the World",
      description:
        "Independent online casino reviews, slot guides, and responsible gambling resources.",
      canonicalPath: "/about",
      keywords: "about us, casino reviews, editorial standards",
    },
    "contact.html": {
      title: "Contact Us",
      description: "Contact Casino of the World for partnerships, corrections, and reader questions.",
      canonicalPath: "/contact",
    },
    "affiliate-disclosure.html": {
      title: "Affiliate Disclosure",
      description: "How Casino of the World earns commissions and maintains editorial independence.",
      canonicalPath: "/affiliate-disclosure",
    },
    "privacy.html": {
      title: "Privacy Policy",
      description: "Privacy policy for casinooftheworld.com — data collection and contact information.",
      canonicalPath: "/privacy",
    },
    "terms.html": {
      title: "Terms of Use",
      description: "Terms of use for casinooftheworld.com — age requirements and liability.",
      canonicalPath: "/terms",
    },
  };

  for (const [file, meta] of Object.entries(legal)) {
    await enrichStaticPage(file, meta);
  }

  const { spawn } = await import("child_process");
  await new Promise((resolve, reject) => {
    const child = spawn("node", ["scripts/write-gsc-verification.mjs"], {
      cwd: ROOT,
      stdio: "inherit",
    });
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error("write-gsc-verification failed"))
    );
  });

  console.log("Site SEO & linking enrichment complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
