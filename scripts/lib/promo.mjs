/** Lead modal + right-side promo widget (site palette: navy, lime, gold) */

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

export function sideRails() {
  return `<aside class="side-rail side-rail--right" id="side-rail-right" aria-label="Quick actions">
  <button type="button" class="side-rail__close" data-dismiss-rail aria-label="Dismiss">×</button>
  <span class="side-rail__pulse" aria-hidden="true"></span>
  <p class="side-rail__tag">Casino of the World</p>
  <h3 class="side-rail__title">Tools &amp; top picks</h3>
  <div class="side-rail__actions">
    <a href="/online-casinos/" class="btn btn-lime side-rail__cta">Compare casinos</a>
    <a href="/#wagering-calculator" class="btn btn-outline side-rail__cta side-rail__cta--light">Wagering calculator</a>
    <a href="/reviews/" class="side-rail__link">All reviews →</a>
    <a href="/bonuses/" class="side-rail__link">Bonus hub →</a>
  </div>
</aside>`;
}
