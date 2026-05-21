/** Site header logo — minimal globe ring + lime accent (navy / gold / lime palette) */
export const LOGO_SVG = `<svg class="logo-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="42" height="42" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="cotw-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
    <linearGradient id="cotw-lime" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0ff80"/>
      <stop offset="100%" stop-color="#c8f000"/>
    </linearGradient>
  </defs>
  <circle cx="24" cy="24" r="21" fill="#152238" stroke="url(#cotw-gold)" stroke-width="2.2"/>
  <ellipse cx="24" cy="24" rx="21" ry="8" fill="none" stroke="#f8fafc" stroke-width="1.1" opacity="0.55"/>
  <path d="M3 24h42" stroke="#f8fafc" stroke-width="1" opacity="0.4"/>
  <path d="M24 3c8 6 8 36 0 42M24 3c-8 6-8 36 0 42" fill="none" stroke="#f8fafc" stroke-width="1" opacity="0.4"/>
  <path d="M24 14v20M17 24h14" stroke="url(#cotw-lime)" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="34" cy="14" r="3.5" fill="url(#cotw-lime)"/>
</svg>`;

/** Standalone brand files (favicon, OG, schema) */
export const LOGO_FILE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" role="img" aria-label="Casino of the World">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
    <linearGradient id="lime" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0ff80"/>
      <stop offset="100%" stop-color="#c8f000"/>
    </linearGradient>
  </defs>
  <circle cx="24" cy="24" r="21" fill="#152238" stroke="url(#gold)" stroke-width="2.2"/>
  <ellipse cx="24" cy="24" rx="21" ry="8" fill="none" stroke="#f8fafc" stroke-width="1.1" opacity="0.55"/>
  <path d="M3 24h42" stroke="#f8fafc" stroke-width="1" opacity="0.4"/>
  <path d="M24 3c8 6 8 36 0 42M24 3c-8 6-8 36 0 42" fill="none" stroke="#f8fafc" stroke-width="1" opacity="0.4"/>
  <path d="M24 14v20M17 24h14" stroke="url(#lime)" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="34" cy="14" r="3.5" fill="url(#lime)"/>
</svg>`;

export const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" role="img" aria-label="Casino of the World">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
    <linearGradient id="l" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0ff80"/>
      <stop offset="100%" stop-color="#c8f000"/>
    </linearGradient>
  </defs>
  <circle cx="16" cy="16" r="14" fill="#152238" stroke="url(#g)" stroke-width="2"/>
  <path d="M16 9v14M11 16h10" stroke="url(#l)" stroke-width="2" stroke-linecap="round"/>
  <circle cx="22" cy="10" r="2.5" fill="url(#l)"/>
</svg>`;
