import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";

const patches = {
  "us-igaming-expansion-2026": {
    title: "EU & UK Online Casino Regulation: What Changed in 2026",
    category: "Casino News",
    excerpt:
      "UKGC, MGA, and national frameworks continue to evolve—here is how licensing shapes game libraries, bonuses, and player protections in Europe.",
    searchQuery: "UK EU online casino regulation UKGC MGA 2026 news",
    keywords:
      "EU online casino regulation, UKGC licensing 2026, MGA casino rules, European iGaming",
  },
  "new-york-online-casino-legalization-2026": {
    title: "UK Online Casino Licensing Explained for New Players (2026)",
    category: "Casino News",
    excerpt:
      "How UKGC-licensed sites verify age, advertise bonuses, and separate casino from sports—what to check before you register.",
    searchQuery: "UKGC online casino licensing requirements 2026 UK",
    keywords:
      "UK online casino licence, UKGC requirements, legal UK casino sites 2026",
  },
  "paypal-online-casinos-us": {
    title: "PayPal Online Casinos in Europe: Availability and Limits",
    category: "Banking",
    excerpt:
      "PayPal is supported at select UK and EU brands—not everywhere. Compare deposit limits, withdrawal rules, and KYC steps.",
    searchQuery: "PayPal online casino UK Europe deposit withdrawal 2026",
    keywords:
      "PayPal online casino Europe, UK casino PayPal deposit, e-wallet casino UK",
  },
  "pennsylvania-online-slots-2026": {
    title: "Germany Online Slots 2026: Regulation, RTP Rules, and Game Choice",
    category: "Europe Casinos",
    excerpt:
      "German interstate treaty rules affect spin speeds, stakes, and jackpots. See how licensed sites adapt their slot catalogs.",
    searchQuery: "Germany online slots regulation GlüStV 2026 casino",
    keywords:
      "Germany online slots, German casino regulation, legal slots Germany 2026",
  },
  "michigan-online-casino-market-2026": {
    title: "Netherlands Online Casino Market 2026: KSA Rules and Operators",
    category: "Europe Casinos",
    excerpt:
      "The Dutch KSA regime limits bonuses and ads. We outline licensed operators, game libraries, and player controls.",
    searchQuery: "Netherlands online casino KSA licensed sites 2026",
    keywords:
      "Netherlands online casino, KSA gambling licence, Dutch iGaming 2026",
  },
  "new-jersey-online-casino-bonuses": {
    title: "Malta-Licensed Casino Bonuses Compared (2026)",
    category: "Casino Bonuses",
    excerpt:
      "MGA-licensed brands compete on welcome packages—compare wagering, game weighting, and max cashout rules.",
    searchQuery: "Malta MGA online casino welcome bonus comparison 2026",
    keywords:
      "Malta casino bonus, MGA licensed casino offers, EU welcome bonus 2026",
  },
};

const file = path.join(ROOT, "data/blog.json");
const posts = JSON.parse(await fs.readFile(file, "utf8"));
for (const post of posts) {
  if (patches[post.slug]) Object.assign(post, patches[post.slug]);
  if (post.category === "US Casinos") post.category = "Europe Casinos";
}
await fs.writeFile(file, JSON.stringify(posts, null, 2) + "\n");
console.log("Updated blog.json for international focus.");
