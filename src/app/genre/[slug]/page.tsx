import { getGenreDetail, getGenres } from "@/lib/api/sanka";
import { AnimeGrid } from "@/components/anime/anime-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ApiError } from "@/lib/api/client";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Genre ${slug} - NimeSkuy`,
    description: `Nonton anime genre ${slug} sub Indo di NimeSkuy — Sanka API`,
  };
}

export default async function GenreDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  if (!slug || /[^a-z0-9-]/.test(slug)) notFound();

  try {
    const getGenreDetailWithFallback = async (slug: string, page: number) => {
      if (page === 1) return getGenreDetail(slug);
      return getGenreDetailPaginated(slug, page);
    };
    const list = await getGenreDetailWithFallback(slug, currentPage);
    if (!list.length) {
      if (currentPage > 1) {
        return (
          <div className="mx-auto max-w-\[1520px\] px-4 py-12">
            <EmptyState title={`Tidak ada anime untuk genre "${slug}" di halaman ${currentPage}`} description="Coba kembali ke halaman 1." />
          </div>
        );
      }
      return (
        <div className="mx-auto max-w-\[1520px\] px-4 py-12">
          <EmptyState title={`Tidak ada anime untuk genre "${slug}"`} description="Coba genre lain." />
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-\[1520px\] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-[22px] font-black tracking-tight text-white capitalize flex items-center gap-2.5">
            <span className="h-6 w-1 rounded-full bg-[#f5c518]" /> Genre: {slug.replace(/-/g, " ")}
          </h1>
          <p className="text-[13px] text-[#a0a0a0] pl-3.5">{list.length} anime ditemukan — Halaman {currentPage} — Sanka</p>
        </div>
        <AnimeGrid list={list} />
        <div className="flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link href={`/genre/${slug}?page=${currentPage - 1}`} className="rounded-full bg-[#0c0c0c] border border-[#1c1c1c] px-5 py-2 text-[13px] font-semibold text-white hover:bg-[#141414]">Previous</Link>
          )}
          <span className="rounded-full bg-[#d50032] px-4 py-2 text-[13px] font-bold text-white">Halaman {currentPage}</span>
          <Link href={`/genre/${slug}?page=${currentPage + 1}`} className="rounded-full bg-[#0c0c0c] border border-[#1c1c1c] px-5 py-2 text-[13px] font-semibold text-white hover:bg-[#141414]">Next</Link>
        </div>
        <p className="text-center text-xs text-[#707070]">Genre pagination tergantung ketersediaan API. Jika kosong, telah mencapai akhir.</p>
      </div>
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    return (
      <div className="mx-auto max-w-\[1520px\] px-4 py-12">
        <EmptyState icon="error" title="Gagal memuat genre" description={err instanceof ApiError ? err.message : "Terjadi kesalahan"} />
      </div>
    );
  }
}

async function getGenreDetailPaginated(slug: string, page: number) {
  const { sankaFetch, withRetry } = await import("@/lib/api/client");
  const { mapAnimeCard } = await import("@/lib/api/mapper");
  const { CACHE_TTL } = await import("@/lib/config");
  const data = await withRetry(() => sankaFetch<{ animeList: { title: string; poster: string; animeId: string; href: string; score?: string; status?: string; season?: string; genreList?: { title: string; genreId: string; href: string }[] }[] }>(`/anime/genre/${encodeURIComponent(slug)}?page=${page}`, { revalidate: CACHE_TTL.GENRE_DETAIL }));
  const list = (data as unknown as { animeList?: typeof data.animeList })?.animeList ?? data.animeList ?? [];
  return list.map(mapAnimeCard);
}

export async function generateStaticParams() {
  try {
    const genres = await getGenres();
    return genres.slice(0, 10).map((g) => ({ slug: g.slug }));
  } catch {
    return [];
  }
}


