import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { getGenreDetail } from "@/lib/api/sanka";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug || /[^a-z0-9-]/.test(slug)) {
    return NextResponse.json({ success: false, error: { code: "BAD_REQUEST", message: "Slug genre tidak valid" } }, { status: 400 });
  }
  const page = Math.max(1, parseInt(_req.nextUrl.searchParams.get("page") ?? "1", 10) || 1);
  try {
    if (page === 1) {
      const data = await getGenreDetail(slug);
      return NextResponse.json({ success: true, data }, { status: 200 });
    }
    // For page >1, use raw sankaFetch via getGenreDetail paginated
    const { sankaFetch, withRetry } = await import("@/lib/api/client");
    const { mapAnimeCard } = await import("@/lib/api/mapper");
    const { CACHE_TTL } = await import("@/lib/config");
    const data = await withRetry(() => sankaFetch<{ animeList: { title: string; poster: string; animeId: string; href: string }[] }>(`/anime/genre/${encodeURIComponent(slug)}?page=${page}`, { revalidate: CACHE_TTL.GENRE_DETAIL }));
    const list = (data as unknown as { animeList?: typeof data.animeList })?.animeList ?? data.animeList ?? [];
    return NextResponse.json({ success: true, data: list.map(mapAnimeCard) }, { status: 200 });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ success: false, error: { code: err.code, message: err.message } }, { status: err.status });
    }
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Gagal memuat genre" } }, { status: 500 });
  }
}
