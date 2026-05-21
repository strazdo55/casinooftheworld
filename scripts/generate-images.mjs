import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import { generateImage } from "./lib/gemini.mjs";

const IMAGES = [
  {
    out: "assets/images/brand/logo.png",
    prompt:
      "Professional flat vector logo icon ONLY on fully transparent background (alpha channel): golden casino chip ring encircling a minimal white globe, small lime green #d4ff00 accent dot, NO text, NO shadows, NO background fill, NO checkerboard, crisp edges, 512x512 PNG",
  },
  {
    out: "assets/images/brand/favicon.png",
    prompt:
      "Simple favicon icon on fully transparent background: golden chip + globe + lime dot, no text, 128x128 PNG, flat vector style",
  },
  {
    out: "assets/images/hero/home-hero.webp",
    prompt:
      "Cinematic wide hero background for casino affiliate site: moody bokeh lights, floating 3D poker chips, dark navy atmosphere, person silhouette with glasses looking at screen (blurred), professional photography style, no text, 16:9",
  },
  {
    out: "assets/images/hero/modal-megaphone.png",
    prompt:
      "Playful illustration: megaphone with halftone texture, white border, yellow poker chips floating, light blue burst shape behind, flat marketing graphic on transparent background",
  },
];

const STYLE_PREFIX =
  "Modern editorial line-art illustration, thin precise contour lines, minimal flat color fills, stylized geometric shapes, elegant negative space, contemporary European magazine style, muted cream and deep navy palette with small gold accents, NO Japanese motifs, NO geisha, NO kimono, NO cherry blossoms, NO anime, NO photorealism, NO 3D render, NO readable text, NO logos, 16:9 widescreen blog hero.";

const SLUG_SCENES = {
  "best-new-online-slots-2026":
    "ornate slot machine with flowing reel symbols and gold coins, art-deco curves",
  "best-live-dealer-casinos-2026":
    "live blackjack table from above, dealer hands and chips drawn with delicate linework",
  "us-igaming-expansion-2026":
    "stylized map of Europe with casino chip and scales of justice, thin border frame",
  "twenty-dollar-casino-method":
    "small stack of chips and playing cards on clean table surface, disciplined minimal scene",
  "fastest-payout-online-casinos":
    "stopwatch and wallet with coins trailing like wind lines, sense of swift motion",
  "live-dealer-vs-rng-slots":
    "split panel: human dealer silhouette left, geometric digital slot right, balanced composition",
  "online-casino-kyc-verification-guide":
    "document scroll, ID card outline, and magnifying glass with thin lines",
  "no-deposit-bonus-codes-2026":
    "gift ribbon around casino chip, spark line accents, festive but minimal",
  "bitcoin-casino-withdrawals-guide":
    "abstract coin orbit around smartphone outline, crypto flow lines",
  "new-york-online-casino-legalization-2026":
    "UK landmark silhouette with licence seal and chip, regulatory mood",
  "ontario-igaming-regulated-sites-2026":
    "maple leaf motif with regulated stamp and mobile phone outline",
  "slot-rtp-volatility-explained":
    "probability curve line graph merged with slot reel symbols",
  "blackjack-basic-strategy-online":
    "player hands and dealer card, strategy chart grid faint in background lines",
  "roulette-variants-online-casino":
    "European single-zero wheel vs double-zero wheels, comparative linework",
  "casino-responsible-gambling-tools":
    "shield icon with hourglass and limit slider, calm protective tone",
  "paypal-online-casinos-us":
    "wallet and payment arrows connecting to chip stack, European city hint",
  "mobile-casino-apps-vs-browser":
    "two phones side by side, one app icon grid one browser window, thin UI lines",
  "casino-loyalty-vip-programs":
    "tiered podium with stars and chip crown, loyalty ladder metaphor",
  "megaways-slots-how-they-work":
    "cascading reel grid with many small symbols, dynamic vertical lines",
  "crash-games-online-casinos":
    "rising multiplier curve with rocket-chip hybrid icon, tension in line weight",
  "pennsylvania-online-slots-2026":
    "Brandenburg gate hint with slot reels, German market editorial",
  "michigan-online-casino-market-2026":
    "windmill silhouette with tulips and casino chip, Dutch market tone",
  "new-jersey-online-casino-bonuses":
    "Maltese cross subtle shape with bonus chip stacks, Mediterranean hint",
  "wagering-requirements-explained":
    "calculator and checklist scroll with chip, educational diagram style",
  "provably-fair-crypto-casino-games":
    "seed hash strings as decorative lines around dice and chip",
  "ai-live-dealer-casino-future":
    "human dealer silhouette merging with circuit-line halo, futuristic but hand-drawn",
};

const OPERATOR_SCENES = {
  leovegas: "lion-inspired sun motif abstract, mobile phone and roulette wheel line art",
  "888casino": "infinity loop shape with cards and chips, classic casino elegance",
  betway: "stylised stadium arch with cards, international sport-casino crossover lines",
  casumo: "playful adventure path with casino chip milestones, gamified minimal lines",
  mrgreen: "green felt curve and top hat silhouette, premium table mood",
  betsson: "Nordic minimal waves with poker chips, clean Scandinavian line weight",
  "22bet": "globe meridian lines with crypto coin and chip, international reach",
};

function blogImagePrompt(post) {
  const scene =
    SLUG_SCENES[post.slug] ||
    `topic "${post.title}" — ${post.category} mood, chips and cards as focal motif`;
  return [
    STYLE_PREFIX,
    `Unique scene for this article only: ${scene}.`,
    `Article context: ${post.excerpt}`,
  ].join(" ");
}

async function loadBlogPosts() {
  const raw = await fs.readFile(path.join(ROOT, "data/blog.json"), "utf8");
  return JSON.parse(raw);
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseArgs() {
  const argv = process.argv.slice(2);
  return {
    force: argv.includes("--force"),
    blogOnly: argv.includes("--blog-only"),
    slug: argv.find((a) => a.startsWith("--slug="))?.split("=")[1],
  };
}

async function main() {
  const { force, blogOnly, slug } = parseArgs();
  const skipExisting = !force;

  if (!blogOnly) {
    for (const item of IMAGES) {
      const outPath = path.join(ROOT, item.out);
      if (skipExisting && (await exists(outPath))) {
        console.log("Skip (exists):", item.out);
        continue;
      }
      console.log("Generating:", item.out);
      try {
        await generateImage(item.prompt, outPath);
        console.log("OK:", item.out);
      } catch (e) {
        console.warn("Failed:", item.out, e.message);
      }
    }
  }

  let posts = await loadBlogPosts();
  if (slug) {
    posts = posts.filter((p) => p.slug === slug);
    if (!posts.length) {
      throw new Error(`No blog post with slug: ${slug}`);
    }
  }

  console.log(`Blog images: ${posts.length} post(s), force=${force}`);

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const rel = post.image || `assets/images/blog/${post.slug}.png`;
    const outPath = path.join(ROOT, rel);

    if (skipExisting && (await exists(outPath))) {
      console.log(`Skip (${i + 1}/${posts.length}):`, post.slug);
      continue;
    }

    const prompt = blogImagePrompt(post);
    console.log(`Generating (${i + 1}/${posts.length}):`, post.slug);
    try {
      const saved = await generateImage(prompt, outPath);
      console.log("OK:", saved);
    } catch (e) {
      console.warn("Failed:", post.slug, e.message);
    }

    if (i < posts.length - 1) {
      await sleep(1500);
    }
  }

  console.log("Image generation complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
