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

const BLOG_IMAGES = [
  {
    slug: "best-new-online-slots-2026",
    prompt:
      "Vibrant online slot machine reels with gems and gold coins, casino bokeh lights, modern 3D style, no readable text, 16:9",
  },
  {
    slug: "best-live-dealer-casinos-2026",
    prompt:
      "Live dealer casino studio: blackjack table with professional dealer silhouette, chips, elegant lighting, 16:9",
  },
  {
    slug: "us-igaming-expansion-2026",
    prompt:
      "Editorial illustration: US map with casino chips and legal gavel, modern infographic style, blue and gold, 16:9",
  },
  {
    slug: "twenty-dollar-casino-method",
    prompt:
      "Casino table with twenty dollar bill, poker chips, playing cards ace and king, bokeh lights, editorial photo style, 16:9",
  },
  {
    slug: "fastest-payout-online-casinos",
    prompt:
      "Digital wallet and stopwatch with casino chips, fast payment concept, clean modern 3D render, 16:9",
  },
  {
    slug: "live-dealer-vs-rng-slots",
    prompt:
      "Split concept: live dealer studio on left, digital slot machine on right, modern comparison graphic, 16:9",
  },
];

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const skip = process.argv.includes("--force") ? false : true;

  for (const item of IMAGES) {
    const outPath = path.join(ROOT, item.out);
    if (skip && (await exists(outPath))) {
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

  for (const item of BLOG_IMAGES) {
    const outPath = path.join(ROOT, `assets/images/blog/${item.slug}.webp`);
    if (skip && (await exists(outPath))) {
      console.log("Skip (exists):", item.slug);
      continue;
    }
    console.log("Generating blog:", item.slug);
    try {
      await generateImage(item.prompt, outPath);
    } catch (e) {
      console.warn("Failed blog image:", item.slug, e.message);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
