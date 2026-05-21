import fs from "fs/promises";
import path from "path";
import { ROOT } from "./env.mjs";
import { buildHead } from "./meta.mjs";
import { buildSchemaGraph } from "./schema.mjs";
import { LOGO_SVG } from "./brand.mjs";
import { blogPostHref, htmlFileToDirIndex } from "./paths.mjs";

const NAV = [
  { href: "/online-casinos/", label: "Casinos", id: "online-casinos", title: "Online Casinos" },
  { href: "/bonuses/", label: "Bonuses", id: "bonuses", title: "Casino Bonuses" },
  { href: "/games/", label: "Games", id: "games", title: "Casino Games" },
  { href: "/banking/", label: "Banking", id: "banking", title: "Banking & Payouts" },
  { href: "/reviews/", label: "Reviews", id: "reviews", title: "Casino Reviews" },
  { href: "/europe-casinos/", label: "Europe", id: "europe-casinos", title: "Europe & Asia Casinos" },
  { href: "/casinos-by-country/", label: "Countries", id: "casinos-by-country", title: "Casinos by Country" },
  { href: "/blog/", label: "Blog", id: "blog", title: "Casino Blog" },
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
      `<a href="${n.href}" class="${navActive(activePath, n)}" title="${n.title || n.label}">${n.label}</a>`
  ).join("\n");

  return `<header class="site-header">
  <div class="container header-inner">
    <a href="/" class="logo" title="Casino of the World — Home">
      ${LOGO_SVG}
      <span class="logo-text">Casino of the <span class="logo-accent">World</span></span>
    </a>
    <button class="menu-toggle" aria-label="Open menu" type="button" aria-expanded="false" aria-controls="nav-main">☰</button>
    <div class="nav-scroll-wrap">
      <nav class="nav-main" id="nav-main" aria-label="Main">
        ${navLinks}
      </nav>
    </div>
  </div>
</header>`;
}

export function footer() {
  return `<footer class="site-footer">
  <div class="container">
    <div class="rg-notice">
      <strong>18+ | Play Responsibly.</strong> Gambling involves risk. Help: <a href="https://www.begambleaware.org/" target="_blank" rel="noopener">BeGambleAware</a>, <a href="https://www.gamcare.org.uk/" target="_blank" rel="noopener">GamCare</a>, or your local support service.
    </div>
    <div class="footer-grid">
      <div>
        <h4>Casinos</h4>
        <ul>
          <li><a href="/online-casinos/">Online Casinos</a></li>
          <li><a href="/europe-casinos/">Europe &amp; Asia</a></li>
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
  return `<div class="cookie-consent" id="cookie-consent" aria-label="Cookie consent" aria-live="polite" hidden>
  <div class="cookie-consent__inner container">
    <p class="cookie-consent__text">We use cookies to improve your experience and analyze site traffic. By clicking Accept, you agree to our use of cookies. Read our <a href="/privacy/">Privacy Policy</a>.</p>
    <div class="cookie-consent__actions">
      <button type="button" class="btn btn-lime" id="cookie-accept-btn">Accept</button>
    </div>
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

export { compareTable } from "./compare-table.mjs";

export function guideCard(post, opts = {}) {
  const img = post.image?.replace(/^\//, "") || "assets/images/hero/home-hero.png";
  const excerpt =
    opts.truncate && post.excerpt?.length > 120
      ? `${post.excerpt.slice(0, 117)}…`
      : post.excerpt || "";
  return `<article class="guide-card">
  <a href="${blogPostHref(post.slug)}" class="guide-card__media">
    <img src="/${img}" alt="${post.title}" loading="lazy" width="400" height="225" onerror="this.src='/assets/images/hero/home-hero.png'">
  </a>
  <div class="guide-card__body">
    <span class="tag">${post.category}</span>
    <h3><a href="${blogPostHref(post.slug)}">${post.title}</a></h3>
    ${excerpt ? `<p class="guide-card__excerpt">${excerpt}</p>` : ""}
    <p class="blog-meta">${post.author} · ${post.dateLabel}</p>
    <a href="${blogPostHref(post.slug)}" class="btn btn-outline btn-sm">Read guide</a>
  </div>
</article>`;
}

export function guideCardGrid(posts, opts = {}) {
  const cards = posts.map((p) => guideCard(p, opts)).join("\n");
  return `<div class="guide-card-grid">${cards}</div>`;
}

export function uniquePosts(posts, limit = 4) {
  const seen = new Set();
  const out = [];
  for (const p of posts) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

export function blogSidebar(posts) {
  const items = uniquePosts(posts, 5)
    .map(
      (p) => `<article class="sidebar-guide">
  <a href="${blogPostHref(p.slug)}" class="sidebar-guide__media">
    <img src="/${p.image.replace(/^\//, "")}" alt="${p.title}" loading="lazy" onerror="this.src='/assets/images/hero/home-hero.png'">
  </a>
  <div class="sidebar-guide__body">
    <span class="tag">${p.category}</span>
    <h3><a href="${blogPostHref(p.slug)}">${p.title}</a></h3>
    <p class="blog-meta">${p.author} · ${p.dateLabel}</p>
  </div>
</article>`
    )
    .join("\n");

  return `<aside class="sidebar">
  <h2>Latest Guides</h2>
  <p class="sidebar-intro">Fresh slot reviews, licensing news, and payout comparisons.</p>
  ${items}
  <p><a href="/blog/" class="btn btn-outline btn-sm" style="width:100%;text-align:center">View all articles</a></p>
</aside>`;
}
