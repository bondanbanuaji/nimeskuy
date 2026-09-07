// Raw Sanka response envelope
export interface SankaEnvelope<T> {
  status: string;
  creator: string;
  statusCode: number;
  statusMessage: string;
  message: string;
  ok: boolean;
  data: T | null;
  pagination: unknown;
}

// Raw types (partial) from Sanka
export interface RawAnimeListItem {
  title: string;
  poster: string;
  animeId: string;
  href: string;
  otakudesuUrl?: string;
  episodes?: number | null;
  score?: string | null;
  status?: string | null;
  releaseDay?: string | null;
  latestReleaseDate?: string | null;
  lastReleaseDate?: string | null;
  season?: string | null;
  studios?: string | null;
  genreList?: { title: string; genreId: string; href: string }[];
  synopsis?: { paragraphs: string[] };
}

export interface RawHomeData {
  ongoing: { href: string; otakudesuUrl: string; animeList: RawAnimeListItem[] };
  completed: { href: string; otakudesuUrl: string; animeList: RawAnimeListItem[] };
}

export interface RawSearchData {
  animeList: RawAnimeListItem[];
}

export interface RawGenreItem {
  title: string;
  genreId: string;
  href: string;
  otakudesuUrl: string;
}
export interface RawGenreListData {
  genreList: RawGenreItem[];
}

export type RawScheduleData = {
  day: string;
  anime_list: { title: string; slug: string; url: string; poster: string }[];
}[];

export interface RawAnimeDetailData {
  title: string;
  poster: string;
  japanese?: string;
  score?: string;
  producers?: string;
  type?: string;
  status?: string;
  episodes?: number | null;
  duration?: string;
  aired?: string;
  studios?: string;
  batch?: { title: string; batchId: string; href: string } | null;
  synopsis: { paragraphs: string[]; connections?: unknown[] };
  genreList: RawGenreItem[];
  episodeList: { title: string; eps: number | null; date: string; episodeId: string; href: string }[];
  recommendedAnimeList?: RawAnimeListItem[];
}

export interface RawEpisodeData {
  title: string;
  animeId: string;
  releaseTime: string;
  defaultStreamingUrl: string;
  hasPrevEpisode: boolean;
  prevEpisode: { title: string; episodeId: string; href: string } | null;
  hasNextEpisode: boolean;
  nextEpisode: { title: string; episodeId: string; href: string } | null;
  server: {
    qualities: {
      title: string;
      serverList: { title: string; serverId: string; href: string }[];
    }[];
  };
  downloadUrl?: unknown;
  info?: {
    animeSlug?: string;
    genreList?: RawGenreItem[];
    episodeList?: { title: string; eps: number | null; date: string; episodeId: string; href: string }[];
  };
  // fallback for alternative field names
  episodeList?: unknown;
}

export interface RawServerData {
  url: string;
}
