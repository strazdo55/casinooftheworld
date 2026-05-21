/** Comparison table with client-side filters (licence, payout, market, crypto) */

function licenceLabel(op) {
  return (op.licences || []).join(" / ") || op.licenceLabel || "International";
}

function rowAttrs(op) {
  const licences = (op.licences || []).map((l) => l.toLowerCase()).join(" ");
  const markets = (op.markets || []).map((m) => m.toLowerCase()).join(" ");
  return `data-licences="${licences}" data-payout="${op.payoutTier || "standard"}" data-markets="${markets}" data-crypto="${op.crypto ? "yes" : "no"}" data-live="${op.liveDealer !== false ? "yes" : "no"}"`;
}

export function compareFilters() {
  return `<div class="compare-filters" id="compare-filters" role="search" aria-label="Filter casino comparison">
  <div class="compare-filters__row">
    <label class="compare-filter">
      <span>Licence</span>
      <select id="filter-licence" data-compare-filter>
        <option value="all">All licences</option>
        <option value="mga">MGA</option>
        <option value="ukgc">UKGC</option>
        <option value="curacao">Curacao / international</option>
      </select>
    </label>
    <label class="compare-filter">
      <span>Payout speed</span>
      <select id="filter-payout" data-compare-filter>
        <option value="all">Any speed</option>
        <option value="fast">Fast (under 48h)</option>
        <option value="standard">Standard (1–5 days)</option>
      </select>
    </label>
    <label class="compare-filter">
      <span>Market</span>
      <select id="filter-market" data-compare-filter>
        <option value="all">All regions</option>
        <option value="uk">UK</option>
        <option value="eu">Europe</option>
        <option value="nordics">Nordics</option>
        <option value="international">International</option>
      </select>
    </label>
    <label class="compare-filter compare-filter--check">
      <input type="checkbox" id="filter-crypto" data-compare-filter value="yes">
      <span>Crypto-friendly</span>
    </label>
    <label class="compare-filter compare-filter--check">
      <input type="checkbox" id="filter-live" data-compare-filter value="yes">
      <span>Live dealer</span>
    </label>
    <button type="button" class="btn btn-outline btn-sm" id="filter-reset">Reset</button>
  </div>
  <p class="compare-filters__meta" id="compare-filter-count" aria-live="polite"></p>
</div>`;
}

export function compareTable(operators, opts = {}) {
  const showFilters = opts.filters !== false;
  const rows = operators
    .map(
      (op) => `<tr class="compare-row" ${rowAttrs(op)}>
  <td><div class="operator-cell"><img src="/${op.logo.replace(/^\//, "")}" alt="${op.name}" width="48" height="32"><span><a href="/reviews/${op.slug}/">${op.name}</a></span></div></td>
  <td>${op.bestFor}</td>
  <td>${op.welcomeBonus}${op.defaultWagering ? `<br><small class="muted">${op.defaultWagering}× wagering typical</small>` : ""}</td>
  <td>${op.highlights}</td>
  <td>${op.payout}<br><small class="muted">${licenceLabel(op)}</small></td>
  <td><a href="${op.cta}" class="btn btn-lime" target="_blank" rel="nofollow sponsored noopener">Visit Site</a></td>
</tr>`
    )
    .join("\n");

  return `${showFilters ? compareFilters() : ""}
<div class="table-wrap">
<table class="compare-table" id="casino-compare-table">
  <thead>
    <tr>
      <th>Site</th>
      <th>Best For</th>
      <th>Welcome Bonus</th>
      <th>Highlights</th>
      <th>Payout &amp; Licence</th>
      <th></th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
</div>`;
}
