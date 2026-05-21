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
import { reviewBreadcrumbs } from "./lib/schema.mjs";
import { formatLinksForPrompt, linksForPost } from "./lib/semantic-links.mjs";
import { AUTHORITY } from "./lib/links.mjs";
import { faqBlock } from "./lib/page-blocks.mjs";
import { getFaqs, reviewFaqs } from "./lib/faqs.mjs";
import { loadOperatorResearch } from "./lib/affiliate-research.mjs";
import { sanitizeResearch } from "./lib/sanitize-sources.mjs";

const operators = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/operators.json"), "utf8")
);
const posts = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/blog.json"), "utf8")
);

async function gatherReviewSources(op) {
  const dir = path.join(ROOT, ".firecrawl/reviews");
  const query =
    op.searchQuery ||
    `${op.name} online casino review 2026 bonus payout licence`;
  const searchOut = path.join(dir, `${op.slug}-search.json`);
  const sourcesOut = path.join(dir, `${op.slug}-sources.md`);

  try {
    const data = await firecrawlSearch(query, searchOut, [
      "--sources",
      "web",
      "--tbs",
      "qdr:y",
      "--scrape",
    ]);
    const urls = (data.data?.web || data.data?.news || [])
      .slice(0, 4)
      .map((x) => x.url)
      .filter(Boolean);

    let combined = "";
    for (let i = 0; i < urls.length; i++) {
      const scrapeOut = path.join(dir, `${op.slug}-${i}.md`);
      try {
        const md = await firecrawlScrape(urls[i], scrapeOut);
        combined += `\n\n## Source ${i + 1}: ${urls[i]}\n\n${md.slice(0, 5000)}`;
      } catch (e) {
        console.warn("Scrape failed", urls[i], e.message);
      }
    }
    if (combined) {
      await fs.writeFile(sourcesOut, combined);
      return combined;
    }
  } catch (e) {
    console.warn("Firecrawl failed for", op.slug, e.message);
  }

  try {
    return await fs.readFile(sourcesOut, "utf8");
  } catch {
    return "";
  }
}

function reviewPrompt(op, sources) {
  const hubLinks = formatLinksForPrompt([
    { href: "/online-casinos/", anchor: "compare all online casinos" },
    { href: "/bonuses/", anchor: "casino bonus guide" },
    { href: "/banking/", anchor: "banking and withdrawals" },
    { href: "/blog/fastest-payout-online-casinos/", anchor: "fastest payout casinos" },
    { href: `/reviews/`, anchor: "more operator reviews" },
  ]);

  return `You are writing an in-depth casino review for Casino of the World (European/international focus).

Operator: ${op.name}
Domain: ${op.domain}
Best for: ${op.bestFor}
Markets: ${(op.markets || []).join(", ")}
Welcome bonus (verify): ${op.welcomeBonus}
Highlights: ${op.highlights}
Typical payout: ${op.payout}

RULES:
- Do NOT promote US-only brands (BetMGM, DraftKings, FanDuel, Bovada).
- Base facts on sources; do not invent awards or payout guarantees.
- Mention UKGC/MGA or relevant licence if sources support it.

INTERNAL LINKS (use naturally in paragraphs, varied anchors):
${hubLinks}

Return HTML fragments only (no wrapper). Include:
- Opening <p> summary (120+ words)
- <h2>Overview</h2> with 2-3 <p>
- <h2>Pros and cons</h2> with <ul> for pros and <ul> for cons (4-5 each)
- <h2>Licensing &amp; trust</h2>
- <h2>Games &amp; software</h2> (slots, live dealer, providers)
- <h2>Welcome bonus &amp; promotions</h2>
- <h2>Banking &amp; withdrawals</h2>
- <table class="article-table"> comparing deposit/withdrawal methods (thead/tbody)
- <aside class="article-callout"><strong>Editor verdict</strong> …</aside>
- <h2>Mobile &amp; UX</h2>
- <h2>Responsible gambling tools</h2>
- Short closing <p> with 18+ disclaimer

Editorial research notes (do not name or link to any affiliate directory—write as independent Casino of the World analysis):
${sanitizeResearch(sources).slice(0, 14000) || "Use careful evergreen knowledge about " + op.name}`;
}

async function writeReview(op, sources) {
  let bodyHtml;
  try {
    bodyHtml = await generateText(reviewPrompt(op, sources));
    bodyHtml = bodyHtml.replace(/```html?/gi, "").replace(/```/g, "").trim();
  } catch (e) {
    console.warn("Gemini failed for", op.slug, e.message);
    bodyHtml = `<p>${op.name} is known for ${op.bestFor.toLowerCase()}. Welcome offer: ${op.welcomeBonus}. Highlights include ${op.highlights}.</p>
<h2>Overview</h2><p>Our full review is being updated with the latest licensing and payout data.</p>
<h2>Pros and cons</h2><ul><li>${op.highlights}</li><li>Reported payouts: ${op.payout}</li></ul>
<ul><li>Bonus terms vary by market—always read T&amp;Cs</li></ul>`;
  }

  const ratingTable = `<table class="article-table">
  <thead><tr><th>Criteria</th><th>Our notes</th></tr></thead>
  <tbody>
    <tr><td>Best for</td><td>${op.bestFor}</td></tr>
    <tr><td>Welcome bonus</td><td>${op.welcomeBonus}</td></tr>
    <tr><td>Payout speed</td><td>${op.payout}</td></tr>
    <tr><td>Markets</td><td>${(op.markets || []).join(", ")}</td></tr>
    <tr><td>Licence</td><td>${(op.licences || []).join(", ") || "International"}</td></tr>
    <tr><td>Typical wagering</td><td>${op.defaultWagering ? op.defaultWagering + "× (confirm on site)" : "Varies"}</td></tr>
  </tbody>
</table>`;

  const external = `<section class="article-sources" aria-labelledby="sources-heading">
  <h2 id="sources-heading">Trusted sources</h2>
  <ul class="source-list">
    <li><a href="${AUTHORITY.ukgc.href}" target="_blank" rel="noopener noreferrer">${AUTHORITY.ukgc.label}</a></li>
    <li><a href="${AUTHORITY.mga.href}" target="_blank" rel="noopener noreferrer">${AUTHORITY.mga.label}</a></li>
    <li><a href="${AUTHORITY.ecogra.href}" target="_blank" rel="noopener noreferrer">${AUTHORITY.ecogra.label}</a></li>
    <li><a href="https://${op.domain}/" target="_blank" rel="noopener noreferrer">${op.name} official site</a></li>
  </ul>
</section>`;

  const related = linksForPost(op.slug, "Casino Reviews")
    .slice(0, 5)
    .map((l) => `<li><a href="${l.href}">${l.anchor}</a></li>`)
    .join("\n");

  const page = pageShell({
    title: `${op.name} Casino Review`,
    description: `${op.name} review (2026): ${op.bestFor}. Bonuses, games, ${op.payout} payouts, licensing, and banking for UK/EU/international players.`,
    activePath: "/reviews/",
    canonicalPath: `/reviews/${op.slug}/`,
    ogImage: op.logo,
    keywords: `${op.name} review, ${op.name} casino bonus, ${op.name} withdrawal, ${op.name} licence`,
    breadcrumbs: reviewBreadcrumbs(op.name, op.slug),
    body: `<main class="container page-grid">
  <article>
    <div class="breadcrumb"><a href="/">Home</a> » <a href="/reviews/">Reviews</a> » ${op.name}</div>
    <header class="article-header">
      <h1 class="section-title">${op.name} Casino Review (2026)</h1>
      <p class="article-meta">Updated May 2026 · Markets: ${(op.markets || []).join(", ")}</p>
    </header>
    <div class="review-hero-row">
      <img src="/${op.logo.replace(/^\//, "")}" alt="${op.name}" width="120" height="80" class="review-logo">
      <div>
        <p class="lead"><strong>Best for:</strong> ${op.bestFor}</p>
        <p><a href="${op.cta}" class="btn btn-lime" target="_blank" rel="nofollow sponsored noopener">Visit ${op.name}</a></p>
      </div>
    </div>
    ${disclosure()}
    ${ratingTable}
    <div class="article-body">${bodyHtml}</div>
    ${faqBlock(reviewFaqs(op), {
      title: `${op.name} — FAQ`,
      intro: "Quick answers about licensing, bonuses, payouts, and who this brand suits best.",
    })}
    <section class="article-related" aria-labelledby="related-heading">
      <h2 id="related-heading">Related guides</h2>
      <ul class="related-list">${related}</ul>
    </section>
    ${external}
  </article>
  ${blogSidebar(posts)}
</main>`,
  });

  await writePage(`reviews/${op.slug}.html`, page);
  console.log("Review:", op.slug);
}

async function buildReviewsIndex() {
  const cards = operators
    .map(
      (op) => `<article class="affiliate-card">
  <img src="/${op.logo.replace(/^\//, "")}" alt="${op.name}">
  <span class="badge">${op.markets?.[0] || "International"}</span>
  <h3><a href="/reviews/${op.slug}/">${op.name}</a></h3>
  <p><strong>Best for:</strong> ${op.bestFor}</p>
  <p>${op.highlights}</p>
  <p><strong>Payouts:</strong> ${op.payout}</p>
  <a href="/reviews/${op.slug}/" class="btn btn-outline">Read full review</a>
</article>`
    )
    .join("");

  const html = pageShell({
    title: "Online Casino Reviews (2026)",
    description:
      "In-depth reviews of LeoVegas, 888casino, Betway, Casumo, and more—bonuses, licensing, games, and payout speeds for European and international players.",
    activePath: "/reviews/",
    canonicalPath: "/reviews/",
    keywords:
      "online casino reviews, LeoVegas review, 888casino review, Betway casino, MGA casino reviews 2026",
    breadcrumbs: [{ name: "Home", path: "/" }, { name: "Reviews", path: "/reviews/" }],
    body: `<main class="container">
  <div class="breadcrumb"><a href="/">Home</a> » Reviews</div>
  <h1 class="section-title">Online Casino Reviews</h1>
  <p class="lead">We test game libraries, bonus fine print, licensing, and cash-out timelines for internationally available brands. Each review is researched from public sources and operator terms—updated for 2026.</p>
  ${disclosure()}
  <aside class="article-callout"><strong>How we review</strong> Ratings weigh licence credibility, game variety, bonus fairness, banking speed, mobile UX, and responsible-gambling tools. We do not sell placement.</aside>
  <h2 class="section-title">All Operator Reviews</h2>
  <div class="card-grid">${cards}</div>
  <h2 class="section-title">Compare Side-by-Side</h2>
  <p>Need a quick snapshot? Use our <a href="/online-casinos/">casino comparison table</a> or <a href="/banking/">banking guide</a> for payout methods.</p>
  ${faqBlock(getFaqs("reviews"), {
    intro: "How we write reviews, handle affiliate links, and keep ratings independent.",
  })}
</main>`,
  });

  await writePage("reviews/index.html", html);
  console.log("Reviews index updated");
}

async function main() {
  const only = process.argv[2];
  const list = only ? operators.filter((o) => o.slug === only) : operators;

  await buildReviewsIndex();

  for (const op of list) {
    const sources = await gatherReviewSources(op);
    await writeReview(op, sources);
    await new Promise((r) => setTimeout(r, 1500));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
