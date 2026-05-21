# Performance (PageSpeed / Core Web Vitals)

## Quick commands

```bash
npm run perf              # WebP variants + minified CSS + patch all HTML
npm run optimize:images   # Generate .webp + compress large PNGs
npm run minify:css        # css/main.min.css
npm run patch:perf        # Async fonts, defer JS, <picture> for blog images
```

After changing generators, run `npm run perf` before deploy (or rely on `npm run build` which includes image optimize + CSS minify).

## What we optimize

| Area | Technique |
|------|-----------|
| Images | WebP at display width; `<picture>` with PNG fallback; hero preloaded |
| CSS | Minified `main.min.css` + preload |
| Fonts | Google Fonts loaded async (non-render-blocking) |
| JS | `defer` on `main.js` |
| Layout | `content-visibility` on below-fold grids/footer |
| LCP | `home-hero.webp` preload on homepage; `fetchpriority="high"` on article heroes |

## GitHub Pages limits

GitHub Pages does not support custom `Cache-Control` headers. For 1-year asset caching, put **Cloudflare** (or similar) in front of `casinooftheworld.com` and set cache rules for `/assets/*` and `/css/*`.

## PageSpeed checklist

1. Run `npm run perf` after adding blog images (Gemini PNGs are ~1MB each before optimize).
2. Test mobile + desktop on [PageSpeed Insights](https://pagespeed.web.dev/).
3. Avoid new render-blocking scripts or third-party widgets.
4. Keep hero/featured images under ~80KB WebP where possible.
