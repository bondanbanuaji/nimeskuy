export interface Genre {
  name: string;
  slug: string;
}

export type ProviderName = "sanka";

export interface AnimeCard {
  slug: string;
  title: string;
  poster: string;
  episodes?: number | null;
  score?: string | null;
  status?: string | null;
  releaseDay?: string | null;
  latestReleaseDate?: string | null;
  lastReleaseDate?: string | null;
  season?: string | null;
  studios?: string | null;
  genres?: Genre[];
  provider?: ProviderName;
}

export interface EpisodeInfo {
  slug: string; // episodeId
  title: string;
  number: number | null;
  date: string | null;
}

export interface AnimeDetail {
  slug: string;
  title: string;
  poster: string;
  japanese?: string | null;
  score?: string | null;
  producers?: string | null;
  type?: string | null;
  status?: string | null;
  episodes?: number | null;
  duration?: string | null;
  aired?: string | null;
  studios?: string | null;
  synopsis: string[];
  genres: Genre[];
  episodesList: EpisodeInfo[];
  batch?: { title: string; slug: string } | null;
  recommended?: AnimeCard[];
  provider?: ProviderName;
}

export interface HomeData {
  ongoing: AnimeCard[];
  completed: AnimeCard[];
}

export interface ScheduleDay {
  day: string;
  animeList: AnimeCard[];
}

export interface ServerItem {
  title: string;
  serverId: string;
}

export interface ServerQuality {
  title: string;
  serverList: ServerItem[];
}

export interface EpisodeDetail {
  title: string;
  animeSlug: string;
  animeTitle?: string;
  releaseTime?: string | null;
  defaultStreamingUrl: string | null;
  hasPrevEpisode: boolean;
  prevEpisode: { slug: string; title: string } | null;
  hasNextEpisode: boolean;
  nextEpisode: { slug: string; title: string } | null;
  servers: ServerQuality[];
  downloadUrls?: unknown;
  info?: {
    animeSlug?: string;
    episodeList?: EpisodeInfo[];
    genres?: Genre[];
  };
  episodeList: EpisodeInfo[];
  provider?: ProviderName;
  // when fallback, original host may be GoGo
  fallbackSource?: string | null;
}

export interface PaginatedAnime {
  list: AnimeCard[];
  pagination: {
    currentPage: number;
    hasNext: boolean;
  } | null;
}
