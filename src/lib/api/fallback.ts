/**
 * Sanka-only adapter — sesuai PRD v1.0
 * Semua data berasal dari Sanka Anime REST API (https://www.sankavollerei.web.id)
 * Tidak ada fallback ke provider lain.
 * File ini dipertahankan agar import lama (getXWithFallback) tetap kompatibel,
 * tetapi sekarang hanya proxy ke sanka.ts.
 */
import type { AnimeCard, AnimeDetail, EpisodeDetail, Genre, HomeData, ScheduleDay } from "@/types/anime";
import * as sanka from "./sanka";

export async function getHomeWithFallback(): Promise<HomeData> {
  return sanka.getHome();
}

export async function getGenresWithFallback(): Promise<Genre[]> {
  return sanka.getGenres();
}

export async function getScheduleWithFallback(): Promise<ScheduleDay[]> {
  return sanka.getSchedule();
}

export async function searchWithFallback(query: string): Promise<{ results: AnimeCard[]; provider: "sanka" | "none" }> {
  const results = await sanka.searchAnime(query);
  return { results, provider: results.length > 0 ? "sanka" : "none" };
}

export async function getAnimeDetailFallback(slug: string): Promise<AnimeDetail> {
  const detail = await sanka.getAnimeDetail(slug);
  return { ...detail, provider: "sanka" as const };
}

export async function getEpisodeDetailFallback(episodeSlug: string): Promise<EpisodeDetail> {
  const detail = await sanka.getEpisodeDetail(episodeSlug);
  return { ...detail, provider: "sanka" as const };
}

export async function getStreamingUrlFallback(
  serverId: string,
  _fallbackEpisodeId?: string
): Promise<{ url: string; provider: "sanka" }> {
  const url = await sanka.getStreamingUrl(serverId);
  return { url, provider: "sanka" as const };
}

// No enrichment needed — Sanka already provides servers & embed URL
export async function enrichEpisodeWithFallback(episode: EpisodeDetail, _episodeSlug: string): Promise<EpisodeDetail> {
  return episode;
}

// Re-export individual for convenience
export const getHome = sanka.getHome;
export const getGenres = sanka.getGenres;
export const getSchedule = sanka.getSchedule;
export const searchAnime = sanka.searchAnime;
export const getAnimeDetail = sanka.getAnimeDetail;
export const getEpisodeDetail = sanka.getEpisodeDetail;
export const getStreamingUrl = sanka.getStreamingUrl;
export const getOngoing = sanka.getOngoing;
export const getCompleted = sanka.getCompleted;
