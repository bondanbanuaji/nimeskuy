import { SANKA_API_URL } from "@/lib/config";

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(message: string, status: number, code: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

type FetchOptions = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
  cache?: RequestCache;
};

function getErrorCode(status: number): string {
  if (status === 404) return "NOT_FOUND";
  if (status === 429) return "RATE_LIMITED";
  if (status === 400) return "BAD_REQUEST";
  if (status >= 500) return "SERVER_ERROR";
  return "UNKNOWN_ERROR";
}

function getErrorMessage(status: number, fallback?: string): string {
  if (fallback && fallback !== "" && fallback !== "data tidak ditemukan") return fallback;
  switch (status) {
    case 400:
      return "Permintaan tidak valid.";
    case 404:
      return "Anime tidak ditemukan.";
    case 429:
      return "Terlalu banyak permintaan. Coba lagi nanti.";
    case 500:
    case 502:
    case 503:
      return "Layanan anime sedang tidak tersedia. Coba lagi nanti.";
    default:
      return fallback || "Gagal mengambil data anime.";
  }
}

export async function sankaFetch<T>(
  path: string,
  options: FetchOptions & { revalidate?: number } = {}
): Promise<T> {
  const url = `${SANKA_API_URL}${path}`;
  const controller = new AbortController();
  const timeoutMs = 10000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const { revalidate, ...fetchOpts } = options;

  try {
    const res = await fetch(url, {
      ...fetchOpts,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(fetchOpts.headers || {}),
      },
      next: revalidate !== undefined ? { revalidate } : fetchOpts.next,
    });

    const text = await res.text();
    let json: unknown;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      throw new ApiError("Format respons tidak valid.", res.status || 500, getErrorCode(res.status));
    }

    // Sanka wraps all responses in envelope { ok, statusCode, data }
    // Even HTTP 200 may contain ok:false with statusCode 404
    const envelope = json as {
      ok?: boolean;
      statusCode?: number;
      statusMessage?: string;
      message?: string;
      data?: T;
    };

    // Handle envelope not ok
    if (envelope && typeof envelope.ok === "boolean" && envelope.ok === false) {
      const code = envelope.statusCode ?? res.status;
      const msg = envelope.message || getErrorMessage(code);
      throw new ApiError(getErrorMessage(code, msg), code, getErrorCode(code));
    }

    if (!res.ok) {
      const code = (envelope as { statusCode?: number })?.statusCode ?? res.status;
      const msg = (envelope as { message?: string })?.message;
      throw new ApiError(getErrorMessage(code, msg), code, getErrorCode(code));
    }

    // If envelope has data, return data, else return json as T
    if (envelope && "data" in envelope && envelope.data !== undefined) {
      if (envelope.data === null) {
        throw new ApiError(getErrorMessage(404), 404, "NOT_FOUND");
      }
      return envelope.data as T;
    }

    return json as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if ((err as Error).name === "AbortError") {
      throw new ApiError("Layanan anime terlalu lama merespons. Coba lagi.", 504, "TIMEOUT");
    }
    // network error
    throw new ApiError("Gagal terhubung ke layanan anime. Periksa koneksi internet.", 503, "NETWORK_ERROR");
  } finally {
    clearTimeout(timeout);
  }
}

// Retry helper with exponential backoff, no retry on 404
export async function withRetry<T>(fn: () => Promise<T>, retries = 1): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (e instanceof ApiError && e.status === 404) throw e;
      if (i < retries) {
        await new Promise((r) => setTimeout(r, 500 * Math.pow(2, i)));
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
}
