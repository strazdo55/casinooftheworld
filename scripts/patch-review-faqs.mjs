import fs from "fs/promises";
import path from "path";
import { ROOT } from "./lib/env.mjs";
import { faqBlock } from "./lib/page-blocks.mjs";
import { getFaqs, reviewFaqs } from "./lib/faqs.mjs";

const operators = JSON.parse(
  await fs.readFile(path.join(ROOT, "data/operators.json"), "utf8")
);

for (const op of operators) {
  const file = path.join(ROOT, "reviews", op.slug, "index.html");
  let html = await fs.readFile(file, "utf8");

  if (html.includes(`${op.name} — FAQ`)) {
    console.log("Skip (has FAQ):", op.slug);
    continue;
  }

  const block = faqBlock(reviewFaqs(op), {
    title: `${op.name} — FAQ`,
    intro: "Quick answers about licensing, bonuses, payouts, and who this brand suits best.",
  });

  const anchor = '<section class="article-related"';
  if (!html.includes(anchor)) {
    console.warn("No anchor:", op.slug);
    continue;
  }

  html = html.replace(anchor, `${block}\n    ${anchor}`);
  await fs.writeFile(file, html);
  console.log("FAQ patched:", op.slug);
}

// Reviews index
const indexFile = path.join(ROOT, "reviews/index.html");
let indexHtml = await fs.readFile(indexFile, "utf8");
if (!indexHtml.includes("How we write reviews")) {
  const reviewsFaq = faqBlock(getFaqs("reviews"), {
    intro: "How we write reviews, handle affiliate links, and keep ratings independent.",
  });
  indexHtml = indexHtml.replace("</main>", `${reviewsFaq}\n</main>`);
  await fs.writeFile(indexFile, indexHtml);
  console.log("Reviews index FAQ patched");
}
