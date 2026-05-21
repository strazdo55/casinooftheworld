import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import {
  pageShell,
  writePage,
  disclosure,
  compareTable,
  blogSidebar,
} from "./lib/html.mjs";
import { PAGE_ENRICHMENT, AUTHORITY } from "./lib/links.mjs";
import { pageBreadcrumbs } from "./lib/schema.mjs";
import {
  howWeRateBlock,
  faqBlock,
  topicLinksBlock,
  licensingTable,
  compareSection,
} from "./lib/page-blocks.mjs";

const operators = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/operators.json"), "utf8")
);
const posts = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/blog.json"), "utf8")
);
const sidebar = blogSidebar(posts, 0);

const PAGE_CRUMB_LABELS = {
  "online-casinos.html": "Online Casinos",
  "sports-betting.html": "Sports Betting",
  "bonuses.html": "Casino Bonuses",
  "banking.html": "Banking",
  "games.html": "Casino Games",
  "europe-casinos.html": "Europe & Asia",
  "casinos-by-country.html": "Casinos by Country",
  "contact.html": "Contact",
  "about.html": "About",
  "affiliate-disclosure.html": "Affiliate Disclosure",
  "privacy.html": "Privacy Policy",
  "terms.html": "Terms of Use",
  "reviews/index.html": "Reviews",
};

function shell(file, body, extra = {}) {
  const meta = PAGE_ENRICHMENT[file] || {};
  const canonical =
    meta.canonicalPath ||
    `/${file.replace(/index\.html$/, "").replace(/\.html$/, "")}/`;
  const crumbLabel = extra.crumbLabel || PAGE_CRUMB_LABELS[file];
  const breadcrumbs = crumbLabel
    ? pageBreadcrumbs(crumbLabel, canonical)
    : null;

  return pageShell({
    title: meta.title || file,
    description: meta.description || "",
    activePath: canonical,
    canonicalPath: canonical,
    keywords: meta.keywords || "",
    ogImage: meta.ogImage,
    depth: meta.depth || 0,
    breadcrumbs,
    includeWebSite: file === "index.html",
    body,
    ...extra,
  });
}

function cards(list) {
  return `<div class="card-grid">${list
    .map(
      (op) => `<article class="affiliate-card">
  <img src="/${op.logo.replace(/^\//, "")}" alt="${op.name}">
  <span class="badge">${op.bestFor}</span>
  <h3>${op.name}</h3>
  <p><strong>Bonus:</strong> ${op.welcomeBonus}</p>
  <p>${op.highlights}</p>
  <a href="${op.cta}" class="btn btn-lime" target="_blank" rel="nofollow sponsored noopener">Claim Offer</a>
  <a href="/reviews/${op.slug}/" style="display:block;margin-top:0.5rem;font-size:0.85rem">Full review →</a>
</article>`
    )
    .join("")}</div>`;
}

const pages = [
  {
    file: "online-casinos.html",
    body: `<main class="container page-grid"><div>
  <div class="breadcrumb"><a href="/">Home</a> » Online Casinos</div>
  <h1 class="section-title">Best Online Casinos (2026)</h1>
  <p class="lead">We compare <strong>UKGC, MGA, and internationally licensed</strong> casinos on game depth, bonus fairness, payout speed, and mobile UX—updated May 2026.</p>
  ${compareSection(operators)}
  ${howWeRateBlock()}
  <p>European players should read our <a href="/europe-casinos/">Europe &amp; Asia hub</a> and <a href="/blog/us-igaming-expansion-2026/">EU regulation update</a>. Slot fans: <a href="/blog/best-new-online-slots-2026/">new slots 2026</a>. Live tables: <a href="/blog/best-live-dealer-casinos-2026/">best live dealer casinos</a>.</p>
  ${cards(operators)}
  ${faqBlock([
    { q: "What makes a casino “top rated” on this site?", a: "Licence quality, published RTP where available, bonus terms, banking speed, and responsible-gambling tools—not ad spend." },
    { q: "Do you list US state casinos?", a: "No. We focus on European and international operators. See <a href=\"/casinos-by-country/\">casinos by country</a> for your region." },
  ])}
</div>${sidebar}</main>`,
  },
  {
    file: "sports-betting.html",
    body: `<main class="container page-grid"><div>
  <p class="lead" style="background:#ebf8ff;padding:1rem;border-radius:8px"><strong>Primary focus: online casinos.</strong> For slots, live dealer, and casino bonuses visit our <a href="/online-casinos/">casino rankings</a> and <a href="/games/">games hub</a>.</p>
  <h1 class="section-title">Sports Betting (Secondary)</h1>
  <p class="lead">Some casino brands below also run sportsbooks. We list them for completeness—not as our main editorial focus. Help: <a href="${AUTHORITY.begambleaware.href}" target="_blank" rel="noopener noreferrer">BeGambleAware</a>.</p>
  ${disclosure()}
  ${cards(operators.filter((o) => ["betway", "betsson", "22bet"].includes(o.slug)))}
</div>${sidebar}</main>`,
  },
  {
    file: "bonuses.html",
    body: `<main class="container page-grid"><div>
  <div class="breadcrumb"><a href="/">Home</a> » Casino Bonuses</div>
  <h1 class="section-title">Online Casino Bonuses &amp; Free Spins</h1>
  <p class="lead">Always read wagering requirements and expiry dates before opting in. Compare offers alongside our <a href="/online-casinos/">casino rankings</a> and <a href="/blog/wagering-requirements-explained/">wagering requirements guide</a>.</p>
  ${disclosure()}
  <div class="table-wrap"><table class="article-table"><thead><tr><th>Bonus type</th><th>What to check</th></tr></thead><tbody>
  <tr><td>Deposit match</td><td>Playthrough multiplier, max bet, eligible games</td></tr>
  <tr><td>Free spins</td><td>Per-spin value, winnings cap, expiry</td></tr>
  <tr><td>No deposit</td><td>Max cashout, KYC before withdrawal</td></tr>
  </tbody></table></div>
  <p>Regulators such as the <a href="${AUTHORITY.ukgc.href}" target="_blank" rel="noopener noreferrer">UK Gambling Commission</a> publish strict advertising rules for promotions.</p>
  ${cards(operators)}
  ${faqBlock([{ q: "What is a 35x wagering requirement?", a: "You must bet 35× the bonus (or bonus+deposit) before withdrawing winnings. See our <a href=\"/blog/wagering-requirements-explained/\">worked examples</a>." }])}
</div>${sidebar}</main>`,
  },
  {
    file: "banking.html",
    body: `<main class="container page-grid"><div>
  <div class="breadcrumb"><a href="/">Home</a> » Banking</div>
  <h1 class="section-title">Banking &amp; Payout Methods</h1>
  <p class="lead">Crypto often clears fastest; debit cards are widely accepted for deposits but may not support withdrawals. See our <a href="/blog/fastest-payout-online-casinos/">fastest payout casino comparison</a>.</p>
  ${disclosure()}
  <h2>Typical payout times</h2>
  ${compareTable(operators)}
  <h2>Method overview</h2>
  <ul>
    <li><strong>Visa / Mastercard</strong> — instant deposits at most brands</li>
    <li><strong>PayPal / Skrill / Neteller</strong> — common at UK and EU brands</li>
    <li><strong>Bitcoin / crypto</strong> — fast at <a href="/reviews/22bet/">22Bet</a> and select international sites</li>
    <li><strong>Bank transfer</strong> — higher limits, slower processing</li>
    <li><strong>Trustly / instant banking</strong> — popular in Nordics and Germany</li>
  </ul>
  <p>EU and UK licensees must segregate player funds. Verify methods on the <a href="${AUTHORITY.mga.href}" target="_blank" rel="noopener noreferrer">MGA</a> or <a href="${AUTHORITY.ukgc.href}" target="_blank" rel="noopener noreferrer">UKGC</a> public registers where applicable.</p>
  ${faqBlock([{ q: "Why is my withdrawal pending?", a: "KYC checks, bonus wagering not complete, or method mismatch. Read our <a href=\"/blog/online-casino-kyc-verification-guide/\">KYC guide</a>." }])}
</div>${sidebar}</main>`,
  },
  {
    file: "games.html",
    body: `<main class="container page-grid"><div>
  <div class="breadcrumb"><a href="/">Home</a> » Casino Games</div>
  <h1 class="section-title">Casino Games Hub</h1>
  <p class="lead">Explore game types, house edges, and where to play them legally online. Compare <a href="/online-casinos/">licensed casinos</a> before depositing.</p>
  <div class="card-grid">
    <article class="affiliate-card"><h3>Online Slots</h3><p>RNG titles, progressive jackpots, and bonus-buy features. See <a href="/blog/best-new-online-slots-2026/">best new slots for 2026</a>.</p><a href="/blog/live-dealer-vs-rng-slots/">RNG vs live guide →</a></article>
    <article class="affiliate-card"><h3>Live Dealer</h3><p>Streamed blackjack, roulette, and game shows with real hosts. Studios from providers like <a href="${AUTHORITY.evolution.href}" target="_blank" rel="noopener noreferrer">Evolution</a>.</p><a href="/blog/best-live-dealer-casinos-2026/">Top live casinos →</a></article>
    <article class="affiliate-card"><h3>Table Games</h3><p>Learn basic strategy for blackjack and baccarat.</p><a href="/blog/twenty-dollar-casino-method/">Bankroll tips →</a></article>
  </div>
  ${howWeRateBlock()}
  ${topicLinksBlock([
    { href: "/blog/slot-rtp-volatility-explained/", label: "RTP & volatility explained" },
    { href: "/blog/blackjack-basic-strategy-online/", label: "Blackjack basic strategy" },
    { href: "/blog/roulette-variants-online-casino/", label: "Roulette variants compared" },
  ])}
</div>${sidebar}</main>`,
  },
  {
    file: "europe-casinos.html",
    body: `<main class="container page-grid"><div>
  <div class="breadcrumb"><a href="/">Home</a> » Europe &amp; Asia</div>
  <h1 class="section-title">European &amp; International Online Casinos (2026)</h1>
  <p class="lead">We focus on <a href="${AUTHORITY.ukgc.href}" target="_blank" rel="noopener noreferrer">UKGC</a>, <a href="${AUTHORITY.mga.href}" target="_blank" rel="noopener noreferrer">MGA</a>, and other recognised regulators—not US state-licensed sites. Compare libraries, bonuses, and payouts before you deposit.</p>
  ${disclosure()}
  <p>Read our <a href="/blog/us-igaming-expansion-2026/">EU &amp; UK regulation update</a>, browse <a href="/casinos-by-country/">casinos by country</a>, and see <a href="/blog/fastest-payout-online-casinos/">fastest payout brands</a> for cash-out benchmarks.</p>
  ${compareTable(operators)}
  ${licensingTable()}
  ${cards(operators)}
</div>${sidebar}</main>`,
  },
  {
    file: "casinos-by-country.html",
    body: `<main class="container page-grid"><div>
  <div class="breadcrumb"><a href="/">Home</a> » By Country</div>
  <h1 class="section-title">Casinos by Country</h1>
  <p class="lead">Licensing and game catalogs vary by jurisdiction. Verify local laws before playing. UK players should look for <a href="${AUTHORITY.ukgc.href}" target="_blank" rel="noopener noreferrer">UKGC</a> licensing; EU brands often hold <a href="${AUTHORITY.mga.href}" target="_blank" rel="noopener noreferrer">MGA</a> credentials.</p>
  <h2>Popular regions</h2>
  <ul>
    <li><strong>United Kingdom</strong> — UKGC-licensed brands (<a href="/reviews/888casino/">888casino</a>, <a href="/reviews/leovegas/">LeoVegas</a>)</li>
    <li><strong>Malta / EU</strong> — <a href="/europe-casinos/">MGA-licensed casinos</a></li>
    <li><strong>Canada (Ontario)</strong> — <a href="/blog/ontario-igaming-regulated-sites-2026/">regulated Ontario market</a></li>
    <li><strong>Nordics</strong> — <a href="/reviews/betsson/">Betsson</a>, <a href="/reviews/casumo/">Casumo</a></li>
    <li><strong>Asia / International</strong> — <a href="/reviews/22bet/">22Bet</a> (check local law)</li>
  </ul>
  ${licensingTable()}
  ${cards(operators)}
</div>${sidebar}</main>`,
  },
  {
    file: "contact.html",
    body: `<main class="container form-page">
  <h1 class="section-title">Contact Us</h1>
  <p class="lead">Partnerships, corrections, or reader questions—send a message below (demo form). Editorial standards are described on <a href="/about/">About Us</a>.</p>
  <form data-demo-form>
    <label for="name">Name</label>
    <input type="text" id="name" name="name" required>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>
    <label for="topic">Topic</label>
    <select id="topic" name="topic">
      <option>Editorial tip</option>
      <option>Affiliate partnership</option>
      <option>Correction</option>
      <option>Other</option>
    </select>
    <label for="message">Message</label>
    <textarea id="message" name="message" rows="6" required></textarea>
    <button type="submit" class="btn btn-lime">Send Message</button>
  </form>
</main>`,
  },
  {
    file: "about.html",
    body: `<main class="container" style="padding:2rem 0 4rem;max-width:72ch">
  <h1 class="section-title">About Casino of the World</h1>
  <p>We are an independent affiliate publisher focused on online casinos—slots, live dealer, table games, and casino bonuses. Our rankings weigh game variety, payout speed, bonus fairness, and mobile UX—not paid placement.</p>
  <p>Editorial standards require hands-on testing, transparent <a href="/affiliate-disclosure/">affiliate disclosures</a>, and responsible gambling messaging on every money page. We link to recognized help organizations including <a href="${AUTHORITY.ncpg.href}" target="_blank" rel="noopener noreferrer">NCPG</a> and <a href="${AUTHORITY.begambleaware.href}" target="_blank" rel="noopener noreferrer">BeGambleAware</a>.</p>
  <p>Explore our <a href="/online-casinos/">casino comparisons</a>, <a href="/reviews/">operator reviews</a>, and <a href="/blog/">casino blog</a>.</p>
</main>`,
  },
  {
    file: "affiliate-disclosure.html",
    body: `<main class="container" style="padding:2rem 0 4rem;max-width:72ch">
  <h1 class="section-title">Affiliate Disclosure</h1>
  <p>Casino of the World participates in affiliate programs. When you click outbound links and register or deposit, we may earn compensation. This does not increase your cost.</p>
  <p>Ratings are based on our review criteria published in <a href="/reviews/">operator reviews</a>. Commercial relationships do not guarantee placement or score. See <a href="/privacy/">Privacy Policy</a> and <a href="/terms/">Terms of Use</a>.</p>
</main>`,
  },
  {
    file: "privacy.html",
    body: `<main class="container" style="padding:2rem 0 4rem;max-width:72ch">
  <h1 class="section-title">Privacy Policy</h1>
  <p>We collect minimal analytics data to improve the site. Newsletter forms on this demo site do not transmit data to a server until you configure an endpoint.</p>
  <p>Contact: privacy@casinooftheworld.com (placeholder). Return to <a href="/">homepage</a> or read our <a href="/affiliate-disclosure/">affiliate disclosure</a>.</p>
</main>`,
  },
  {
    file: "terms.html",
    body: `<main class="container" style="padding:2rem 0 4rem;max-width:72ch">
  <h1 class="section-title">Terms of Use</h1>
  <p>Content is for informational purposes only. You must be 18+ (or legal age in your jurisdiction) to use gambling services linked from this site.</p>
  <p>We are not responsible for third-party operator terms, bonus changes, or account disputes. If gambling stops being fun, contact <a href="${AUTHORITY.ncpg.href}" target="_blank" rel="noopener noreferrer">NCPG</a> for confidential help.</p>
</main>`,
  },
];

for (const p of pages) {
  await writePage(p.file, shell(p.file, p.body));
  console.log("Page:", p.file);
}

console.log("Hub pages generated. Run: npm run build:reviews for Firecrawl reviews.");
