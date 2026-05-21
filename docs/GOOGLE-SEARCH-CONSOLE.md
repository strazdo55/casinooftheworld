# Google Search Console setup

## 1. Add property

1. Open [Google Search Console](https://search.google.com/search-console).
2. Add property **URL prefix**: `https://casinooftheworld.com`

## 2. Verify ownership (HTML tag — recommended)

1. Choose **HTML tag** verification.
2. Copy the `content` value from the meta tag (the long token only).
3. Add to `.env` in the project root:

```env
GOOGLE_SITE_VERIFICATION=your_token_here
```

4. Rebuild SEO on all pages:

```bash
npm run enrich
```

5. Deploy to GitHub Pages, then click **Verify** in Search Console.

The token is injected on every page:

```html
<meta name="google-site-verification" content="your_token_here">
```

## 3. Optional: HTML file method

If Search Console gives you a file like `googleabc123.html`:

```env
GOOGLE_SITE_VERIFICATION=your_token_here
GOOGLE_SITE_VERIFICATION_FILENAME=googleabc123.html
```

Then run:

```bash
node scripts/write-gsc-verification.mjs
npm run enrich
```

Commit the generated file at the site root and deploy.

## 4. Submit sitemap

After verification:

- **Sitemaps** → add `https://casinooftheworld.com/sitemap.xml`
- Use **URL inspection** on the homepage and 2–3 blog posts → **Request indexing**

## 5. Structured data

Pages include JSON-LD (`Organization`, `WebSite` on home, `WebPage`, `Article` on blog posts, `BreadcrumbList`). Test with [Rich Results Test](https://search.google.com/test/rich-results).
