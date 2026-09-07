import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${base}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/genre`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/schedule`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${base}/ongoing`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${base}/completed`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/movies`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  // Try to add some dynamic anime URLs from home, but don't fail if API down
  try {
    const { getHome } = await import("@/lib/api/sanka");
    const home = await getHome();
    const animeUrls: MetadataRoute.Sitemap = [...home.ongoing, ...home.completed].slice(0, 20).map((a) => ({
      url: `${base}/anime/${a.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
    return [...staticRoutes, ...animeUrls];
  } catch {
    return staticRoutes;
  }
}
