# Map casinooftheworld.com to GitHub Pages

GitHub shows the domain as **verified**. Traffic still goes to Namecheap until DNS is updated.

## Namecheap — remove forwarding first

In Namecheap → Domain → **Redirect Domain** / **URL Redirect Record**: **delete** any forward to `www` or parking. That blocks GitHub Pages.

## DNS records (Advanced DNS)

### Apex `@` (casinooftheworld.com)

Add **four A records** (Host `@`, TTL Automatic):

| Type | Host | Value |
|------|------|-------|
| A | @ | `185.199.108.153` |
| A | @ | `185.199.109.153` |
| A | @ | `185.199.110.153` |
| A | @ | `185.199.111.153` |

### WWW (optional but recommended)

| Type | Host | Value |
|------|------|-------|
| CNAME | www | `strazdo55.github.io` |

Then in GitHub → repo **Settings → Pages**, add `www.casinooftheworld.com` as a second domain if you want both.

## GitHub (already done)

- Repo: `strazdo55/casinooftheworld`
- Pages: GitHub Actions deploy from `main`
- Custom domain: `casinooftheworld.com` (verified)
- `CNAME` file in repo root: `casinooftheworld.com`

## After DNS propagates (5–60 minutes)

1. Open **https://casinooftheworld.com** — should show the casino site.
2. In GitHub → **Settings → Pages**, enable **Enforce HTTPS** when the checkbox becomes available.

## Check status

```bash
dig +short casinooftheworld.com A
# Should list 185.199.108.x etc., NOT 192.64.119.222 (Namecheap parking)

curl -sI https://casinooftheworld.com/ | head -5
# Should show server: GitHub.com and HTTP 200
```

## Fallback URL (works now)

https://strazdo55.github.io/casinooftheworld/
