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
import { pageBreadcrumbs, reviewBreadcrumbs } from "./lib/schema.mjs";

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
  "us-casinos.html": "US Casinos",
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
    activePath: file,
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
  <p class="lead">Licensed operators with strong slot libraries, fair <a href="/bonuses/">bonus terms</a>, and reliable <a href="/banking/">withdrawals</a>. We cross-check game fairness standards published by <a href="${AUTHORITY.ecogra.href}" target="_blank" rel="noopener noreferrer">${AUTHORITY.ecogra.label}</a>.</p>
  ${disclosure()}
  ${compareTable(operators)}
  <p>US players should read our <a href="/us-casinos/">state-by-state casino guide</a> and latest <a href="/blog/us-igaming-expansion-2026/">iGaming expansion update</a>. Slot fans can browse <a href="/blog/best-new-online-slots-2026/">new slots for 2026</a>; live-table players should see <a href="/blog/best-live-dealer-casinos-2026/">best live dealer casinos</a>.</p>
  ${cards(operators)}
</div>${sidebar}</main>`,
  },
  {
    file: "sports-betting.html",
    body: `<main class="container page-grid"><div>
  <p class="lead" style="background:#ebf8ff;padding:1rem;border-radius:8px"><strong>Primary focus: online casinos.</strong> For slots, live dealer, and casino bonuses visit our <a href="/online-casinos/">casino rankings</a> and <a href="/games/">games hub</a>.</p>
  <h1 class="section-title">Sports Betting (Secondary)</h1>
  <p class="lead">Some casino brands below also run sportsbooks. We list them for completeness—not as our main editorial focus. Problem gambling help: <a href="${AUTHORITY.ncpg.href}" target="_blank" rel="noopener noreferrer">NCPG</a>.</p>
  ${disclosure()}
  ${cards(operators.filter((o) => ["draftkings", "fanduel", "betmgm"].includes(o.slug)))}
</div>${sidebar}</main>`,
  },
  {
    file: "bonuses.html",
    body: `<main class="container page-grid"><div>
  <div class="breadcrumb"><a href="/">Home</a> » Casino Bonuses</div>
  <h1 class="section-title">Online Casino Bonuses &amp; Free Spins</h1>
  <p class="lead">Always read wagering requirements and expiry dates before opting in. Compare offers alongside our <a href="/online-casinos/">casino rankings</a> and <a href="/blog/twenty-dollar-casino-method/">bankroll strategy guide</a>.</p>
  ${disclosure()}
  <p>Regulators such as the <a href="${AUTHORITY.ukgc.href}" target="_blank" rel="noopener noreferrer">UK Gambling Commission</a> publish guidance on how promotions must be advertised—useful context when evaluating headline numbers.</p>
  ${cards(operators)}
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
    <li><strong>PayPal / Skrill</strong> — available on select US and international sites</li>
    <li><strong>Bitcoin / crypto</strong> — popular at <a href="/reviews/bovada/">Bovada</a> and <a href="/reviews/betus/">BetUS</a> for fast cash-outs</li>
    <li><strong>Bank transfer</strong> — higher limits, slower processing</li>
  </ul>
  <p>Licensed operators in regulated US states are overseen by bodies such as the <a href="${AUTHORITY.njDge.href}" target="_blank" rel="noopener noreferrer">New Jersey DGE</a> and <a href="${AUTHORITY.miGcb.href}" target="_blank" rel="noopener noreferrer">Michigan Gaming Control Board</a>.</p>
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
</div>${sidebar}</main>`,
  },
  {
    file: "us-casinos.html",
    body: `<main class="container page-grid"><div>
  <div class="breadcrumb"><a href="/">Home</a> » US Casinos</div>
  <h1 class="section-title">US Online Casinos</h1>
  <p class="lead">Availability depends on your state. Only play where operators are licensed. Industry data from the <a href="${AUTHORITY.aga.href}" target="_blank" rel="noopener noreferrer">American Gaming Association</a> tracks market growth.</p>
  ${disclosure()}
  <p>As of 2026, regulated iGaming continues to expand. See our <a href="/blog/us-igaming-expansion-2026/">US iGaming expansion report</a> for legislative updates and <a href="/casinos-by-country/">international alternatives</a>.</p>
  ${compareTable(operators.filter((o) => ["betmgm", "draftkings", "fanduel", "bovada", "betus"].includes(o.slug)))}
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
    <li><strong>United States</strong> — <a href="/us-casinos/">US casino guide</a></li>
    <li><strong>Canada</strong> — provincial rules apply; check operator geo-targeting</li>
    <li><strong>United Kingdom</strong> — UKGC-licensed brands (<a href="/reviews/888casino/">888casino</a>, <a href="/reviews/leovegas/">LeoVegas</a>)</li>
    <li><strong>Europe</strong> — MGA-licensed operators with multi-language support</li>
  </ul>
  ${cards(operators.filter((o) => ["888casino", "leovegas"].includes(o.slug)))}
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

for (const op of operators) {
  const html = pageShell({
    title: `${op.name} Casino Review`,
    description: `${op.name} review (2026): ${op.bestFor}. Welcome bonus, ${op.payout} payouts, games, and banking.`,
    activePath: "/reviews/",
    canonicalPath: `/reviews/${op.slug}/`,
    ogImage: op.logo,
    keywords: `${op.name} review, ${op.name} casino bonus, ${op.name} payout`,
    breadcrumbs: reviewBreadcrumbs(op.name, op.slug),
    body: `<main class="container page-grid"><article>
  <div class="breadcrumb"><a href="/">Home</a> » <a href="/reviews/">Reviews</a> » ${op.name}</div>
  <h1 class="section-title">${op.name} Review (2026)</h1>
  ${disclosure()}
  <p class="lead">${op.name} targets players who want ${op.bestFor.toLowerCase()}. Welcome offer: ${op.welcomeBonus}. Compare alternatives on <a href="/online-casinos/">best online casinos</a> and <a href="/bonuses/">bonus guide</a>.</p>
  <h2>Pros</h2>
  <ul><li>${op.highlights}</li><li>Reported payouts: ${op.payout}</li><li>Established brand with active promotions</li></ul>
  <h2>Welcome bonus</h2>
  <p>${op.welcomeBonus} — always confirm eligibility, wagering, and expiry on the operator site.</p>
  <h2>Banking</h2>
  <p>Withdrawal speeds are typically quoted as <strong>${op.payout}</strong> after KYC verification. Read our <a href="/banking/">banking guide</a> and <a href="/blog/fastest-payout-online-casinos/">payout comparison</a>.</p>
  <p><a href="${op.cta}" class="btn btn-lime" target="_blank" rel="nofollow sponsored noopener">Visit ${op.name}</a></p>
</article>${blogSidebar(posts)}</main>`,
  });
  await writePage(`reviews/${op.slug}.html`, html);
}

await writePage(
  "reviews/index.html",
  shell(
    "reviews/index.html",
    `<main class="container" style="padding:2rem 0">
  <div class="breadcrumb"><a href="/">Home</a> » Reviews</div>
  <h1 class="section-title">Operator Reviews</h1>
  <p class="lead">Deep dives into bonuses, apps, and payout performance. Start with <a href="/online-casinos/">casino rankings</a> or browse by topic on our <a href="/blog/">blog</a>.</p>
  ${cards(operators)}
</main>`,
    { activePath: "/reviews/" }
  )
);

console.log("All pages generated.");
