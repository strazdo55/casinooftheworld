import { AUTHORITY } from "./links.mjs";
import { compareTable, disclosure } from "./html.mjs";
import { wageringCalculatorBlock } from "./wagering-calculator.mjs";

/** Reusable informative HTML blocks for hub pages */

export function howWeRateBlock() {
  return `<section class="content-section" aria-labelledby="how-we-rate">
  <h2 id="how-we-rate" class="section-title">How We Rate Online Casinos</h2>
  <div class="info-grid">
    <article class="info-card">
      <h3>Licensing &amp; safety</h3>
      <p>We prioritise <a href="${AUTHORITY.ukgc.href}" target="_blank" rel="noopener noreferrer">UKGC</a>, <a href="${AUTHORITY.mga.href}" target="_blank" rel="noopener noreferrer">MGA</a>, and other recognised regulators—not unlicensed grey-market sites.</p>
    </article>
    <article class="info-card">
      <h3>Games &amp; RTP</h3>
      <p>Slot depth, live dealer studios (e.g. <a href="${AUTHORITY.evolution.href}" target="_blank" rel="noopener noreferrer">Evolution</a>), and whether RTP or rules are published.</p>
    </article>
    <article class="info-card">
      <h3>Bonuses &amp; terms</h3>
      <p>Welcome offers are scored on wagering, game weighting, max bet rules, and expiry—not headline numbers alone.</p>
    </article>
    <article class="info-card">
      <h3>Banking speed</h3>
      <p>E-wallets, cards, and crypto where supported; typical KYC and cash-out timelines from operator terms.</p>
    </article>
    <article class="info-card">
      <h3>Mobile experience</h3>
      <p>App vs browser play, stream quality on live tables, and navigation on smaller screens.</p>
    </article>
    <article class="info-card">
      <h3>Responsible play</h3>
      <p>Deposit limits, time-outs, self-exclusion, and links to <a href="${AUTHORITY.begambleaware.href}" target="_blank" rel="noopener noreferrer">BeGambleAware</a> / <a href="${AUTHORITY.gamcare.href}" target="_blank" rel="noopener noreferrer">GamCare</a>.</p>
    </article>
  </div>
</section>`;
}

export function faqBlock(items) {
  const lis = items
    .map(
      (f) => `<details class="faq-item">
  <summary>${f.q}</summary>
  <p>${f.a}</p>
</details>`
    )
    .join("\n");
  return `<section class="content-section faq-section" aria-labelledby="faq-heading">
  <h2 id="faq-heading" class="section-title">Frequently Asked Questions</h2>
  ${lis}
</section>`;
}

export function topicLinksBlock(links) {
  const lis = links
    .map((l) => `<li><a href="${l.href}">${l.label}</a></li>`)
    .join("\n");
  return `<section class="content-section">
  <h2 class="section-title">Explore More Guides</h2>
  <ul class="topic-link-list">${lis}</ul>
</section>`;
}

export function licensingTable() {
  return `<div class="table-wrap">
<table class="article-table">
  <thead><tr><th>Region</th><th>Regulator</th><th>What it means for players</th></tr></thead>
  <tbody>
    <tr><td>United Kingdom</td><td><a href="${AUTHORITY.ukgc.href}" target="_blank" rel="noopener noreferrer">UKGC</a></td><td>Strict ads rules, segregated funds, GAMSTOP self-exclusion</td></tr>
    <tr><td>Malta / EU</td><td><a href="${AUTHORITY.mga.href}" target="_blank" rel="noopener noreferrer">MGA</a></td><td>Cross-border licences; check if brand accepts your country</td></tr>
    <tr><td>Canada (Ontario)</td><td>AGCO / iGO</td><td>Ring-fenced market; only AGCO-licensed sites for ON players</td></tr>
    <tr><td>International</td><td>Varies</td><td>Confirm local law; we list <a href="/casinos-by-country/">casinos by country</a></td></tr>
  </tbody>
</table>
</div>`;
}

export function compareSection(operators, title = "Compare Licensed Casinos") {
  return `<h2 class="section-title">${title}</h2>
  ${disclosure()}
  ${compareTable(operators, { filters: true })}`;
}

export { wageringCalculatorBlock };
