import type {
  RawAnimeListItem,
  RawGenreItem,
  RawAnimeDetailData,
  RawEpisodeData,
  RawHomeData,
  RawScheduleData,
} from "./types";
import type {
  AnimeCard,
  AnimeDetail,
  EpisodeDetail,
  EpisodeInfo,
  Genre,
  HomeData,
  ScheduleDay,
} from "@/types/anime";

export function mapGenre(raw: RawGenreItem | { title: string; genreId: string; href: string; otakudesuUrl?: string }): Genre {
  return {
    name: raw.title,
    slug: raw.genreId,
  };
}

export function mapAnimeCard(raw: RawAnimeListItem): AnimeCard {
  return {
    slug: raw.animeId,
    title: raw.title,
    poster: raw.poster,
    episodes: raw.episodes ?? null,
    score: raw.score ?? null,
    status: raw.status ?? null,
    releaseDay: raw.releaseDay ?? null,
    latestReleaseDate: raw.latestReleaseDate ?? null,
    lastReleaseDate: raw.lastReleaseDate ?? null,
    season: raw.season ?? null,
    studios: raw.studios ?? null,
    genres: raw.genreList?.map(mapGenre) ?? [],
  };
}

export function mapHome(raw: RawHomeData): HomeData {
  return {
    ongoing: raw.ongoing.animeList.map(mapAnimeCard),
    completed: raw.completed.animeList.map(mapAnimeCard),
  };
}

export function mapSchedule(raw: RawScheduleData): ScheduleDay[] {
  return raw.map((day) => ({
    day: day.day,
    animeList: day.anime_list.map((a) => ({
      slug: a.slug,
      title: a.title,
      poster: a.poster,
      episodes: null,
      score: null,
      status: null,
      releaseDay: day.day,
    })),
  }));
}

export function mapEpisodeInfo(raw: {
  title: string;
  eps?: number | null;
  episodeId: string;
  date: string;
}): EpisodeInfo {
  return {
    slug: raw.episodeId,
    title: raw.title,
    number: raw.eps ?? extractEpisodeNumber(raw.title) ?? extractEpisodeNumber(raw.episodeId),
    date: raw.date || null,
  };
}

function extractEpisodeNumber(str: string): number | null {
  const m = str.match(/episode[- ]?(\d+)/i);
  if (m) return parseInt(m[1], 10);
  const m2 = str.match(/eps?\.?\s*(\d+)/i);
  if (m2) return parseInt(m2[1], 10);
  return null;
}

export function mapAnimeDetail(slug: string, raw: RawAnimeDetailData): AnimeDetail {
  return {
    slug,
    title: raw.title,
    poster: raw.poster,
    japanese: raw.japanese ?? null,
    score: raw.score ?? null,
    producers: raw.producers ?? null,
    type: raw.type ?? null,
    status: raw.status ?? null,
    episodes: raw.episodes ?? null,
    duration: raw.duration ?? null,
    aired: raw.aired ?? null,
    studios: raw.studios ?? null,
    synopsis: raw.synopsis?.paragraphs ?? [],
    genres: raw.genreList?.map(mapGenre) ?? [],
    episodesList: raw.episodeList?.map(mapEpisodeInfo) ?? [],
    batch: raw.batch
      ? { title: raw.batch.title, slug: raw.batch.batchId }
      : null,
    recommended: raw.recommendedAnimeList?.map((a) => ({
      slug: (a as RawAnimeListItem).animeId,
      title: a.title,
      poster: a.poster,
      episodes: null,
      score: null,
      status: null,
    })) ?? [],
  };
}

export function mapEpisodeDetail(raw: RawEpisodeData): EpisodeDetail {
  // info.episodeList may be alternative source for episode list
  const rawInfo = raw as unknown as { info?: { episodeList?: RawEpisodeData["info"] extends { episodeList?: infer T } ? T : never } };
  const episodeListRaw = raw.info?.episodeList ?? rawInfo.info?.episodeList ?? [];

  const cast = episodeListRaw as unknown as { title: string; eps: number | null; date: string; episodeId: string; href: string }[] | undefined;
  const epList: EpisodeInfo[] = cast?.map(mapEpisodeInfo) ?? [];

  // sort by eps asc
  epList.sort((a, b) => (a.number ?? 0) - (b.number ?? 0));

  return {
    title: raw.title,
    animeSlug: raw.animeId,
    releaseTime: raw.releaseTime ?? null,
    defaultStreamingUrl: raw.defaultStreamingUrl ?? null,
    hasPrevEpisode: raw.hasPrevEpisode,
    prevEpisode: raw.prevEpisode
      ? { slug: raw.prevEpisode.episodeId, title: raw.prevEpisode.title }
      : null,
    hasNextEpisode: raw.hasNextEpisode,
    nextEpisode: raw.nextEpisode
      ? { slug: raw.nextEpisode.episodeId, title: raw.nextEpisode.title }
      : null,
    servers: raw.server?.qualities?.map((q) => ({
      title: q.title,
      serverList: q.serverList.map((s) => ({
        title: s.title.trim(),
        serverId: s.serverId,
      })),
    })) ?? [],
    downloadUrls: raw.downloadUrl,
    episodeList: epList,
    info: raw.info
      ? {
          episodeList: epList,
          genres: raw.info.genreList?.map(mapGenre) ?? [],
        }
      : undefined,
  };
}

export function mapGenreList(rawList: RawGenreItem[] | undefined): Genre[] {
  if (!rawList) return [];
  return rawList.map((g) => mapGenre(g));
}

