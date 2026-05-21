# Casino of the World

Static affiliate website for **casinooftheworld.com**, built for GitHub Pages.

## Quick start

```bash
cp .env.example .env   # add GEMINI_API_KEY and FIRECRAWL_API_KEY
npm install
npm run dev            # http://localhost:8080 (uses serve.json — cleanUrls OFF)

**Important:** Restart the dev server after pulling changes. If blog links show “Continue to article”, stop the server (Ctrl+C) and run `npm run dev` again. Open posts with `.html`, e.g. `http://localhost:8080/blog/best-new-online-slots-2026.html`
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

1. Push repo to GitHub
2. Settings → Pages → Deploy from branch `main` / root
3. Add `CNAME` with `casinooftheworld.com` when DNS is ready

## Environment

See `.env.example`. Never commit `.env`.

**Firecrawl:** If `firecrawl --status` shows `Invalid token`, regenerate your API key at [firecrawl.dev](https://www.firecrawl.dev) and update `FIRECRAWL_API_KEY`, then run `npm run build:blog` again for news-sourced articles.

## Responsible gambling

This site includes 18+ and NCPG messaging. Offers require operator T&Cs.
