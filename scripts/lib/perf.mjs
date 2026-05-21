/** Performance snippets for <head> and scripts */

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap";

export function fontLinks() {
  return `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="${FONT_URL}" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="${FONT_URL}"></noscript>`;
}

export function cssLink(href = "/css/main.css") {
  return `  <link rel="preload" href="${href}" as="style">
  <link rel="stylesheet" href="${href}">`;
}

/**
 * @param {object} [opts]
 * @param {boolean} [opts.preloadHero]
 */
export function resourceHints(opts = {}) {
  let hints = "";
  if (opts.preloadHero) {
    hints += `
  <link rel="preload" href="/assets/images/hero/home-hero.webp" as="image" type="image/webp" fetchpriority="high">`;
  }
  return hints;
}

export function deferredScript(src = "/js/main.js") {
  return `<script src="${src}" defer></script>`;
}
