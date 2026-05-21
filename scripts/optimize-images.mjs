import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { ROOT } from "./lib/env.mjs";

const BLOG_MAX = 1200;
const BLOG_CARD = 800;
const HERO_MAX = 1920;
const HERO_MOBILE = 960;
const OP_LOGO_MAX_W = 200;

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function optimizeFile(filePath, { maxWidth, quality = 82, alsoResizePng = true }) {
  const ext = path.extname(filePath).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(ext)) return null;

  const base = filePath.slice(0, -ext.length);
  const webpOut = `${base}.webp`;
  const img = sharp(filePath);
  const meta = await img.metadata();
  const w = meta.width || maxWidth;
  const targetW = Math.min(w, maxWidth);

  await img
    .clone()
    .resize(targetW, null, { withoutEnlargement: true, fit: "inside" })
    .webp({ quality, effort: 4 })
    .toFile(webpOut);

  let pngBytes = (await fs.stat(filePath)).size;
  if (alsoResizePng || pngBytes > 120_000) {
    const pipeline = sharp(filePath).resize(targetW, null, {
      withoutEnlargement: true,
      fit: "inside",
    });
    if (ext === ".png") {
      await pipeline.png({ compressionLevel: 9, palette: true }).toFile(`${base}.opt.png`);
    } else {
      await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(`${base}.opt.jpg`);
      if (ext !== ".jpg" && ext !== ".jpeg") {
        await fs.unlink(filePath);
        await fs.rename(`${base}.opt.jpg`, `${base}.jpg`);
        return { webpOut, pngBytes, webpBytes, width: targetW, renamed: `${base}.jpg` };
      }
    }
    await fs.rename(`${base}.opt.png`, filePath);
    pngBytes = (await fs.stat(filePath)).size;
  }

  const webpBytes = (await fs.stat(webpOut)).size;
  return { webpOut, pngBytes, webpBytes, width: targetW };
}

async function walkPng(dir, files = []) {
  for (const name of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) await walkPng(full, files);
    else if (/\.(png|jpe?g)$/i.test(name.name)) files.push(full);
  }
  return files;
}

async function main() {
  let saved = 0;
  const report = [];

  const hero = path.join(ROOT, "assets/images/hero/home-hero.png");
  if (await exists(hero)) {
    const r = await optimizeFile(hero, { maxWidth: HERO_MAX, quality: 80 });
    await sharp(hero)
      .resize(HERO_MOBILE, null, { withoutEnlargement: true, fit: "inside" })
      .webp({ quality: 78 })
      .toFile(path.join(ROOT, "assets/images/hero/home-hero-960.webp"));
    report.push(["hero", r]);
    saved += 1;
  }

  const blogDir = path.join(ROOT, "assets/images/blog");
  if (await exists(blogDir)) {
    for (const file of await walkPng(blogDir)) {
      const r = await optimizeFile(file, { maxWidth: BLOG_MAX, quality: 78 });
      if (r) {
        report.push([path.basename(file), r]);
        saved += 1;
      }
    }
  }

  const opDir = path.join(ROOT, "assets/images/operators");
  if (await exists(opDir)) {
    for (const file of await walkPng(opDir)) {
      const r = await optimizeFile(file, {
        maxWidth: OP_LOGO_MAX_W,
        quality: 85,
        alsoResizePng: true,
      });
      if (r) report.push([path.basename(file), r]);
    }
  }

  const megaphone = path.join(ROOT, "assets/images/hero/modal-megaphone.png");
  if (await exists(megaphone)) {
    await fs.unlink(megaphone);
    console.log("Removed unused modal-megaphone.png (1.1MB)");
  }

  console.log(`Optimized ${saved} image(s) + WebP variants.`);
  const totalWebp = report.reduce((a, [, r]) => a + (r?.webpBytes || 0), 0);
  const totalPng = report.reduce((a, [, r]) => a + (r?.pngBytes || 0), 0);
  console.log(`Sample totals — PNG: ${(totalPng / 1024 / 1024).toFixed(1)}MB, WebP: ${(totalWebp / 1024 / 1024).toFixed(1)}MB`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
