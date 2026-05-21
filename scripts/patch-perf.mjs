import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import { fontLinks, cssLink, resourceHints, deferredScript } from "./lib/perf.mjs";
import { picture, cardPicture } from "./lib/images.mjs";

const FONT_BLOCK_OLD =
  /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\s*<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Outfit[^"]*" rel="stylesheet">/;

const CSS_BLOCK_OLD =
  /<link rel="preload" href="\/css\/main\.css" as="style">\s*<link rel="stylesheet" href="\/css\/main\.css">|<link rel="stylesheet" href="\/css\/main\.css">/;

function upgradeBlogImg(html) {
  return html.replace(
    /<img([^>]*)\ssrc="(\/assets\/images\/blog\/[^"]+\.png)"([^>]*)>/gi,
    (match, before, src, after) => {
      if (match.includes("<picture")) return match;
      const altM = match.match(/alt="([^"]*)"/);
      const alt = altM?.[1] || "";
      const classM = match.match(/class="([^"]*)"/);
      const cls = classM?.[1] || "";
      const isFeatured = cls.includes("article-featured");
      const isEager = /loading="eager"|fetchpriority="high"/.test(match);
      if (isFeatured || isEager) {
        return picture({
          src: src.slice(1),
          alt,
          width: 1200,
          height: 675,
          loading: "eager",
          fetchpriority: "high",
          className: cls || "article-featured",
          sizes: "(max-width: 900px) 100vw, 900px",
        });
      }
      if (before.includes("post-card") || after.includes("post-card") || match.includes('alt=""')) {
        return cardPicture(src.slice(1), alt || "Blog post");
      }
      return cardPicture(src.slice(1), alt || "Blog post");
    }
  );
}

function patchHead(html, { preloadHero = false } = {}) {
  let out = html;
  out = out.replace(FONT_BLOCK_OLD, fontLinks());
  if (!out.includes('rel="preload" as="style"')) {
    out = out.replace(CSS_BLOCK_OLD, cssLink("/css/main.min.css"));
  } else {
    out = out.replace(/href="\/css\/main\.css"/g, 'href="/css/main.min.css"');
  }
  if (preloadHero && !out.includes("home-hero.webp")) {
    out = out.replace(
      /<link rel="stylesheet" href="\/css\/main\.min\.css">/,
      `${cssLink("/css/main.min.css")}${resourceHints({ preloadHero: true })}`
    );
  }
  out = out.replace(
    /<script src="\/js\/main\.js"><\/script>/,
    deferredScript()
  );
  out = out.replace(/<script src="\/js\/main\.js" defer><\/script>\s*<script src="\/js\/main\.js" defer><\/script>/, deferredScript());
  return out;
}

async function walk(dir, files = []) {
  for (const name of await fs.readdir(dir, { withFileTypes: true })) {
    if (name.name.startsWith(".") || name.name === "node_modules") continue;
    const full = path.join(dir, name.name);
    if (name.isDirectory()) await walk(full, files);
    else if (name.name.endsWith(".html")) files.push(full);
  }
  return files;
}

async function main() {
  let n = 0;
  for (const file of await walk(ROOT)) {
    let html = await fs.readFile(file, "utf8");
    if (!html.includes("site-footer")) continue;
    const isHome = file.endsWith(`${path.sep}index.html`) && !file.includes(`${path.sep}blog${path.sep}`);
    html = patchHead(html, { preloadHero: isHome });
    html = upgradeBlogImg(html);
    html = html.replace(
      /<img src="(\/assets\/images\/hero\/home-hero\.png)"([^>]*)>/g,
      cardPicture("assets/images/hero/home-hero.png", "Casino of the World", {
        loading: "lazy",
        fetchpriority: "",
      })
    );
    await fs.writeFile(file, html);
    n++;
  }
  console.log(`Performance patches applied to ${n} HTML page(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
