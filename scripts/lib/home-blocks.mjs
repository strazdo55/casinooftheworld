import { AUTHORITY } from "./links.mjs";

/** Pillar homepage sections — long-form SEO + pre-compare education */

export function pillarIntroBlock() {
  return `<section class="content-section pillar-intro" aria-labelledby="pillar-intro">
  <h2 id="pillar-intro" class="visually-hidden">About this guide</h2>
  <p class="lead">Casino of the World is an independent comparison site for <strong>European and international online casino players</strong>. We test how brands handle licensing, game libraries, bonus fine print, and real-world withdrawals—then publish side-by-side tables and in-depth reviews you can trust before depositing.</p>
  <p>Unlike directories that chase every market, we <strong>do not prioritise US state sportsbook-casino apps</strong>. Our editorial focus is UKGC and MGA licensees, plus selected international operators that accept EU, Nordic, Canadian, and other regulated or grey-market regions where players commonly search for offshore alternatives.</p>
  <p>Whether you care about <a href="/blog/best-new-online-slots-2026/">new slots for 2026</a>, <a href="/blog/best-live-dealer-casinos-2026/">live dealer tables</a>, or <a href="/blog/fastest-payout-online-casinos/">fastest cash-outs</a>, start with the comparison table below, model bonus playthrough in our <a href="/#wagering-calculator">wagering calculator</a>, then open the full <a href="/reviews/">operator review</a> for the brand you shortlist.</p>
</section>`;
}

export function quickStatsBar(count) {
  return `<div class="stats-bar" role="presentation">
  <div class="stats-bar__item"><strong>${count}+</strong><span>casinos reviewed</span></div>
  <div class="stats-bar__item"><strong>UKGC &amp; MGA</strong><span>licence focus</span></div>
  <div class="stats-bar__item"><strong>2026</strong><span>data refreshed</span></div>
  <div class="stats-bar__item"><strong>Free tools</strong><span>compare &amp; calculate</span></div>
</div>`;
}

export function chooseCasinoStepsBlock() {
  return `<section class="content-section" aria-labelledby="choose-casino">
  <h2 id="choose-casino" class="section-title">How to Choose an Online Casino (Checklist)</h2>
  <p class="muted" style="margin-top:0">Use this order every time you evaluate a new site—before you claim a welcome bonus or save payment details.</p>
  <ol class="pillar-steps">
    <li>
      <strong>Confirm legality and eligibility</strong>
      <p>Check that the operator accepts players from your country and holds a licence you recognise (<a href="${AUTHORITY.ukgc.href}" target="_blank" rel="noopener noreferrer">UKGC</a>, <a href="${AUTHORITY.mga.href}" target="_blank" rel="noopener noreferrer">MGA</a>, or another regulator). Read our <a href="/casinos-by-country/">casinos by country</a> hub and local law if unsure.</p>
    </li>
    <li>
      <strong>Read bonus terms, not headlines</strong>
      <p>A €500 match with 50× wagering on deposit plus bonus can require tens of thousands in bets before withdrawal. Note max bet caps, game weighting, and expiry. Use the <a href="/#wagering-calculator">wagering calculator</a> and <a href="/blog/wagering-requirements-explained/">wagering guide</a>.</p>
    </li>
    <li>
      <strong>Match payment methods to how you plan to cash out</strong>
      <p>Many sites require withdrawals to the same rail used for deposit (closed-loop rules). If you need PayPal, crypto, or instant banking, verify both directions in the cashier. See <a href="/banking/">banking &amp; payouts</a>.</p>
    </li>
    <li>
      <strong>Audit the game lobby</strong>
      <p>Slot fans need breadth and published RTP where possible. Live dealer players should confirm Evolution, Pragmatic Live, or similar studios. Table-game players should check blackjack/roulette rules and contribution to bonuses. Visit <a href="/games/">games hub</a>.</p>
    </li>
    <li>
      <strong>Test support and responsible-gambling tools</strong>
      <p>24/7 live chat, clear self-exclusion, and deposit limits are non-negotiable for long-term play. UK players should confirm GAMSTOP integration on UKGC brands.</p>
    </li>
  </ol>
</section>`;
}

export function categoryPicksBlock(operators) {
  const pick = (slug) => operators.find((o) => o.slug === slug);
  const groups = [
    {
      title: "Fastest payouts",
      desc: "Brands citing same-day or sub-48h cash-outs after KYC—often e-wallet or crypto friendly.",
      slugs: ["wazbee", "velobet", "22bet", "leovegas"],
    },
    {
      title: "MGA-licensed picks",
      desc: "Malta-licensed casinos popular with cross-border EU players—verify country acceptance.",
      slugs: ["n1-casino", "casumo", "betsson", "playjango"],
    },
    {
      title: "UK & EU established",
      desc: "Long track records with UKGC and/or strong European mobile apps.",
      slugs: ["888casino", "leovegas", "mrgreen", "betway"],
    },
  ];

  const cols = groups
    .map((g) => {
      const items = g.slugs
        .map((s) => pick(s))
        .filter(Boolean)
        .map(
          (op) => `<li><a href="/reviews/${op.slug}/">${op.name}</a> — ${op.payout}</li>`
        )
        .join("\n");
      return `<article class="category-pick">
  <h3>${g.title}</h3>
  <p>${g.desc}</p>
  <ul>${items}</ul>
</article>`;
    })
    .join("\n");

  return `<section class="content-section" aria-labelledby="category-picks">
  <h2 id="category-picks" class="section-title">Best Casinos by Category</h2>
  <p class="muted" style="margin-top:0">Shortlists from our current reviews—always confirm live terms on the operator site before depositing.</p>
  <div class="category-pick-grid">${cols}</div>
</section>`;
}

export function gamesPillarBlock() {
  return `<section class="content-section" aria-labelledby="games-pillar">
  <h2 id="games-pillar" class="section-title">Casino Games: What You Can Play Online</h2>
  <div class="info-grid">
    <article class="info-card">
      <h3>Online slots</h3>
      <p>RNG video slots dominate most lobbies—classic fruit machines to Megaways and bonus-buy titles. Check RTP in game help files and volatility fit for your bankroll. Guide: <a href="/blog/slot-rtp-volatility-explained/">RTP &amp; volatility</a> · <a href="/blog/best-new-online-slots-2026/">best new slots 2026</a>.</p>
    </article>
    <article class="info-card">
      <h3>Live dealer</h3>
      <p>Streamed blackjack, roulette, baccarat, and game shows with real hosts—higher minimums but transparent pacing. Studios from <a href="${AUTHORITY.evolution.href}" target="_blank" rel="noopener noreferrer">Evolution</a> power many EU sites. <a href="/blog/best-live-dealer-casinos-2026/">Top live casinos →</a></p>
    </article>
    <article class="info-card">
      <h3>Table games &amp; video poker</h3>
      <p>RNG blackjack and roulette often offer better house edges than slots when basic strategy is used. Compare rules (European vs American roulette). <a href="/blog/blackjack-basic-strategy-online/">Blackjack strategy →</a></p>
    </article>
    <article class="info-card">
      <h3>Crash &amp; instant games</h3>
      <p>Fast multiplier games (Aviator-style) are popular at international casinos—high risk, fast sessions. <a href="/blog/crash-games-online-casinos/">Crash games overview →</a></p>
    </article>
  </div>
</section>`;
}

export function bonusesPillarBlock() {
  return `<section class="content-section" aria-labelledby="bonuses-pillar">
  <h2 id="bonuses-pillar" class="section-title">Understanding Casino Bonuses</h2>
  <p>Welcome packages get the marketing spotlight, but the <em>terms</em> decide value. Below is what each bonus type usually involves on UK and EU-facing sites.</p>
  <div class="table-wrap">
  <table class="article-table">
    <thead><tr><th>Bonus type</th><th>Typical terms to verify</th><th>Our tools</th></tr></thead>
    <tbody>
      <tr><td>Deposit match</td><td>Wagering on bonus vs deposit+bonus; max bet (often €5); eligible games</td><td><a href="/#wagering-calculator">Calculator</a></td></tr>
      <tr><td>Free spins</td><td>Per-spin value; winnings cap; 24–72h expiry; slot restrictions</td><td><a href="/bonuses/">Bonus hub</a></td></tr>
      <tr><td>Reload / cashback</td><td>Lower wagering (sometimes 1×) for logged-in players</td><td><a href="/reviews/">Reviews</a></td></tr>
      <tr><td>No deposit</td><td>Strict KYC; low max cashout; high playthrough</td><td><a href="/blog/no-deposit-bonus-codes-2026/">No-deposit guide</a></td></tr>
    </tbody>
  </table>
  </div>
  <p>Regulators including the <a href="${AUTHORITY.ukgc.href}" target="_blank" rel="noopener noreferrer">UK Gambling Commission</a> restrict how bonuses may be advertised. Treat every offer as optional—never deposit more than you can afford to lose chasing playthrough.</p>
</section>`;
}

export function bankingPillarBlock() {
  return `<section class="content-section" aria-labelledby="banking-pillar">
  <h2 id="banking-pillar" class="section-title">Deposits, Withdrawals &amp; Payout Speed</h2>
  <p>Banking friction is the number-one complaint after bonus disputes. Here is how common methods compare on the international casinos we review.</p>
  <div class="table-wrap">
  <table class="article-table">
    <thead><tr><th>Method</th><th>Deposit</th><th>Withdrawal</th><th>Notes</th></tr></thead>
    <tbody>
      <tr><td>Visa / Mastercard</td><td>Instant</td><td>1–5 days</td><td>Widely accepted; some banks block gambling MCC</td></tr>
      <tr><td>PayPal, Skrill, Neteller</td><td>Instant</td><td>Hours–48h</td><td>Common on UKGC/MGA brands; e-wallet limits apply</td></tr>
      <tr><td>Trustly / instant bank</td><td>Instant</td><td>Same day–48h</td><td>Popular in Nordics and Germany</td></tr>
      <tr><td>Bitcoin / crypto</td><td>Minutes</td><td>Minutes–24h</td><td>Fast at <a href="/reviews/22bet/">22Bet</a>, <a href="/reviews/wazbee/">Wazbee</a>, <a href="/reviews/north-casino/">North Casino</a></td></tr>
      <tr><td>Bank wire</td><td>1–3 days</td><td>3–7+ days</td><td>Higher limits; slowest for casual players</td></tr>
    </tbody>
  </table>
  </div>
  <p>First withdrawals trigger <a href="/blog/online-casino-kyc-verification-guide/">KYC verification</a> (ID, address, payment proof). Submit documents early to avoid delays when you hit a cash-out.</p>
</section>`;
}

export function regionalHubBlock() {
  return `<section class="content-section" aria-labelledby="regional-hub">
  <h2 id="regional-hub" class="section-title">Find Casinos for Your Region</h2>
  <p class="muted" style="margin-top:0">Licensing and game catalogs change by jurisdiction—never assume a famous brand accepts your address.</p>
  <div class="hub-tile-grid">
    <a href="/casinos-by-country/" class="hub-tile">
      <h3>By country</h3>
      <p>UK, EU, Canada, Nordics, and international notes.</p>
    </a>
    <a href="/europe-casinos/" class="hub-tile">
      <h3>Europe &amp; Asia</h3>
      <p>MGA focus, cross-border play, bonus rules.</p>
    </a>
    <a href="/online-casinos/" class="hub-tile">
      <h3>Full casino list</h3>
      <p>Filtered comparison table and methodology.</p>
    </a>
    <a href="/blog/us-igaming-expansion-2026/" class="hub-tile">
      <h3>EU regulation 2026</h3>
      <p>Licensing trends affecting bonuses and ads.</p>
    </a>
  </div>
</section>`;
}

export function safetyPillarBlock() {
  return `<section class="content-section pillar-safety" aria-labelledby="safety-pillar">
  <h2 id="safety-pillar" class="section-title">Safer Gambling &amp; Player Protection</h2>
  <p>Real-money casino play should be entertainment, not income. Licensed operators must offer limits, reality checks, and self-exclusion—but <strong>you</strong> set the boundaries that matter.</p>
  <ul class="pillar-list">
    <li>Set a deposit limit before your first session and stick to it.</li>
    <li>Never chase losses or borrow to gamble.</li>
    <li>Take breaks—live dealer and slots are designed for long sessions.</li>
    <li>Use national self-exclusion registers where available (e.g. GAMSTOP in the UK).</li>
  </ul>
  <p>Help organisations: <a href="${AUTHORITY.begambleaware.href}" target="_blank" rel="noopener noreferrer">BeGambleAware</a> · <a href="${AUTHORITY.gamcare.href}" target="_blank" rel="noopener noreferrer">GamCare</a> · <a href="${AUTHORITY.ncpg.href}" target="_blank" rel="noopener noreferrer">NCPG</a>. More tools in our <a href="/blog/casino-responsible-gambling-tools/">responsible gambling guide</a>.</p>
</section>`;
}

export function editorialTrustBlock() {
  return `<section class="content-section" aria-labelledby="editorial-trust">
  <h2 id="editorial-trust" class="section-title">Why Trust Casino of the World?</h2>
  <p>We are an affiliate publisher, not a casino—we do not hold player funds or settle disputes. That independence lets us criticise weak bonus terms and slow payouts even when a brand pays commissions.</p>
  <div class="info-grid">
    <article class="info-card">
      <h3>Transparent rankings</h3>
      <p>Comparison filters show licence, payout tier, and crypto support. Each brand has a dedicated review with pros, cons, and banking tables.</p>
    </article>
    <article class="info-card">
      <h3>No paid placement</h3>
      <p>Operators cannot buy a higher table row. See <a href="/affiliate-disclosure/">affiliate disclosure</a> and <a href="/about/">about us</a>.</p>
    </article>
    <article class="info-card">
      <h3>Educational first</h3>
      <p>Guides on wagering, KYC, RTP, and live dealer mechanics—written for international players researching before they deposit.</p>
    </article>
  </div>
</section>`;
}
