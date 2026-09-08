import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/genre`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/schedule`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/ongoing`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/completed`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/movies`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic: genres + anime from home/trending/schedule
  // Keep sitemap lean for Vercel execution time; expand up to ~100 anime urls
  try {
    const { getHome, getGenres, getTrending, getSchedule } = await import("@/lib/api/sanka");
    const [home, genres, trending, schedule] = await Promise.all([
      getHome().catch(() => ({ ongoing: [], completed: [] })),
      getGenres().catch(() => []),
      getTrending().catch(() => []),
      getSchedule().catch(() => []),
    ]);

    const animeSet = new Map<string, { slug: string; lastModified: Date }>();

    // Collect anime slugs from multiple sources, dedup
    const collect = (list: { slug: string }[]) => {
      for (const a of list) {
        if (!animeSet.has(a.slug) && a.slug && /^[a-z0-9-]{2,120}$/.test(a.slug)) {
          animeSet.set(a.slug, { slug: a.slug, lastModified: now });
        }
      }
    };

    collect(home.ongoing.slice(0, 30));
    collect(home.completed.slice(0, 30));
    collect(trending.slice(0, 30));
    for (const d of schedule.slice(0, 7)) {
      collect(d.animeList.slice(0, 6));
    }

    const animeUrls: MetadataRoute.Sitemap = Array.from(animeSet.values())
      .slice(0, 80)
      .map(({ slug }) => ({
        url: `${base}/anime/${slug}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.8,
      }));

    // Genre detail pages: include all genres (up to 40)
    const genreUrls: MetadataRoute.Sitemap = genres.slice(0, 40).map((g) => ({
      url: `${base}/genre/${g.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...genreUrls, ...animeUrls];
  } catch {
    return staticRoutes;
  }
}
