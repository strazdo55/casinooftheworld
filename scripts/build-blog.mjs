import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import { firecrawlSearch, firecrawlScrape } from "./lib/firecrawl.mjs";
import { generateText } from "./lib/gemini.mjs";
import {
  pageShell,
  writePage,
  disclosure,
  blogSidebar,
} from "./lib/html.mjs";
import { blogPostHref } from "./lib/paths.mjs";
import { articleBreadcrumbs, pageBreadcrumbs } from "./lib/schema.mjs";
import {
  removeBlogRedirectStubs,
  writeServeConfig,
} from "./write-serve-config.mjs";
import { enrichBlogArticle } from "./lib/links.mjs";
import { buildArticlePrompt, enrichBodyWithContext } from "./lib/blog-prompt.mjs";

const posts = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/blog.json"), "utf8")
);
const enrichment = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/blog-enrichment.json"), "utf8")
);

async function gatherSources(post) {
  const dir = path.join(ROOT, ".firecrawl/blog");
  const searchOut = path.join(dir, `${post.slug}-search.json`);
  const sourcesOut = path.join(dir, `${post.slug}-sources.md`);

  try {
    const data = await firecrawlSearch(
      post.searchQuery,
      searchOut,
      ["--sources", "news", "--tbs", "qdr:m", "--scrape"]
    );
    const urls = (data.data?.news || data.data?.web || [])
      .slice(0, 3)
      .map((x) => x.url)
      .filter(Boolean);

    let combined = "";
    for (let i = 0; i < urls.length; i++) {
      const scrapeOut = path.join(dir, `${post.slug}-${i}.md`);
      try {
        const md = await firecrawlScrape(urls[i], scrapeOut);
        combined += `\n\n## Source ${i + 1}: ${urls[i]}\n\n${md.slice(0, 6000)}`;
      } catch (e) {
        console.warn("Scrape failed", urls[i], e.message);
      }
    }
    if (combined) {
      await fs.writeFile(sourcesOut, combined);
      return combined;
    }
  } catch (e) {
    console.warn("Firecrawl search failed for", post.slug, e.message);
  }

  try {
    return await fs.readFile(sourcesOut, "utf8");
  } catch {
    return "";
  }
}

async function writeArticle(post, sources) {
  const prompt = buildArticlePrompt(post, sources);

  let bodyHtml;
  try {
    bodyHtml = await generateText(prompt);
    bodyHtml = bodyHtml.replace(/```html?/gi, "").replace(/```/g, "").trim();
  } catch (e) {
    console.warn("Gemini failed, using fallback for", post.slug);
    bodyHtml = `<p>${post.excerpt}</p><h2>Overview</h2><p>Our editorial team is updating this guide with the latest market developments. Check back soon for full analysis.</p>`;
  }

  bodyHtml = enrichBodyWithContext(bodyHtml, post);
  const data = enrichment[post.slug] || {};
  const bodyContent = enrichBlogArticle(bodyHtml, data, 1);

  const articlePage = pageShell({
    title: post.title,
    description: post.excerpt,
    activePath: "/blog/",
    canonicalPath: `/blog/${post.slug}/`,
    ogImage: post.image,
    ogType: "article",
    keywords: data.keywords || "",
    published: post.date,
    author: post.author,
    breadcrumbs: articleBreadcrumbs(post.title, post.slug),
    body: `
<main class="container page-grid">
  <article>
    <div class="breadcrumb"><a href="/">Home</a> » <a href="/blog/">Blog</a> » ${post.title}</div>
    <span class="tag">${post.category}</span>
    <header class="article-header">
      <h1>${post.title}</h1>
      <p class="article-meta">Author: <a href="/about/">${post.author}</a> · Published: ${post.date} · Last updated: ${post.date}</p>
    </header>
    <img class="article-featured" src="/${post.image}" alt="${post.title}" onerror="this.src='/assets/images/hero/home-hero.png'">
    ${disclosure()}
    <div class="article-body">${bodyContent}</div>
  </article>
  ${blogSidebar(posts.filter((p) => p.slug !== post.slug).concat(posts).slice(0, 5))}
</main>`,
  });

  await writePage(`blog/${post.slug}.html`, articlePage);
  console.log("Blog post:", post.slug);
}

async function buildBlogIndex() {
  const featured = posts.find((p) => p.featured) || posts[0];
  const cards = posts
    .map(
      (p) => `<article class="post-card" data-category="${p.category.toLowerCase().replace(/\s+/g, "-")}">
  <a href="${blogPostHref(p.slug)}"><img src="/${p.image}" alt="" onerror="this.src='/assets/images/hero/home-hero.png'"></a>
  <div class="body">
    <span class="tag">${p.category}</span>
    <h3><a href="${blogPostHref(p.slug)}">${p.title}</a></h3>
    <p class="blog-meta">${p.author} · ${p.dateLabel}</p>
    <p>${p.excerpt}</p>
  </div>
</article>`
    )
    .join("\n");

  const cats = ["ALL", ...new Set(posts.map((p) => p.category.toUpperCase()))];
  const catBtns = cats
    .map((c, i) => {
      const data =
        c === "ALL"
          ? "all"
          : c
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/&/g, "");
      return `<button type="button" class="cat-btn${i === 0 ? " active" : ""}" data-category="${data}">${c}</button>`;
    })
    .join("\n");

  const blogMeta = {
    title: "Casino Blog — News, Slots & Live Dealer Guides",
    description:
      "Expert casino blog: slot reviews, UK & EU licensing news, live dealer guides, and bankroll tips for 2026.",
    keywords:
      "casino blog, online gambling news, slot guides, live dealer tips, casino strategy",
  };

  const html = pageShell({
    title: blogMeta.title,
    description: blogMeta.description,
    activePath: "/blog/",
    canonicalPath: "/blog/",
    keywords: blogMeta.keywords,
    ogImage: featured.image,
    breadcrumbs: pageBreadcrumbs("Blog", "/blog/"),
    body: `
<main class="container">
  <div class="breadcrumb"><a href="/">Home</a> » Blog</div>
  <h1 class="section-title">Casino of the World Blog</h1>
  <p class="lead">International casino news, slot reviews, live dealer guides, and bankroll tips for UK, EU, and regulated markets—updated by our editorial team.</p>
  <section class="blog-hero-featured">
    <a href="${blogPostHref(featured.slug)}"><img src="/${featured.image}" alt="${featured.title}" onerror="this.src='/assets/images/hero/home-hero.png'"></a>
    <div>
      <span class="tag">${featured.category}</span>
      <h2 style="font-size:1.75rem;margin:0.5rem 0"><a href="${blogPostHref(featured.slug)}">${featured.title}</a></h2>
      <p>${featured.excerpt}</p>
      <p class="blog-meta"><a href="#">${featured.author}</a> · ${featured.dateLabel}</p>
    </div>
  </section>
  <div class="category-bar">
    <p class="category-bar-label">Blog Categories</p>
    <div class="category-bar-scroll" role="tablist" aria-label="Filter blog posts by category">
      ${catBtns}
    </div>
  </div>
  <div class="post-grid">${cards}</div>
</main>`,
  });

  await writePage("blog/index.html", html);
}

async function main() {
  const args = process.argv.slice(2);
  const indexOnly = args.includes("--index-only");
  const only = args.find((a) => a !== "--index-only");

  await removeBlogRedirectStubs();
  await buildBlogIndex();

  if (indexOnly) {
    await writeServeConfig();
    console.log("Blog index only — done.");
    return;
  }

  const list = only ? posts.filter((p) => p.slug === only) : posts;

  for (const post of list) {
    const sources = await gatherSources(post);
    await writeArticle(post, sources);
  }

  await writeServeConfig();
  const { execSync } = await import("child_process");
  try {
    execSync("node scripts/generate-sitemap.mjs", { cwd: ROOT, stdio: "inherit" });
  } catch {
    console.warn("Sitemap generation skipped");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
