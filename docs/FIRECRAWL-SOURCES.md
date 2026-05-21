# Firecrawl sources for blog articles

When you run `npm run build:blog`, each post pulls research from the web via the **Firecrawl CLI** (not MCP). Scraped material is cached locally so you can audit what the AI used.

## Where files live

```
.firecrawl/reviews/
├── {operator-slug}-search.json
├── {operator-slug}-0.md … {operator-slug}-3.md
└── {operator-slug}-sources.md

.firecrawl/blog/
├── {slug}-search.json      # Raw search results (news + web)
├── {slug}-0.md             # Scraped markdown — source URL #1
├── {slug}-1.md             # Scraped markdown — source URL #2
├── {slug}-2.md             # Scraped markdown — source URL #3
└── {slug}-sources.md       # Combined bundle sent to Gemini (≈12k chars)
```

This folder is **gitignored** — it exists only on the machine that ran the build.

## How to view sources for one article

```bash
# Combined input to the writer
cat .firecrawl/blog/fastest-payout-online-casinos-sources.md

# Individual pages
ls .firecrawl/blog/fastest-payout-online-casinos-*.md

# Search JSON (titles + URLs)
cat .firecrawl/blog/fastest-payout-online-casinos-search.json | head -80
```

## Re-fetch fresh sources

```bash
rm .firecrawl/blog/fastest-payout-online-casinos-*
npm run build:blog -- fastest-payout-online-casinos
```

## Operator reviews (Firecrawl)

```bash
cat .firecrawl/reviews/leovegas-sources.md
npm run build:reviews
npm run build:reviews -- leovegas   # single operator
```

## Full site content rebuild

```bash
npm run build:home
npm run build:pages
npm run build:reviews
npm run build:blog
npm run build:images:blog
npm run inject:cookie-banner
npm run build:sitemap
```

Requires `GEMINI_API_KEY` and Firecrawl CLI logged in (`firecrawl login`).
