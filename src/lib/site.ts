/**
 * Central SEO site configuration.
 * Supports both NEXT_PUBLIC_SITE_URL and legacy NEXT_PUBLIC_APP_URL,
 * plus Vercel automatic URL fallback.
 * Never returns empty; fallback is localhost for dev, but callers should treat it as dev-only.
 */

export const SITE_NAME = "NimeSkuy";
export const SITE_SHORT_DESC =
  "Platform streaming anime dengan katalog anime, informasi episode, genre, dan detail anime.";
export const SITE_DESCRIPTION =
  "NimeSkuy adalah platform streaming anime sub Indo terlengkap. Cari, jelajahi, dan tonton anime ongoing, completed, dan movie dengan cepat dan nyaman.";
export const SITE_LOCALE = "id_ID";
export const SITE_LANGUAGE = "id";
export const SITE_KEYWORDS = [
  "anime",
  "streaming anime",
  "nonton anime",
  "anime sub indo",
  "anime database",
  "otakudesu",
  "anime ongoing",
  "anime completed",
];

export const DEVELOPER_NAME = "Bondan Banuaji";
export const DEVELOPER_INSTAGRAM = "https://www.instagram.com/bdn_bnj";
export const DEVELOPER_GITHUB = "https://github.com/bondanbanuaji/nimeskuy";
export const DEVELOPER_USERNAME = "bdn_bnj";

/** Returns absolute site URL without trailing slash. Prefers NEXT_PUBLIC_SITE_URL. */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

/** Build absolute URL for a path. Path must start with /. */
export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}

/** Canonical URL helper — ensures no double slashes and removes search params that shouldn't be canonical. */
export function canonicalUrl(path: string): string {
  // Strip query string for canonical
  const withoutQuery = path.split("?")[0];
  return absoluteUrl(withoutQuery);
}
