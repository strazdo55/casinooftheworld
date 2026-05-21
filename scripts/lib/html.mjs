import fs from "fs/promises";
import path from "path";
import { ROOT } from "./env.mjs";
import { buildHead } from "./meta.mjs";
import { LOGO_SVG } from "./brand.mjs";

const NAV = [
  { href: "online-casinos.html", label: "Online Casinos" },
  { href: "bonuses.html", label: "Casino Bonuses" },
  { href: "games.html", label: "Casino Games" },
  { href: "banking.html", label: "Banking" },
  { href: "reviews/index.html", label: "Reviews" },
  { href: "us-casinos.html", label: "US Casinos" },
  { href: "casinos-by-country.html", label: "By Country" },
  { href: "blog/index.html", label: "Casino Blog" },
  { href: "sports-betting.html", label: "Sports Betting" },
];

export function header(activePath = "") {
  const navLinks = NAV.map(
    (n) =>
      `<a href="${n.href}" class="${activePath === n.href ? "active" : ""}">${n.label}</a>`
  ).join("\n          ");

  return `<header class="site-header">
  <div class="container header-inner">
    <a href="index.html" class="logo">
      ${LOGO_SVG}
      <span class="logo-text">Casino of the World</span>
    </a>
    <button class="menu-toggle" aria-label="Menu" type="button">☰</button>
    <nav class="nav-main" id="nav-main">
      ${navLinks}
    </nav>
    <a href="blog/index.html" class="header-cta">Casino Blog</a>
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
          <li><a href="online-casinos.html">Online Casinos</a></li>
          <li><a href="us-casinos.html">US Casinos</a></li>
          <li><a href="bonuses.html">Casino Bonuses</a></li>
        </ul>
      </div>
      <div>
        <h4>Sports</h4>
        <ul>
          <li><a href="sports-betting.html">Sports Betting</a></li>
          <li><a href="games.html">Casino Games</a></li>
        </ul>
      </div>
      <div>
        <h4>Resources</h4>
        <ul>
          <li><a href="blog/index.html">Blog</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="about.html">About Us</a></li>
        </ul>
      </div>
      <div>
        <h4>Legal</h4>
        <ul>
          <li><a href="affiliate-disclosure.html">Affiliate Disclosure</a></li>
          <li><a href="privacy.html">Privacy Policy</a></li>
          <li><a href="terms.html">Terms of Use</a></li>
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
      <img src="assets/images/hero/modal-megaphone.png" alt="" width="200" onerror="this.parentElement.style.display='none'">
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
          <span>I read and agree to <a href="terms.html">Terms &amp; Conditions</a>.</span>
        </label>
        <button type="submit" class="btn btn-lime" style="width:100%">Unlock My Free Spins</button>
      </form>
    </div>
  </div>
</div>
<div class="toast" id="toast" role="status"></div>`;
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
}) {
  const prefix = depth > 0 ? "../".repeat(depth) : "";
  const adjust = (html) =>
    html
      .replace(/href="(?!https|#|mailto)([^"]+)"/g, (_, p) => {
        if (p.startsWith("assets/")) return `href="${prefix}${p}"`;
        if (!p.includes("/") || p.endsWith(".html"))
          return `href="${prefix}${p}"`;
        return `href="${prefix}${p}"`;
      })
      .replace(/src="assets\//g, `src="${prefix}assets/`);

  const h = adjust(header(activePath ? prefix + activePath : ""));
  const f = adjust(footer());
  const m = adjust(modal());

  const pathKey = canonicalPath || (depth ? activePath : activePath || "index.html");
  const head = buildHead({
    title,
    description,
    canonicalPath: pathKey.startsWith("/") ? pathKey : `/${pathKey.replace(/^\//, "")}`,
    depth,
    ogImage,
    type: ogType,
    keywords,
    published,
    author,
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
${head}
</head>
<body>
${h}
${body}
${f}
${m}
<script src="${prefix}js/main.js"></script>
</body>
</html>`;
}

export async function writePage(relativePath, html) {
  const full = path.join(ROOT, relativePath);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, html);
}

export function disclosure() {
  return `<aside class="disclosure">
  <strong>Affiliate Disclosure:</strong> Some links on Casino of the World are affiliate links. If you sign up or deposit through them, we may earn a commission at no extra cost to you. We only recommend operators we have reviewed. <a href="affiliate-disclosure.html">Learn more</a>.
</aside>`;
}

export function compareTable(operators, depth = 0) {
  const prefix = depth > 0 ? "../".repeat(depth) : "";
  const rows = operators
    .map(
      (op) => `<tr>
  <td><div class="operator-cell"><img src="${prefix}${op.logo}" alt="${op.name}" width="48" height="32"><span>${op.name}</span></div></td>
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

export function blogSidebar(posts, depth = 0) {
  const prefix = depth > 0 ? "../".repeat(depth) : "";
  const items = posts
    .slice(0, 5)
    .map(
      (p) => `<article class="blog-mini">
  <img src="${prefix}${p.image}" alt="">
  <div>
    <h3><a href="${prefix}blog/${p.slug}.html">${p.title}</a></h3>
    <p class="blog-meta"><a href="#">${p.author}</a> · ${p.dateLabel}</p>
  </div>
</article>`
    )
    .join("\n");

  return `<aside class="sidebar">
  <h2>Latest From Our Blog</h2>
  ${items}
</aside>`;
}
