# Cloudflare DNS → GitHub Pages

Nameservers are on Cloudflare (`stephane.ns.cloudflare.com`, `ridge.ns.cloudflare.com`). GitHub has **verified** `casinooftheworld.com`.

## Cloudflare DNS records (required)

In **Cloudflare** → **casinooftheworld.com** → **DNS** → **Records**:

Delete any old **URL redirect**, **parking**, or **A** records pointing to Namecheap (`192.64.x`, `parkingpage.namecheap.com`).

### Recommended (works best with GitHub Pages)

| Type | Name | Content | Proxy status |
|------|------|---------|--------------|
| **CNAME** | `@` | `strazdo55.github.io` | **DNS only** (grey cloud) |
| **CNAME** | `www` | `strazdo55.github.io` | **DNS only** (grey cloud) |

Cloudflare supports CNAME on the apex (`@`) via CNAME flattening.

> Start with **DNS only** (grey cloud). After the site loads, you can try **Proxied** (orange) with SSL mode **Full** if you want Cloudflare CDN.

### Alternative (apex only) — four A records

If you prefer A records on `@` instead of CNAME:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `@` | `185.199.108.153` | DNS only |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `strazdo55.github.io` | DNS only |

## Cloudflare SSL/TLS

**SSL/TLS** → Overview → set to **Full** (not Flexible).

- **Flexible** often breaks GitHub Pages (redirect loops / 403).
- After DNS works, use **Full (strict)** once GitHub has issued the certificate.

## GitHub (already configured)

- Repo: [strazdo55/casinooftheworld](https://github.com/strazdo55/casinooftheworld)
- Pages: GitHub Actions from `main`
- Custom domain: `casinooftheworld.com` (verified)
- Root file: `CNAME` contains `casinooftheworld.com`

In GitHub → **Settings → Pages**:

1. Custom domain: `casinooftheworld.com` (and optionally `www.casinooftheworld.com`)
2. When available, enable **Enforce HTTPS**

## Verify (use Cloudflare DNS)

```bash
dig @1.1.1.1 casinooftheworld.com CNAME +short
# Should show strazdo55.github.io (or GitHub A IPs if using A records)

curl -sI https://casinooftheworld.com/ | head -6
# Should show: server: GitHub.com  and  HTTP/2 200
```

## Current issue (if site does not load)

If you see **403** or timeout from Cloudflare:

1. Proxy is **orange** but origin is not `strazdo55.github.io` → fix records above.
2. SSL mode is **Flexible** → change to **Full**.
3. Old Namecheap records still in Cloudflare → delete them.

## Fallback (always works)

https://strazdo55.github.io/casinooftheworld/
