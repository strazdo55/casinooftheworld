import {
  formatLinksForPrompt,
  linksForPost,
  buildArticleContext,
} from "./semantic-links.mjs";

const EDITORIAL_RULES = `
EDITORIAL RULES (mandatory):
- Casino of the World targets EUROPE, UK, Canada (Ontario), and INTERNATIONAL/ASIAN markets.
- Do NOT recommend, promote, or link to US-regulated operators (BetMGM, DraftKings, FanDuel, Bovada, BetUS, etc.).
- Reference UKGC, MGA, Gibraltar, or Ontario AGCO where licensing matters — not US state regulators.
- Use GBP/EUR framing where money examples appear; avoid US-only payment claims unless noting unavailability.
- Responsible gambling: mention BeGambleAware, GamCare, or national helplines — not only US 1-800-GAMBLER.
`;

export function buildArticlePrompt(post, sources) {
  const semanticLinks = linksForPost(post.slug, post.category);
  const linkBlock = formatLinksForPrompt(semanticLinks);

  return `You are a senior SEO editor for Casino of the World — an international online casino affiliate site (slots, live dealer, bonuses).
${EDITORIAL_RULES}

Write an original 1000-1200 word article from the sources below. Do not invent quotes or statistics.

Title: ${post.title}
Category: ${post.category}
Date context: May 2026

SEMANTIC INTERNAL LINKING (required — weave naturally in <p> body copy, varied anchor text, 5-7 total):
${linkBlock}

Return HTML fragments ONLY (no <html>, no markdown fences). Structure:

1. Opening <p> with primary keyword in first 100 words.
2. <nav class="article-context">…</nav> — skip (added server-side).
3. Four to six <h2> sections with descriptive subheads.
4. At least ONE <table class="article-table"> with <thead> and <tbody> (comparison or specs).
5. At least ONE <aside class="article-callout"><strong>Key takeaway</strong> …</aside>.
6. At least ONE <div class="article-card-grid"> with 2-3 <div class="article-card"><h3>…</h3><p>…</p></div> items.
7. Use <ul>/<li> where helpful.
8. Final <p> with responsible gambling disclaimer.

Allowed tags: p, h2, h3, ul, li, table, thead, tbody, tr, th, td, aside, div, strong, em, a.

Sources:
${sources.slice(0, 12000) || `No live sources — write careful evergreen international analysis for: ${post.title}`}`;
}

export function enrichBodyWithContext(bodyHtml, post) {
  const links = linksForPost(post.slug, post.category);
  const context = buildArticleContext(links);
  if (bodyHtml.includes("article-context")) return bodyHtml;
  const firstP = bodyHtml.indexOf("</p>");
  if (firstP === -1) return context + bodyHtml;
  return bodyHtml.slice(0, firstP + 4) + "\n" + context + bodyHtml.slice(firstP + 4);
}
