/** Semantic internal linking — varied anchor text, topical relevance */

export const OPERATOR_SLUGS = [
  "leovegas",
  "888casino",
  "betway",
  "casumo",
  "mrgreen",
  "betsson",
  "22bet",
];

export const HUB_LINKS = {
  onlineCasinos: {
    href: "/online-casinos/",
    anchors: [
      "licensed European online casinos",
      "top-rated international casino sites",
      "compare regulated online casinos",
      "our casino rankings hub",
    ],
  },
  bonuses: {
    href: "/bonuses/",
    anchors: [
      "casino welcome bonuses and free spins",
      "bonus terms explained",
      "latest free-spin promotions",
    ],
  },
  banking: {
    href: "/banking/",
    anchors: [
      "deposit and withdrawal methods",
      "casino banking and payout guide",
      "e-wallet and crypto cashouts",
    ],
  },
  games: {
    href: "/games/",
    anchors: [
      "online slots and table games hub",
      "casino games library overview",
      "slots, live dealer, and table games",
    ],
  },
  byCountry: {
    href: "/casinos-by-country/",
    anchors: [
      "online casinos by country and licence",
      "UKGC and MGA casino jurisdictions",
      "find casinos in your region",
    ],
  },
  europe: {
    href: "/europe-casinos/",
    anchors: [
      "European licensed casino guide",
      "EU and UK regulated operators",
      "best casinos for European players",
    ],
  },
  reviews: {
    href: "/reviews/",
    anchors: ["in-depth operator reviews", "honest casino reviews (2026)"],
  },
  blog: {
    href: "/blog/",
    anchors: ["Casino of the World blog", "latest casino guides"],
  },
};

/** @param {{href:string, anchor:string}[]} links */
export function formatLinksForPrompt(links) {
  return links
    .map((l) => `- <a href="${l.href}">${l.anchor}</a>`)
    .join("\n");
}

export function linksForPost(slug, category) {
  const base = [
    { href: HUB_LINKS.onlineCasinos.href, anchor: pick(HUB_LINKS.onlineCasinos.anchors) },
    { href: HUB_LINKS.bonuses.href, anchor: pick(HUB_LINKS.bonuses.anchors) },
    { href: HUB_LINKS.byCountry.href, anchor: pick(HUB_LINKS.byCountry.anchors) },
  ];

  const byCategory = {
    Slots: [
      { href: "/blog/best-new-online-slots-2026/", anchor: "best new online slots for 2026" },
      { href: "/blog/megaways-slots-how-they-work/", anchor: "how Megaways mechanics work" },
      { href: HUB_LINKS.games.href, anchor: pick(HUB_LINKS.games.anchors) },
    ],
    "Live Casino": [
      { href: "/blog/best-live-dealer-casinos-2026/", anchor: "top live dealer casinos in 2026" },
      { href: "/blog/live-dealer-vs-rng-slots/", anchor: "live dealer vs RNG slots" },
      { href: "/reviews/leovegas/", anchor: "LeoVegas live casino review" },
    ],
    Banking: [
      { href: "/blog/fastest-payout-online-casinos/", anchor: "fastest payout casinos compared" },
      { href: "/blog/bitcoin-casino-withdrawals-guide/", anchor: "Bitcoin withdrawal guide" },
      { href: HUB_LINKS.banking.href, anchor: pick(HUB_LINKS.banking.anchors) },
    ],
    "Casino News": [
      { href: HUB_LINKS.europe.href, anchor: pick(HUB_LINKS.europe.anchors) },
      { href: "/blog/ontario-igaming-regulated-sites-2026/", anchor: "regulated Ontario iGaming market" },
    ],
    "Europe Casinos": [
      { href: HUB_LINKS.europe.href, anchor: pick(HUB_LINKS.europe.anchors) },
      { href: "/reviews/888casino/", anchor: "888casino UK/EU review" },
      { href: "/reviews/betsson/", anchor: "Betsson Nordic casino review" },
    ],
  };

  const names = {
    leovegas: "LeoVegas",
    "888casino": "888casino",
    betway: "Betway",
    casumo: "Casumo",
    mrgreen: "Mr Green",
    betsson: "Betsson",
    "22bet": "22Bet",
  };
  const review = pick(OPERATOR_SLUGS.filter((s) => s !== slug));
  const operatorLink = {
    href: `/reviews/${review}/`,
    anchor: `${names[review] || review} casino review`,
  };

  return [...base, ...(byCategory[category] || []), operatorLink].slice(0, 8);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function buildArticleContext(links) {
  const lis = links
    .slice(0, 5)
    .map((l) => `      <li><a href="${l.href}">${l.anchor}</a></li>`)
    .join("\n");
  return `<nav class="article-context" aria-label="Related reading on this site">
  <p><strong>In this guide:</strong> explore related pages on Casino of the World:</p>
  <ul class="semantic-link-list">
${lis}
  </ul>
</nav>`;
}
