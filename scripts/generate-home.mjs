import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import {
  pageShell,
  compareTable,
  guideCardGrid,
  uniquePosts,
  filterBarWithTools,
} from "./lib/html.mjs";
import {
  howWeRateBlock,
  faqBlock,
  topicLinksBlock,
  licensingTable,
  wageringCalculatorBlock,
} from "./lib/page-blocks.mjs";
import {
  pillarIntroBlock,
  quickStatsBar,
  chooseCasinoStepsBlock,
  categoryPicksBlock,
  gamesPillarBlock,
  bonusesPillarBlock,
  bankingPillarBlock,
  regionalHubBlock,
  safetyPillarBlock,
  editorialTrustBlock,
} from "./lib/home-blocks.mjs";
import { getFaqs } from "./lib/faqs.mjs";
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

${filterBarWithTools(`
      <a href="/online-casinos/">Top Casinos</a>
      <a href="/bonuses/">Bonuses &amp; Free Spins</a>
      <a href="/games/">Slots &amp; Live Dealer</a>
      <a href="/banking/">Banking &amp; Payouts</a>
      <a href="/europe-casinos/">Europe &amp; Asia</a>
    `)}

<main class="container">
  <p class="page-updated"><time datetime="${new Date().toISOString().slice(0, 10)}">Updated ${new Date().toLocaleString("en-GB", { month: "long", year: "numeric" })}</time> — comparison table, reviews, and guides refreshed by our editorial team.</p>

  <aside class="disclosure" style="margin-top:1rem">
    <strong>Affiliate Disclosure:</strong> We may earn a commission when you sign up via our links. Ratings are editorial—see <a href="/affiliate-disclosure/">how we make money</a>.
  </aside>

  ${pillarIntroBlock()}
  ${quickStatsBar(operators.length)}

  ${howWeRateBlock()}
  ${chooseCasinoStepsBlock()}

  <h2 class="section-title">Top-Rated Casinos — Quick Comparison</h2>
  <p class="muted" style="margin-bottom:1rem">Use filters to narrow by licence, payout speed, region, or crypto-friendly brands. All operators are drawn from our vetted international directory.</p>
  ${compareTable(operators, { filters: true })}

  ${categoryPicksBlock(operators)}

  ${wageringCalculatorBlock({ id: "wagering-calculator" })}

  ${bonusesPillarBlock()}
  ${bankingPillarBlock()}
  ${gamesPillarBlock()}

  <aside class="article-callout">
    <strong>Key takeaway</strong>
    Always verify that a casino accepts players from your country and holds a licence you trust. Bonus headlines change weekly—read wagering rules on the operator site before depositing.
  </aside>

  <h2 class="section-title">Licensing &amp; Player Protection</h2>
  <p>Regulation determines which games, payment methods, and dispute processes you get. Below is a simplified map; our <a href="/casinos-by-country/">country guide</a> goes deeper.</p>
  ${licensingTable()}
  ${regionalHubBlock()}
  ${editorialTrustBlock()}
  ${safetyPillarBlock()}

  <h2 class="section-title">All Operator Reviews (${operators.length})</h2>
  <p class="muted" style="margin-top:0">Every brand in our comparison table has a full review covering licensing, games, bonuses, banking, and responsible-gambling tools.</p>
  <div class="card-grid">${brandCards()}</div>

  <section class="content-section" aria-labelledby="editor-picks">
  <div class="section-head-row">
    <h2 id="editor-picks" class="section-title">Editor's Picks — Casino Guides</h2>
    <a href="/blog/" class="section-head-link">View all articles →</a>
  </div>
  <p class="lead" style="margin-top:0">In-depth guides on slots, EU licensing, payouts, and live dealer play—written for international players, not US state sportsbooks.</p>
  ${guideCardGrid(editorPicks, { truncate: true })}
  </section>

  ${faqBlock(getFaqs("home"), {
    intro: "Common questions about licensing, bonuses, payouts, and how we review casinos for European and international players.",
  })}

  ${topicLinksBlock([
    { href: "/online-casinos/", label: "Best online casinos compared" },
    { href: "/reviews/", label: "In-depth operator reviews" },
    { href: "/bonuses/", label: "Casino bonuses & free spins" },
    { href: "/banking/", label: "Banking & payout methods" },
    { href: "/games/", label: "Casino games hub" },
    { href: "/europe-casinos/", label: "Europe & Asia casinos" },
    { href: "/casinos-by-country/", label: "Casinos by country" },
    { href: "/blog/", label: "Casino blog — news & strategy" },
    { href: "/blog/best-new-online-slots-2026/", label: "Best new slots (2026)" },
    { href: "/blog/best-live-dealer-casinos-2026/", label: "Best live dealer casinos" },
    { href: "/blog/wagering-requirements-explained/", label: "Wagering requirements explained" },
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
  faqs: getFaqs("home"),
  preloadHero: true,
  skipQuickTools: true,
  body,
});

await fs.writeFile(path.join(ROOT, "index.html"), html);
console.log("Homepage generated: index.html");
