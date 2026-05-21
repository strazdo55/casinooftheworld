import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import { pageShell, compareTable, guideCardGrid, uniquePosts } from "./lib/html.mjs";
import {
  howWeRateBlock,
  faqBlock,
  topicLinksBlock,
  licensingTable,
  wageringCalculatorBlock,
} from "./lib/page-blocks.mjs";
import { PAGE_ENRICHMENT } from "./lib/links.mjs";

const operators = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/operators.json"), "utf8")
);
const posts = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/blog.json"), "utf8")
);

const editorPicks = uniquePosts(
  [...posts.filter((p) => p.featured), ...posts],
  4
);

function brandCards() {
  return operators
    .slice(0, 9)
    .map(
      (op) => `<article class="affiliate-card">
  <img src="/${op.logo.replace(/^\//, "")}" alt="${op.name}">
  <span class="badge">${op.markets?.[0] || "International"}</span>
  <h3>${op.name}</h3>
  <p>${op.bestFor}. Payouts: ${op.payout}.</p>
  <a href="/reviews/${op.slug}/" class="btn btn-outline">Full review</a>
  <a href="${op.cta}" class="btn btn-lime" target="_blank" rel="nofollow sponsored noopener" style="margin-top:0.5rem">Visit site</a>
</article>`
    )
    .join("\n");
}

const meta = PAGE_ENRICHMENT["index.html"];

const body = `
<section class="hero">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="container hero-content">
    <h1>Best European &amp; International Online Casinos (2026)</h1>
    <p>Independent reviews of UKGC, MGA, and internationally licensed casino sites—slots, live dealer, bonuses, and withdrawal speeds compared for players in Europe, Canada, and regulated markets worldwide.</p>
    <p class="trust-label">Editorial focus:</p>
    <div class="trust-logos">
      <span>UKGC</span>
      <span>MGA</span>
      <span>LIVE DEALER</span>
      <span>FAST PAYOUTS</span>
      <span>RESPONSIBLE PLAY</span>
    </div>
    <p style="margin-top:1.5rem">
      <a href="/online-casinos/" class="btn btn-lime">Compare Casinos</a>
      <a href="/reviews/" class="btn btn-outline" style="margin-left:0.5rem">Read Reviews</a>
    </p>
  </div>
</section>

<div class="filter-bar">
  <div class="container filter-inner">
    <span>Find the best:</span>
    <div class="filter-options">
      <a href="/online-casinos/">Top Casinos</a>
      <a href="/bonuses/">Bonuses &amp; Free Spins</a>
      <a href="/games/">Slots &amp; Live Dealer</a>
      <a href="/banking/">Banking &amp; Payouts</a>
      <a href="/europe-casinos/">Europe &amp; Asia</a>
    </div>
  </div>
</div>

<main class="container">
  <p class="page-updated"><time datetime="${new Date().toISOString().slice(0, 10)}">Updated ${new Date().toLocaleString("en-GB", { month: "long", year: "numeric" })}</time> — comparison table, reviews, and guides refreshed by our editorial team.</p>

  <aside class="disclosure" style="margin-top:1rem">
    <strong>Affiliate Disclosure:</strong> We may earn a commission when you sign up via our links. Ratings are editorial—see <a href="/affiliate-disclosure/">how we make money</a>.
  </aside>

  <p class="lead">Casino of the World helps you choose licensed operators with fair bonus terms, strong game libraries, and reliable cash-outs. We do <strong>not</strong> promote US state-regulated sportsbook-casino hybrids; our comparisons focus on <a href="/europe-casinos/">European and international brands</a> such as LeoVegas, 888casino, Betway, and Casumo.</p>

  ${howWeRateBlock()}

  <h2 class="section-title">Top-Rated Casinos — Quick Comparison</h2>
  <p class="muted" style="margin-bottom:1rem">Use filters to narrow by licence, payout speed, region, or crypto-friendly brands. All operators are drawn from our vetted international directory.</p>
  ${compareTable(operators, { filters: true })}

  ${wageringCalculatorBlock({ id: "wagering-calculator" })}

  <aside class="article-callout">
    <strong>Key takeaway</strong>
    Always verify that a casino accepts players from your country and holds a licence you trust. Bonus headlines change weekly—read wagering rules on the operator site before depositing.
  </aside>

  <h2 class="section-title">Licensing &amp; Player Protection</h2>
  <p>Regulation determines which games, payment methods, and dispute processes you get. Below is a simplified map; our <a href="/casinos-by-country/">country guide</a> goes deeper.</p>
  ${licensingTable()}

  <h2 class="section-title">Featured Operator Reviews</h2>
  <div class="card-grid">${brandCards()}</div>

  <section class="content-section" aria-labelledby="editor-picks">
  <div class="section-head-row">
    <h2 id="editor-picks" class="section-title">Editor's Picks — Casino Guides</h2>
    <a href="/blog/" class="section-head-link">View all articles →</a>
  </div>
  <p class="lead" style="margin-top:0">In-depth guides on slots, EU licensing, payouts, and live dealer play—written for international players, not US state sportsbooks.</p>
  ${guideCardGrid(editorPicks, { truncate: true })}
  </section>

  ${faqBlock([
    {
      q: "Which online casinos pay out the fastest?",
      a: 'E-wallets and crypto often clear within 24 hours at international brands. See our <a href="/blog/fastest-payout-online-casinos/">fastest payout comparison</a> and <a href="/banking/">banking hub</a>.',
    },
    {
      q: "Are online casino bonuses worth it?",
      a: 'Only if you understand wagering requirements. Our <a href="/blog/wagering-requirements-explained/">wagering guide</a> and <a href="/bonuses/">bonus hub</a> explain playthrough math.',
    },
    {
      q: "What is the difference between live dealer and RNG slots?",
      a: 'Live games stream real tables; RNG slots use software randomness. Compare pacing and house edge in our <a href="/blog/live-dealer-vs-rng-slots/">live vs RNG guide</a>.',
    },
    {
      q: "Can I play from any country?",
      a: 'No—operators geo-block restricted regions. Start with <a href="/casinos-by-country/">casinos by country</a> and confirm local law.',
    },
  ])}

  ${topicLinksBlock([
    { href: "/online-casinos/", label: "Best online casinos compared" },
    { href: "/reviews/", label: "In-depth operator reviews" },
    { href: "/blog/", label: "Casino blog — news & strategy" },
    { href: "/blog/best-new-online-slots-2026/", label: "Best new slots (2026)" },
    { href: "/blog/best-live-dealer-casinos-2026/", label: "Best live dealer casinos" },
    { href: "/blog/online-casino-kyc-verification-guide/", label: "KYC verification explained" },
  ])}
</main>`;

const html = pageShell({
  title: meta.title,
  description:
    "Compare UKGC & MGA licensed online casinos for 2026: slots, live dealer, bonuses, payout speeds, and expert reviews for European and international players.",
  activePath: "/",
  canonicalPath: "/",
  keywords: meta.keywords,
  ogImage: meta.ogImage,
  includeWebSite: true,
  body,
});

await fs.writeFile(path.join(ROOT, "index.html"), html);
console.log("Homepage generated: index.html");
