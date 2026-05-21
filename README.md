# Casino of the World

Static affiliate website for **casinooftheworld.com**, built for GitHub Pages.

## Quick start

```bash
npm install
npm run dev            # http://localhost:8080
```

## Build pipeline

| Command | Description |
|---------|-------------|
| `npm run build:images` | Gemini image generation → `assets/images/` |
| `npm run build:blog` | Firecrawl news + Gemini articles → `blog/*.html` |
| `node scripts/fetch-logos.mjs` | Operator logos → `assets/images/operators/` |
| `node scripts/generate-pages.mjs` | Regenerate affiliate & legal pages |
| `npm run build` | Full pipeline (logos, images, blog) |

## Project structure

- `index.html` — homepage
- `css/main.css` — design system
- `js/main.js` — modal, mobile nav, demo forms
- `data/operators.json` — comparison table data
- `data/blog.json` — blog metadata
- `assets/images/` — committed images served by GitHub Pages

## GitHub Pages

**Live site:** [https://strazdo55.github.io/casinooftheworld/](https://strazdo55.github.io/casinooftheworld/)

Deploys automatically on push to `main` via GitHub Actions (`.github/workflows/deploy-pages.yml`).

For a custom domain (`casinooftheworld.com`), point DNS A records to GitHub Pages and add a `CNAME` file with your domain in the repo root.

## Responsible gambling

This site includes 18+ and NCPG messaging. Offers require operator T&Cs.
