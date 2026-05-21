import fs from "fs/promises";
import path from "path";
import { ROOT } from "./env.mjs";
import { buildHead } from "./meta.mjs";
import { buildSchemaGraph } from "./schema.mjs";
import { LOGO_SVG } from "./brand.mjs";
import { blogPostHref, htmlFileToDirIndex } from "./paths.mjs";

const NAV = [
  { href: "/online-casinos/", label: "Online Casinos", id: "online-casinos" },
  { href: "/bonuses/", label: "Casino Bonuses", id: "bonuses" },
  { href: "/games/", label: "Casino Games", id: "games" },
  { href: "/banking/", label: "Banking", id: "banking" },
  { href: "/reviews/", label: "Reviews", id: "reviews" },
  { href: "/us-casinos/", label: "US Casinos", id: "us-casinos" },
  { href: "/casinos-by-country/", label: "By Country", id: "casinos-by-country" },
  { href: "/blog/", label: "Casino Blog", id: "blog" },
  { href: "/sports-betting/", label: "Sports Betting", id: "sports-betting" },
];

function navActive(activePath, item) {
  if (!activePath) return "";
  const a = activePath.replace(/^\//, "").replace(/\/$/, "");
  const b = item.id || item.href.replace(/^\//, "").replace(/\/$/, "");
  return a === b || a.startsWith(`${b}/`) ? "active" : "";
}

export function header(activePath = "") {
  const navLinks = NAV.map(
    (n) =>
      `<a href="${n.href}" class="${navActive(activePath, n)}">${n.label}</a>`
  ).join("\n          ");

  return `<header class="site-header">
  <div class="container header-inner">
    <a href="/" class="logo">
      ${LOGO_SVG}
      <span class="logo-text">Casino of the World</span>
    </a>
    <button class="menu-toggle" aria-label="Menu" type="button">☰</button>
    <nav class="nav-main" id="nav-main">
      ${navLinks}
    </nav>
    <a href="/blog/" class="header-cta">Casino Blog</a>
    <button class="search-btn" type="button" aria-label="Search">🔍</button>
  </div>
</header>`;
}

export function footer() {
  return `<footer class="site-footer">
  <div class="container">
    <div class="rg-notice">
      <strong>18+ | Play Responsibly.</strong> Gambling involves risk. If you or someone you know has a gambling problem, call <strong>1-800-GAMBLER</strong> or visit <a href="https://www.ncpgambling.org/" target="_blank" rel="noopener">NCPG</a>.
    </div>
    <div class="footer-grid">
      <div>
        <h4>Casinos</h4>
        <ul>
          <li><a href="/online-casinos/">Online Casinos</a></li>
          <li><a href="/us-casinos/">US Casinos</a></li>
          <li><a href="/bonuses/">Casino Bonuses</a></li>
        </ul>
      </div>
      <div>
        <h4>Sports</h4>
        <ul>
          <li><a href="/sports-betting/">Sports Betting</a></li>
          <li><a href="/games/">Casino Games</a></li>
        </ul>
      </div>
      <div>
        <h4>Resources</h4>
        <ul>
          <li><a href="/blog/">Blog</a></li>
          <li><a href="/contact/">Contact</a></li>
          <li><a href="/about/">About Us</a></li>
        </ul>
      </div>
      <div>
        <h4>Legal</h4>
        <ul>
          <li><a href="/affiliate-disclosure/">Affiliate Disclosure</a></li>
          <li><a href="/privacy/">Privacy Policy</a></li>
          <li><a href="/terms/">Terms of Use</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      © ${new Date().getFullYear()} Casino of the World. All rights reserved. T&amp;Cs apply to all offers.
    </div>
  </div>
</footer>`;
}

export function modal() {
  return `<div class="modal-overlay" id="lead-modal" aria-hidden="true">
  <div class="modal" role="dialog" aria-labelledby="modal-title">
    <button class="modal-close" type="button" data-close-modal aria-label="Close">×</button>
    <div class="modal-art">
      <img src="/assets/images/hero/modal-megaphone.png" alt="" width="200" onerror="this.parentElement.style.display='none'">
    </div>
    <div>
      <h2 id="modal-title">Claim 250 Free Spins Today!</h2>
      <p>Get smart casino tips, bankroll strategies, and exclusive bonus alerts.</p>
      <form id="lead-form" data-demo-form>
        <div class="form-row">
          <div>
            <label for="lead-fname">First Name</label>
            <input type="text" id="lead-fname" name="fname" required>
          </div>
          <div>
            <label for="lead-email">Email</label>
            <input type="email" id="lead-email" name="email" required>
          </div>
        </div>
        <label class="modal-check">
          <input type="checkbox" required>
          <span>I read and agree to <a href="/terms/">Terms &amp; Conditions</a>.</span>
        </label>
        <button type="submit" class="btn btn-lime" style="width:100%">Unlock My Free Spins</button>
      </form>
    </div>
  </div>
</div>
<div class="toast" id="toast" role="status"></div>`;
}

export function cookieConsent() {
  return `<div class="cookie-consent" id="cookie-consent" role="dialog" aria-label="Cookie consent" aria-live="polite">
  <div class="cookie-consent__inner container">
    <p class="cookie-consent__text">We use cookies to improve your experience and analyze site traffic. By clicking Accept, you agree to our use of cookies. Read our <a href="/privacy/">Privacy Policy</a>.</p>
    <button type="button" class="btn btn-lime cookie-consent__accept" data-cookie-accept>Accept</button>
  </div>
</div>`;
}

export function pageShell({
  title,
  description,
  activePath,
  depth = 0,
  body,
  canonicalPath,
  ogImage = "assets/images/brand/logo.png",
  ogType = "website",
  keywords = "",
  published = "",
  author = "Casino of the World",
  breadcrumbs = null,
  includeWebSite = false,
}) {
  const pathKey = canonicalPath || activePath || "/";
  const canonical = pathKey.startsWith("/") ? pathKey : `/${pathKey.replace(/^\//, "")}`;
  const pageType = ogType === "article" ? "article" : "webpage";
  const structuredData = buildSchemaGraph({
    pageType,
    title,
    description,
    canonicalPath: canonical,
    ogImage,
    published,
    author,
    breadcrumbs,
    includeWebSite: includeWebSite || canonical === "/",
  });

  const head = buildHead({
    title,
    description,
    canonicalPath: canonical,
    ogImage,
    type: ogType,
    keywords,
    published,
    author,
    structuredData,
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
${head}
</head>
<body>
${header(activePath)}
${body}
${footer()}
${modal()}
${cookieConsent()}
<script src="/js/main.js"></script>
</body>
</html>`;
}

export async function writePage(relativePath, html) {
  const target = htmlFileToDirIndex(relativePath);
  const full = path.join(ROOT, target);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, html);
}

export function disclosure() {
  return `<aside class="disclosure">
  <strong>Affiliate Disclosure:</strong> Some links on Casino of the World are affiliate links. If you sign up or deposit through them, we may earn a commission at no extra cost to you. We only recommend operators we have reviewed. <a href="/affiliate-disclosure/">Learn more</a>.
</aside>`;
}

export function compareTable(operators) {
  const rows = operators
    .map(
      (op) => `<tr>
  <td><div class="operator-cell"><img src="/${op.logo.replace(/^\//, "")}" alt="${op.name}" width="48" height="32"><span>${op.name}</span></div></td>
  <td>${op.bestFor}</td>
  <td>${op.welcomeBonus}</td>
  <td>${op.highlights}</td>
  <td>${op.payout}</td>
  <td><a href="${op.cta}" class="btn btn-lime" target="_blank" rel="nofollow sponsored noopener">Visit Site</a></td>
</tr>`
    )
    .join("\n");

  return `<div class="table-wrap">
<table class="compare-table">
  <thead>
    <tr>
      <th>Site</th>
      <th>Best For</th>
      <th>Welcome Bonus</th>
      <th>Highlights</th>
      <th>Fastest Payout</th>
      <th></th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
</div>`;
}

export function blogSidebar(posts) {
  const items = posts
    .slice(0, 5)
    .map(
      (p) => `<article class="blog-mini">
  <img src="/${p.image.replace(/^\//, "")}" alt="">
  <div>
    <h3><a href="${blogPostHref(p.slug)}">${p.title}</a></h3>
    <p class="blog-meta"><a href="/about/">${p.author}</a> · ${p.dateLabel}</p>
  </div>
</article>`
    )
    .join("\n");

  return `<aside class="sidebar">
  <h2>Latest From Our Blog</h2>
  ${items}
</aside>`;
}
