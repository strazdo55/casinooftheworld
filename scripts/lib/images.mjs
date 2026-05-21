/** Responsive images — WebP + PNG fallback for static pages */

export function webpPath(src) {
  const path = src.replace(/^\//, "");
  return path.replace(/\.(png|jpe?g)$/i, ".webp");
}

export function hasWebpSibling(src) {
  return webpPath(src);
}

/**
 * @param {object} opts
 * @param {string} opts.src - site path e.g. assets/images/blog/foo.png
 * @param {string} opts.alt
 * @param {number} [opts.width]
 * @param {number} [opts.height]
 * @param {string} [opts.loading=lazy]
 * @param {string} [opts.fetchpriority]
 * @param {string} [opts.className]
 * @param {string} [opts.sizes]
 * @param {string} [opts.srcsetWebp] - optional multi-width webp srcset
 */
export function picture({
  src,
  alt,
  width,
  height,
  loading = "lazy",
  fetchpriority = "",
  className = "",
  sizes = "",
  srcsetWebp = "",
}) {
  const png = src.startsWith("/") ? src : `/${src}`;
  const webp = `/${webpPath(src)}`;
  const wh =
    width && height ? ` width="${width}" height="${height}"` : "";
  const ld = loading ? ` loading="${loading}"` : ' loading="lazy"';
  const fp = fetchpriority ? ` fetchpriority="${fetchpriority}"` : "";
  const cls = className ? ` class="${className}"` : "";
  const szAttr = sizes ? ` sizes="${sizes}"` : "";
  const webpSrc = srcsetWebp
    ? ` srcset="${srcsetWebp}"`
    : ` srcset="${webp}"`;
  const safeAlt = String(alt)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");

  return `<picture>
  <source type="image/webp"${webpSrc}${szAttr}>
  <img src="${png}" alt="${safeAlt}"${wh}${ld}${fp}${cls} decoding="async">
</picture>`;
}

/** Card thumbnails (16:9) */
export function cardPicture(src, alt, opts = {}) {
  return picture({
    src,
    alt,
    width: 400,
    height: 225,
    sizes: "(max-width: 640px) 100vw, 400px",
    ...opts,
  });
}

/** Blog article hero */
export function articlePicture(src, alt) {
  return picture({
    src,
    alt,
    width: 1200,
    height: 675,
    loading: "eager",
    fetchpriority: "high",
    className: "article-featured",
    sizes: "(max-width: 900px) 100vw, 900px",
  });
}
