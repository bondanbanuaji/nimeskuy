/**
 * Konfigurasi Sanka-only — PRD v1.0
 * Base URL: https://www.sankavollerei.web.id
 * Rate limit: 60 req/menit → wajib caching
 */
export const SANKA_API_URL =
  process.env.SANKA_API_URL || "https://www.sankavollerei.web.id";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// TTL sesuai PRD #38 Rate Limit Protection
export const CACHE_TTL = {
  HOME: 300, // 5 menit
  GENRE: 86400, // 24 jam
  GENRE_DETAIL: 3600, // 1 jam
  SCHEDULE: 1800, // 30 menit
  ONGOING: 300, // 5 menit (PRD 5 menit)
  COMPLETED: 1800, // 30 menit
  SEARCH: 120, // 2 menit
  DETAIL: 1800, // 30 menit
  EPISODE: 300, // 5 menit
  SERVER: 120, // 1-5 menit (ambil 2 menit)
} as const;

// Domain embed yang diizinkan untuk iframe Sanka (Otakudesu, Samehadaku, dll)
export const ALLOWED_EMBED_DOMAINS = [
  "desustream.me",
  "nekoclouds.com",
  "otakudesu.cloud",
  "moedesu",
  "vidhide",
  "mega",
  "odstream",
  "filelions",
  "streamwish",
  "vidhidepro",
  "mp4upload",
  "yourupload",
  "mega.nz",
  "cdn",
  "desu",
] as const;

function isPrivateHostname(hostname: string): boolean {
  const host = hostname.replace(/^\[(.*)\]$/, "$1").toLowerCase();
  if (host === "localhost" || host === "0.0.0.0") return true;
  if (host === "127.0.0.1" || host === "::1" || host === "0:0:0:0:0:0:0:1") return true;
  if (/^127\.\d+\.\d+\.\d+$/.test(host)) return true;
  if (/^10\.\d+\.\d+\.\d+$/.test(host)) return true;
  if (/^192\.168\.\d+\.\d+$/.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(host)) return true;
  if (/^169\.254\.\d+\.\d+$/.test(host)) return true;
  if (host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80")) return true;
  if (host.startsWith("0.")) return true;
  return false;
}

export function isAllowedEmbedUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    if (isPrivateHostname(u.hostname)) return false;
    const hostname = u.hostname;
    return ALLOWED_EMBED_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith("." + domain),
    );
  } catch {
    return false;
  }
}

export function isValidServerId(id: string): boolean {
  if (!id || typeof id !== "string") return false;
  if (id.length > 100) return false;
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return false;
  if (id.length < 4) return false;
  return true;
}
