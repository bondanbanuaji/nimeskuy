"use client";

export interface HistoryItem {
  animeSlug: string;
  animeTitle: string;
  animePoster?: string;
  episodeSlug: string;
  episodeNumber?: number | null;
  episodeTitle?: string;
  updatedAt: number;
}

const HISTORY_KEY = "nimeskuy_history";
const FAVORITES_KEY = "nimeskuy_favorites";
const MAX_HISTORY = 20;

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(item: HistoryItem) {
  if (typeof window === "undefined") return;
  try {
    const list = getHistory();
    const filtered = list.filter((h) => h.animeSlug !== item.animeSlug);
    filtered.unshift(item);
    if (filtered.length > MAX_HISTORY) filtered.splice(MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch {
    // quota exceeded or storage unavailable - silently ignore
  }
}

export function removeHistory(animeSlug: string) {
  if (typeof window === "undefined") return;
  try {
    const list = getHistory().filter((h) => h.animeSlug !== animeSlug);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch {}
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {}
}

export interface FavoriteItem {
  slug: string;
  title: string;
  poster: string;
  addedAt: number;
}

export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(slug: string): boolean {
  return getFavorites().some((f) => f.slug === slug);
}

export function toggleFavorite(item: FavoriteItem): boolean {
  try {
    const list = getFavorites();
    const exists = list.some((f) => f.slug === item.slug);
    let next: FavoriteItem[];
    if (exists) {
      next = list.filter((f) => f.slug !== item.slug);
    } else {
      next = [item, ...list];
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    return !exists;
  } catch {
    return false;
  }
}

export function removeFavorite(slug: string) {
  try {
    const list = getFavorites().filter((f) => f.slug !== slug);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
  } catch {}
}
