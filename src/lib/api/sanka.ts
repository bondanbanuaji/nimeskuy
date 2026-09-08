import { sankaFetch, withRetry } from "./client";
import type {
  RawHomeData,
  RawSearchData,
  RawGenreListData,
  RawScheduleData,
  RawAnimeDetailData,
  RawEpisodeData,
  RawServerData,
} from "./types";
import {
  mapAnimeCard,
  mapAnimeDetail,
  mapEpisodeDetail,
  mapGenreList,
  mapHome,
  mapSchedule,
} from "./mapper";
import { CACHE_TTL } from "@/lib/config";
import type { AnimeCard, AnimeDetail, EpisodeDetail, Genre, HomeData, ScheduleDay } from "@/types/anime";

// Home - returns ongoing + completed
export async function getHome(): Promise<HomeData> {
  const data = await withRetry(() =>
    sankaFetch<RawHomeData>("/anime/home", { revalidate: CACHE_TTL.HOME })
  );
  return mapHome(data);
}

export async function getGenres(): Promise<Genre[]> {
  const data = await withRetry(() =>
    sankaFetch<RawGenreListData>("/anime/genre", { revalidate: CACHE_TTL.GENRE })
  );
  return mapGenreList(data.genreList);
}

export async function getGenreDetail(slug: string): Promise<AnimeCard[]> {
  const data = await withRetry(() =>
    sankaFetch<RawSearchData>(`/anime/genre/${encodeURIComponent(slug)}`, {
      revalidate: CACHE_TTL.GENRE_DETAIL,
    })
  );
  // API returns { animeList: [...] } for genre detail as well
  const list = (data as unknown as { animeList?: typeof data.animeList })?.animeList ?? data.animeList ?? [];
  return list.map(mapAnimeCard);
}

export async function getSchedule(): Promise<ScheduleDay[]> {
  const data = await withRetry(() =>
    sankaFetch<RawScheduleData>("/anime/schedule", { revalidate: CACHE_TTL.SCHEDULE })
  );
  return mapSchedule(data);
}

export async function searchAnime(keyword: string): Promise<AnimeCard[]> {
  if (!keyword.trim()) return [];
  const encoded = encodeURIComponent(keyword.trim());
  const data = await withRetry(() =>
    sankaFetch<RawSearchData>(`/anime/search/${encoded}`, {
      revalidate: CACHE_TTL.SEARCH,
    })
  );
  return (data.animeList ?? []).map(mapAnimeCard);
}

export async function getAnimeDetail(slug: string): Promise<AnimeDetail> {
  const data = await withRetry(() =>
    sankaFetch<RawAnimeDetailData>(`/anime/anime/${encodeURIComponent(slug)}`, {
      revalidate: CACHE_TTL.DETAIL,
    })
  );
  return mapAnimeDetail(slug, data);
}

export async function getEpisodeDetail(episodeSlug: string): Promise<EpisodeDetail> {
  const data = await withRetry(() =>
    sankaFetch<RawEpisodeData>(`/anime/episode/${encodeURIComponent(episodeSlug)}`, {
      revalidate: CACHE_TTL.EPISODE,
    })
  );
  return mapEpisodeDetail(data);
}

export async function getStreamingUrl(serverId: string): Promise<string> {
  const data = await withRetry(() =>
    sankaFetch<RawServerData>(`/anime/server/${encodeURIComponent(serverId)}`, {
      revalidate: CACHE_TTL.SERVER,
    })
  );
  return data.url;
}

export async function getOngoing(page = 1): Promise<{ list: AnimeCard[]; pagination: null }> {
  const data = await withRetry(() =>
    sankaFetch<{ animeList: RawSearchData["animeList"] }>(`/anime/ongoing-anime?page=${page}`, {
      revalidate: CACHE_TTL.ONGOING,
    })
  );
  return {
    list: (data.animeList ?? []).map(mapAnimeCard),
    pagination: null,
  };
}

export async function getCompleted(page = 1): Promise<{ list: AnimeCard[]; pagination: null }> {
  const data = await withRetry(() =>
    sankaFetch<{ animeList: RawSearchData["animeList"] }>(`/anime/complete-anime?page=${page}`, {
      revalidate: CACHE_TTL.COMPLETED,
    })
  );
  return {
    list: (data.animeList ?? []).map(mapAnimeCard),
    pagination: null,
  };
}

export async function getTrending(): Promise<AnimeCard[]> {
  try {
    const data = await withRetry(() =>
      sankaFetch<{ animeList: RawSearchData["animeList"] }>("/anime/trending", {
        revalidate: CACHE_TTL.HOME,
      })
    );
    return (data.animeList ?? []).map(mapAnimeCard);
  } catch {
    return getCompleted().then((r) => r.list.slice(0, 10));
  }
}
