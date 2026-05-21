export function wageringCalculatorBlock(opts = {}) {
  const anchor = opts.id ? ` id="${opts.id}"` : "";
  return `<section class="content-section wagering-calc"${anchor} aria-labelledby="wagering-calc-heading">
  <h2 id="wagering-calc-heading" class="section-title">Bonus Wagering Calculator</h2>
  <p class="lead" style="margin-top:0">Estimate how much you must bet before bonus winnings become withdrawable. Figures are illustrative—always confirm playthrough rules on the operator site.</p>
  <form class="wagering-calc__form" id="wagering-calc-form" novalidate>
    <div class="wagering-calc__grid">
      <label>
        <span>Bonus amount (€)</span>
        <input type="number" id="wc-bonus" name="bonus" min="0" step="1" value="100" required>
      </label>
      <label>
        <span>Deposit matched (€)</span>
        <input type="number" id="wc-deposit" name="deposit" min="0" step="1" value="100">
      </label>
      <label>
        <span>Wagering multiplier (e.g. 35)</span>
        <input type="number" id="wc-multiplier" name="multiplier" min="1" max="200" step="1" value="35" required>
      </label>
      <label>
        <span>Playthrough applies to</span>
        <select id="wc-base" name="base">
          <option value="bonus">Bonus only</option>
          <option value="both">Deposit + bonus</option>
        </select>
      </label>
      <label>
        <span>Average bet per round (€)</span>
        <input type="number" id="wc-bet" name="bet" min="0.1" step="0.1" value="1">
      </label>
      <label>
        <span>Slot contribution (%)</span>
        <input type="number" id="wc-contribution" name="contribution" min="1" max="100" value="100">
      </label>
    </div>
    <button type="submit" class="btn btn-lime">Calculate playthrough</button>
  </form>
  <div class="wagering-calc__results" id="wagering-calc-results" hidden>
    <div class="wagering-calc__stat">
      <span class="wagering-calc__label">Total wagering required</span>
      <strong class="wagering-calc__value" id="wc-result-total">—</strong>
    </div>
    <div class="wagering-calc__stat">
      <span class="wagering-calc__label">Effective slot wagering</span>
      <strong class="wagering-calc__value" id="wc-result-effective">—</strong>
    </div>
    <div class="wagering-calc__stat">
      <span class="wagering-calc__label">Estimated rounds at your bet size</span>
      <strong class="wagering-calc__value" id="wc-result-rounds">—</strong>
    </div>
    <p class="wagering-calc__note" id="wc-result-note"></p>
  </div>
  <p class="muted" style="margin-top:1rem;font-size:0.88rem">Tip: Live dealer and table games often count 0–10% toward wagering. Read our <a href="/blog/wagering-requirements-explained/">wagering requirements guide</a>.</p>
</section>`;
}
