/** Lead modal + side rail CTAs (site palette: navy, lime, gold) */

export const MODAL_ART_SVG = `<svg class="modal-art__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" aria-hidden="true">
  <defs>
    <linearGradient id="modal-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
    <linearGradient id="modal-lime" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0ff80"/>
      <stop offset="100%" stop-color="#c8f000"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="16" fill="#152238"/>
  <circle cx="100" cy="100" r="72" fill="none" stroke="url(#modal-gold)" stroke-width="3"/>
  <circle cx="100" cy="100" r="52" fill="none" stroke="#f8fafc" stroke-width="1.5" opacity="0.5"/>
  <path d="M55 100 Q100 55 145 100" fill="none" stroke="#f8fafc" stroke-width="1.2" opacity="0.45"/>
  <path d="M55 100 Q100 145 145 100" fill="none" stroke="#f8fafc" stroke-width="1.2" opacity="0.45"/>
  <rect x="62" y="72" width="76" height="56" rx="8" fill="none" stroke="url(#modal-lime)" stroke-width="2.5"/>
  <text x="100" y="98" text-anchor="middle" fill="url(#modal-lime)" font-family="Outfit,system-ui,sans-serif" font-size="22" font-weight="800">777</text>
  <circle cx="148" cy="52" r="14" fill="url(#modal-lime)" opacity="0.95"/>
  <text x="148" y="57" text-anchor="middle" fill="#0b1219" font-family="Outfit,system-ui,sans-serif" font-size="11" font-weight="800">FS</text>
  <path d="M40 140 L52 128 M160 140 L148 128" stroke="url(#modal-gold)" stroke-width="2" stroke-linecap="round"/>
</svg>`;

export function modal() {
  return `<div class="modal-overlay" id="lead-modal" aria-hidden="true">
  <div class="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
    <button class="modal-close" type="button" data-close-modal aria-label="Close">×</button>
    <div class="modal-art" aria-hidden="true">
      ${MODAL_ART_SVG}
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
  return `<aside class="side-rail side-rail--left" id="side-rail-left" aria-label="Quick links">
  <button type="button" class="side-rail__close" data-dismiss-rail aria-label="Dismiss">×</button>
  <span class="side-rail__pulse" aria-hidden="true"></span>
  <p class="side-rail__tag">Editor's choice</p>
  <h3 class="side-rail__title">Compare 15 licensed casinos</h3>
  <p class="side-rail__text">UKGC, MGA &amp; international brands—filters for payout speed &amp; crypto.</p>
  <a href="/online-casinos/" class="btn btn-lime side-rail__cta">Compare casinos</a>
  <a href="/reviews/" class="side-rail__link">Read reviews →</a>
</aside>
<aside class="side-rail side-rail--right" id="side-rail-right" aria-label="Tools">
  <button type="button" class="side-rail__close" data-dismiss-rail aria-label="Dismiss">×</button>
  <span class="side-rail__pulse side-rail__pulse--gold" aria-hidden="true"></span>
  <p class="side-rail__tag">Free tool</p>
  <h3 class="side-rail__title">Bonus wagering calculator</h3>
  <p class="side-rail__text">See how much playthrough a welcome offer really requires.</p>
  <a href="/#wagering-calculator" class="btn btn-outline side-rail__cta side-rail__cta--light">Calculate playthrough</a>
  <a href="/bonuses/" class="side-rail__link">All bonuses →</a>
</aside>`;
}
