/** Curated internal + external links for core site pages */

import { htmlHrefToClean, rewriteHtmlLinks } from "./paths.mjs";

export const AUTHORITY = {
  ncpg: {
    href: "https://www.ncpgambling.org/",
    label: "National Council on Problem Gambling (NCPG)",
  },
  begambleaware: {
    href: "https://www.begambleaware.org/",
    label: "BeGambleAware",
  },
  aga: {
    href: "https://www.americangaming.org/",
    label: "American Gaming Association",
  },
  ukgc: {
    href: "https://www.gamblingcommission.gov.uk/",
    label: "UK Gambling Commission",
  },
  mga: {
    href: "https://www.mga.org.mt/",
    label: "Malta Gaming Authority",
  },
  ecogra: {
    href: "https://www.ecogra.org/",
    label: "eCOGRA",
  },
  njDge: {
    href: "https://www.nj.gov/oag/ge/",
    label: "New Jersey Division of Gaming Enforcement",
  },
  miGcb: {
    href: "https://www.michigan.gov/mgcb",
    label: "Michigan Gaming Control Board",
  },
  paGcb: {
    href: "https://gamingcontrolboard.pa.gov/",
    label: "Pennsylvania Gaming Control Board",
  },
  evolution: {
    href: "https://www.evolution.com/",
    label: "Evolution (live casino studios)",
  },
};

export function externalList(items) {
  const lis = items
    .map(
      (l) =>
        `    <li><a href="${l.href}" target="_blank" rel="noopener noreferrer">${l.label}</a></li>`
    )
    .join("\n");
  return `<section class="article-sources" aria-labelledby="sources-heading">
  <h2 id="sources-heading">Trusted sources &amp; further reading</h2>
  <ul class="source-list">
${lis}
  </ul>
</section>`;
}

export function relatedList(items) {
  const lis = items
    .map((l) => `    <li><a href="${htmlHrefToClean(l.href)}">${l.label}</a></li>`)
    .join("\n");
  return `<section class="article-related" aria-labelledby="related-heading">
  <h2 id="related-heading">Related guides on Casino of the World</h2>
  <ul class="related-list">
${lis}
  </ul>
</section>`;
}

export function pageResources({ intro, related, external }) {
  const cleanIntro = intro ? rewriteHtmlLinks(intro) : "";
  return `${cleanIntro}
${related ? relatedList(related) : ""}
${external ? externalList(external) : ""}`;
}

export const PAGE_ENRICHMENT = {
  "index.html": {
    title: "Best Online Casinos 2026",
    description:
      "Ranked online casinos for slots, live dealer, and table games. Expert reviews, free spins bonuses, and fast payout comparisons.",
    canonicalPath: "/",
    ogImage: "assets/images/hero/home-hero.png",
    keywords:
      "best online casinos, online slots, live dealer casino, casino bonuses, fast payouts 2026",
    related: [
      { href: "online-casinos.html", label: "Compare top online casinos" },
      { href: "bonuses.html", label: "Casino bonuses & free spins" },
      { href: "blog/best-new-online-slots-2026.html", label: "Best new slots for 2026" },
      { href: "europe-casinos.html", label: "European licensed casino guide" },
    ],
    external: [AUTHORITY.ukgc, AUTHORITY.mga, AUTHORITY.ecogra, AUTHORITY.begambleaware],
  },
  "online-casinos.html": {
    title: "Best Online Casinos",
    description:
      "Top-rated online casinos for 2026 with bonuses, games, and payout speeds compared.",
    canonicalPath: "/online-casinos",
    keywords:
      "best online casinos 2026, real money casino sites, licensed online casinos, casino reviews",
    intro:
      '<p class="page-resources-intro">We independently compare game libraries, bonus terms, and cash-out speeds. See <a href="europe-casinos.html">European licensed casinos</a>, <a href="casinos-by-country.html">casinos by country</a>, and <a href="reviews/index.html">operator reviews</a>.</p>',
    related: [
      { href: "bonuses.html", label: "Welcome bonuses & free spins" },
      { href: "banking.html", label: "Deposit & withdrawal methods" },
      { href: "blog/fastest-payout-online-casinos.html", label: "Fastest payout casinos compared" },
      { href: "games.html", label: "Slots, live dealer & table games" },
    ],
    external: [AUTHORITY.ecogra, AUTHORITY.ukgc, AUTHORITY.mga, AUTHORITY.begambleaware],
  },
  "bonuses.html": {
    title: "Casino Bonuses & Free Spins",
    description:
      "Welcome bonuses, free spins, and promo codes for top gambling sites — wagering rules explained.",
    canonicalPath: "/bonuses",
    keywords:
      "casino bonus, welcome bonus, free spins, wagering requirements, promo codes 2026",
    intro:
      '<p class="page-resources-intro">Always read wagering requirements before opting in. Pair offers with our <a href="online-casinos.html">casino rankings</a> and <a href="blog/twenty-dollar-casino-method.html">bankroll strategy guide</a>.</p>',
    related: [
      { href: "online-casinos.html", label: "Best online casinos" },
      { href: "blog/best-new-online-slots-2026.html", label: "New slots worth free-spin promos" },
      { href: "reviews/index.html", label: "Operator reviews" },
    ],
    external: [AUTHORITY.ukgc, AUTHORITY.ncpg, AUTHORITY.begambleaware],
  },
  "banking.html": {
    title: "Casino Banking & Payouts",
    description:
      "Deposit and withdrawal methods at online casinos: cards, e-wallets, crypto, and typical payout times.",
    canonicalPath: "/banking",
    keywords:
      "casino banking, fast withdrawals, PayPal casino, crypto casino deposit, payout times",
    intro:
      '<p class="page-resources-intro">Withdrawal speed varies by KYC status and method. See our <a href="blog/fastest-payout-online-casinos.html">fastest payout casino report</a> and <a href="online-casinos.html">full operator comparison</a>.</p>',
    related: [
      { href: "blog/fastest-payout-online-casinos.html", label: "Fastest payout casinos (2026)" },
      { href: "online-casinos.html", label: "Top casinos compared" },
      { href: "europe-casinos.html", label: "EU & UK banking options" },
      { href: "reviews/22bet.html", label: "22Bet — crypto cashouts" },
    ],
    external: [AUTHORITY.mga, AUTHORITY.ukgc, AUTHORITY.begambleaware],
  },
  "games.html": {
    title: "Casino Games — Slots, Live Dealer & Tables",
    description:
      "Online slots, live dealer blackjack, roulette, and table games — house edge and where to play legally.",
    canonicalPath: "/games",
    keywords:
      "online casino games, online slots, live dealer blackjack, roulette, RTP explained",
    intro:
      '<p class="page-resources-intro">Not sure where to play? Start with <a href="online-casinos.html">licensed casinos</a> and explore our <a href="blog/index.html">casino blog</a> for game-type guides.</p>',
    related: [
      { href: "blog/best-new-online-slots-2026.html", label: "Best new online slots (2026)" },
      { href: "blog/live-dealer-vs-rng-slots.html", label: "Live dealer vs RNG slots" },
      { href: "blog/best-live-dealer-casinos-2026.html", label: "Best live dealer casinos" },
      { href: "bonuses.html", label: "Game-specific casino bonuses" },
    ],
    external: [AUTHORITY.evolution, AUTHORITY.ecogra, AUTHORITY.unlv],
  },
  "europe-casinos/index.html": {
    title: "European & International Online Casinos",
    description:
      "UKGC, MGA, and international online casinos compared — slots, live dealer, bonuses, and payouts for 2026.",
    canonicalPath: "/europe-casinos",
    keywords:
      "European online casinos, UKGC casino sites, MGA licensed casinos, international iGaming 2026",
    intro:
      '<p class="page-resources-intro">We do not promote US state-regulated operators. Start with our <a href="blog/us-igaming-expansion-2026.html">EU &amp; UK regulation update</a> and verify your local licence before depositing.</p>',
    related: [
      { href: "blog/us-igaming-expansion-2026.html", label: "EU & UK regulation (2026)" },
      { href: "online-casinos.html", label: "Global casino comparisons" },
      { href: "reviews/leovegas.html", label: "LeoVegas review" },
      { href: "reviews/888casino.html", label: "888casino review" },
    ],
    external: [AUTHORITY.ukgc, AUTHORITY.mga, AUTHORITY.begambleaware, AUTHORITY.ecogra],
  },
  "casinos-by-country.html": {
    title: "Online Casinos by Country",
    description:
      "Find licensed online casinos in the UK, Canada, EU, and other regions — jurisdiction explained.",
    canonicalPath: "/casinos-by-country",
    keywords:
      "online casinos by country, UKGC casinos, MGA casinos, Canada online casino, EU gambling",
    intro:
      '<p class="page-resources-intro">Confirm local licensing before signing up. European readers should see our <a href="europe-casinos.html">EU &amp; UK casino guide</a>.</p>',
    related: [
      { href: "europe-casinos.html", label: "European online casinos" },
      { href: "reviews/888casino.html", label: "888casino (UK/EU)" },
      { href: "reviews/leovegas.html", label: "LeoVegas (international)" },
      { href: "online-casinos.html", label: "Global casino rankings" },
    ],
    external: [AUTHORITY.ukgc, AUTHORITY.mga, AUTHORITY.begambleaware, AUTHORITY.ecogra],
  },
  "sports-betting.html": {
    title: "Sports Betting (Secondary)",
    description:
      "International sportsbooks with casino products — secondary listing; our primary focus is online casinos.",
    canonicalPath: "/sports-betting",
    keywords:
      "sports betting casino, international sportsbook, EU sportsbook casino",
    intro:
      '<p class="page-resources-intro"><strong>Our primary focus is online casinos.</strong> For slots and live dealer content visit <a href="online-casinos.html">casino rankings</a> and <a href="europe-casinos.html">European casinos</a>.</p>',
    related: [
      { href: "online-casinos.html", label: "Online casinos (primary)" },
      { href: "reviews/betway.html", label: "Betway" },
      { href: "reviews/betsson.html", label: "Betsson" },
    ],
    external: [AUTHORITY.ukgc, AUTHORITY.begambleaware],
  },
  "reviews/index.html": {
    title: "Casino Reviews",
    description:
      "In-depth reviews of top online casinos: bonuses, games, banking, and payout speeds.",
    canonicalPath: "/reviews/",
    depth: 1,
    keywords: "online casino reviews, sportsbook reviews, honest casino ratings 2026",
    related: [
      { href: "../online-casinos.html", label: "All casinos compared" },
      { href: "../bonuses.html", label: "Bonus breakdowns" },
      { href: "../blog/fastest-payout-online-casinos.html", label: "Payout speed analysis" },
    ],
    external: [AUTHORITY.ecogra, AUTHORITY.ncpg],
  },
  "blog/index.html": {
    title: "Casino Blog — News, Slots & Live Dealer Guides",
    description:
      "Expert casino blog: slot reviews, UK & EU licensing news, live dealer guides, and bankroll tips for 2026.",
    canonicalPath: "/blog/",
    depth: 1,
    ogImage: "assets/images/blog/best-new-online-slots-2026.png",
    keywords:
      "casino blog, online gambling news, slot guides, live dealer tips, casino strategy",
    related: [
      { href: "../online-casinos.html", label: "Best online casinos" },
      { href: "../games.html", label: "Casino games hub" },
      { href: "best-new-online-slots-2026.html", label: "Featured: best new slots 2026" },
    ],
    external: [AUTHORITY.ukgc, AUTHORITY.begambleaware],
  },
};

// Fix games.html reference to unlv - add to AUTHORITY
PAGE_ENRICHMENT["games.html"].external[2] = {
  href: "https://www.unlv.edu/igi",
  label: "UNLV International Gaming Institute",
};

export function enrichBlogArticle(bodyHtml, enrichment, depth = 1) {
  if (!enrichment) return bodyHtml;
  const marker = 'class="article-related"';
  if (bodyHtml.includes(marker)) return bodyHtml;

  const context = enrichment.context ? rewriteHtmlLinks(enrichment.context) : "";
  const related = relatedList(enrichment.related || []);
  const external = externalList(enrichment.external || []);

  return `${context}
${bodyHtml}
${related}
${external}`;
}
