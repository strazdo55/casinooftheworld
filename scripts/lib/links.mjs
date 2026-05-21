/** Curated internal + external links for core site pages */

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
    .map((l) => `    <li><a href="${l.href}">${l.label}</a></li>`)
    .join("\n");
  return `<section class="article-related" aria-labelledby="related-heading">
  <h2 id="related-heading">Related guides on Casino of the World</h2>
  <ul class="related-list">
${lis}
  </ul>
</section>`;
}

export function pageResources({ intro, related, external }) {
  return `${intro || ""}
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
      { href: "us-casinos.html", label: "US regulated casino guide" },
    ],
    external: [AUTHORITY.aga, AUTHORITY.ecogra, AUTHORITY.ncpg],
  },
  "online-casinos.html": {
    title: "Best Online Casinos",
    description:
      "Top-rated online casinos for 2026 with bonuses, games, and payout speeds compared.",
    canonicalPath: "/online-casinos",
    keywords:
      "best online casinos 2026, real money casino sites, licensed online casinos, casino reviews",
    intro:
      '<p class="page-resources-intro">We independently compare game libraries, bonus terms, and cash-out speeds. For state-specific rules see <a href="us-casinos.html">US casinos</a>, international options on <a href="casinos-by-country.html">casinos by country</a>, and deep dives in our <a href="reviews/index.html">operator reviews</a>.</p>',
    related: [
      { href: "bonuses.html", label: "Welcome bonuses & free spins" },
      { href: "banking.html", label: "Deposit & withdrawal methods" },
      { href: "blog/fastest-payout-online-casinos.html", label: "Fastest payout casinos compared" },
      { href: "games.html", label: "Slots, live dealer & table games" },
    ],
    external: [AUTHORITY.ecogra, AUTHORITY.aga, AUTHORITY.ukgc, AUTHORITY.ncpg],
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
      { href: "us-casinos.html", label: "US banking by state" },
      { href: "reviews/bovada.html", label: "Bovada — crypto cashouts" },
    ],
    external: [
      {
        href: "https://www.consumerfinance.gov/consumer-tools/",
        label: "Consumer Financial Protection Bureau (CFPB)",
      },
      AUTHORITY.ncpg,
      AUTHORITY.mga,
    ],
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
  "us-casinos.html": {
    title: "US Online Casinos by State",
    description:
      "State-by-state guide to legal US online casinos, slots, and live dealer games in 2026.",
    canonicalPath: "/us-casinos",
    keywords:
      "US online casinos, legal iGaming states, NJ online casino, MI online casino, PA casino",
    intro:
      '<p class="page-resources-intro">Legality depends on your state. Read our <a href="blog/us-igaming-expansion-2026.html">2026 US iGaming expansion update</a> and verify licensing on official regulator sites before depositing.</p>',
    related: [
      { href: "blog/us-igaming-expansion-2026.html", label: "US iGaming expansion (2026)" },
      { href: "online-casinos.html", label: "National casino comparisons" },
      { href: "reviews/betmgm.html", label: "BetMGM review" },
      { href: "reviews/draftkings.html", label: "DraftKings Casino review" },
    ],
    external: [AUTHORITY.njDge, AUTHORITY.miGcb, AUTHORITY.paGcb, AUTHORITY.aga, AUTHORITY.ncpg],
  },
  "casinos-by-country.html": {
    title: "Online Casinos by Country",
    description:
      "Find licensed online casinos in the UK, Canada, EU, and other regions — jurisdiction explained.",
    canonicalPath: "/casinos-by-country",
    keywords:
      "online casinos by country, UKGC casinos, MGA casinos, Canada online casino, EU gambling",
    intro:
      '<p class="page-resources-intro">US players should start with our <a href="us-casinos.html">United States guide</a>. International readers should confirm local licensing before signing up.</p>',
    related: [
      { href: "us-casinos.html", label: "US online casinos" },
      { href: "reviews/888casino.html", label: "888casino (UK/EU)" },
      { href: "reviews/leovegas.html", label: "LeoVegas (international)" },
      { href: "online-casinos.html", label: "Global casino rankings" },
    ],
    external: [AUTHORITY.ukgc, AUTHORITY.mga, AUTHORITY.begambleaware, AUTHORITY.ecogra],
  },
  "sports-betting.html": {
    title: "Sports Betting Sites",
    description:
      "US sportsbooks with casino products — secondary listing; our primary focus is online casinos.",
    canonicalPath: "/sports-betting",
    keywords:
      "sports betting sites, sportsbook bonuses, US sportsbooks, casino and sportsbook",
    intro:
      '<p class="page-resources-intro"><strong>Our primary focus is online casinos.</strong> For slots and live dealer content visit <a href="online-casinos.html">casino rankings</a> and <a href="games.html">games hub</a>.</p>',
    related: [
      { href: "online-casinos.html", label: "Online casinos (primary)" },
      { href: "reviews/draftkings.html", label: "DraftKings" },
      { href: "reviews/fanduel.html", label: "FanDuel" },
    ],
    external: [AUTHORITY.aga, AUTHORITY.ncpg],
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
      "Expert casino blog: slot reviews, US iGaming news, live dealer guides, and bankroll tips for 2026.",
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
    external: [AUTHORITY.aga, AUTHORITY.ncpg],
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

  const context = enrichment.context || "";
  const related = relatedList(enrichment.related || []);
  const external = externalList(enrichment.external || []);

  return `${context}
${bodyHtml}
${related}
${external}`;
}
