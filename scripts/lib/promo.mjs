/** Lead modal + in-page quick tools (no floating sidebars) */

export function modal() {
  return `<div class="modal-overlay" id="lead-modal" aria-hidden="true">
  <div class="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
    <button class="modal-close" type="button" data-close-modal aria-label="Close">×</button>
    <div class="modal-art" aria-hidden="true">
      <img src="/assets/images/hero/modal-promo.svg" alt="" width="200" height="200" class="modal-art__img" loading="lazy">
    </div>
    <div class="modal-body">
      <p class="modal-eyebrow">Free insider updates</p>
      <h2 id="modal-title">EU Casino Picks &amp; Bonus Alerts</h2>
      <p class="modal-lead">Licensed casino comparisons, wagering tips, and payout news for UK &amp; EU players—no US sportsbook spam.</p>
      <form id="lead-form" data-demo-form>
        <div class="form-row">
          <div>
            <label for="lead-fname">First name</label>
            <input type="text" id="lead-fname" name="fname" required autocomplete="given-name">
          </div>
          <div>
            <label for="lead-email">Email</label>
            <input type="email" id="lead-email" name="email" required autocomplete="email">
          </div>
        </div>
        <label class="modal-check">
          <input type="checkbox" required>
          <span>I agree to the <a href="/terms/">Terms</a> and <a href="/privacy/">Privacy Policy</a>.</span>
        </label>
        <button type="submit" class="btn btn-lime modal-submit">Get Free Updates</button>
        <button type="button" class="modal-dismiss" data-dismiss-modal>Not now</button>
      </form>
    </div>
  </div>
</div>
<div class="toast" id="toast" role="status"></div>`;
}

/** Shared tool links (compare, calculator, reviews, bonuses) */
export function quickToolsLinks() {
  return `<div class="quick-tools__links">
    <a href="/online-casinos/" class="quick-tools__chip quick-tools__chip--lime">Compare casinos</a>
    <a href="/#wagering-calculator" class="quick-tools__chip">Wagering calculator</a>
    <a href="/reviews/" class="quick-tools__chip">All reviews</a>
    <a href="/bonuses/" class="quick-tools__chip">Bonus hub</a>
  </div>`;
}

/** Slim strip below header on inner pages */
export function quickToolsStrip() {
  return `<nav class="quick-tools" aria-label="Quick tools">
  <div class="container quick-tools__inner">
    <span class="quick-tools__label">Quick tools</span>
    ${quickToolsLinks()}
  </div>
</nav>`;
}

/** Merged into homepage filter bar (topics + tools, one row) */
export function filterBarWithTools(topicLinksHtml) {
  return `<div class="filter-bar filter-bar--with-tools">
  <div class="container filter-inner filter-inner--split">
    <div class="filter-bar__topics">
      <span>Find the best:</span>
      <div class="filter-options">
        ${topicLinksHtml}
      </div>
    </div>
    <div class="quick-tools quick-tools--merged" aria-label="Quick tools">
      <span class="quick-tools__label">Tools</span>
      ${quickToolsLinks()}
    </div>
  </div>
</div>`;
}
