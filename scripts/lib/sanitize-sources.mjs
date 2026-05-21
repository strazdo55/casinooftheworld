/** Strip affiliate-directory branding before using scraped notes in prompts or copy */
export function sanitizeResearch(md) {
  if (!md) return "";
  return md
    .replace(/https?:\/\/[^\s)\]"']+/gi, (url) => {
      try {
        const host = new URL(url).hostname.replace(/^www\./, "");
        if (/casinobee/i.test(host)) return "";
      } catch {
        /* keep */
      }
      return url;
    })
    .replace(/casino\s*bee/gi, "our research notes")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
