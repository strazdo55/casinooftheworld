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

/** Hand-tuned prompts override auto-generated ones for these slugs. */
const BLOG_PROMPT_OVERRIDES = {
  "best-new-online-slots-2026":
    "Vibrant online slot machine reels with gems and gold coins, casino bokeh lights, modern 3D style, no readable text, 16:9",
  "best-live-dealer-casinos-2026":
    "Live dealer casino studio: blackjack table with professional dealer silhouette, chips, elegant lighting, 16:9",
  "us-igaming-expansion-2026":
    "Editorial illustration: US map with casino chips and legal gavel, modern infographic style, blue and gold, 16:9",
  "twenty-dollar-casino-method":
    "Casino table with twenty dollar bill, poker chips, playing cards ace and king, bokeh lights, editorial photo style, 16:9",
  "fastest-payout-online-casinos":
    "Digital wallet and stopwatch with casino chips, fast payment concept, clean modern 3D render, 16:9",
  "live-dealer-vs-rng-slots":
    "Split concept: live dealer studio on left, digital slot machine on right, modern comparison graphic, 16:9",
};

const CATEGORY_VISUALS = {
  Slots: "colorful slot machine reels, gems, gold coins, bokeh lights",
  "Casino News": "editorial news mood, subtle US map or courthouse, chips",
  "Casino Tips": "poker chips, playing cards, strategy table close-up",
  "Casino Reviews": "premium casino lobby, comparison layout, chips and cards",
  "Live Casino": "live dealer studio, blackjack or roulette table, elegant lighting",
  "Casino Guides": "educational infographic feel, cards, chips, clean layout",
  "Casino Bonuses": "gift box, bonus chips, promotional sparkle, no readable text",
  Banking: "digital wallet, credit card silhouette, secure payment concept",
  "US Casinos": "US map outline with casino chips, state-themed editorial style",
};

function blogImagePrompt(post) {
  if (BLOG_PROMPT_OVERRIDES[post.slug]) {
    return BLOG_PROMPT_OVERRIDES[post.slug];
  }
  const visual =
    CATEGORY_VISUALS[post.category] ||
    "modern online casino atmosphere, chips and cards";
  return [
    `Blog hero thumbnail image for: "${post.title}".`,
    `Visual theme (${post.category}): ${visual}.`,
    `Context: ${post.excerpt}`,
    "Dark navy and gold palette, cinematic lighting, professional affiliate site style.",
    "No readable text, no watermarks, no real brand logos, 16:9 widescreen.",
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
