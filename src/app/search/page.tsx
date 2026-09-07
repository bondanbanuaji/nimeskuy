import { AnimeGrid } from "@/components/anime/anime-card";
import { EmptyState } from "@/components/ui/empty-state";
import { AnimeGridSkeleton } from "@/components/ui/skeleton";
import { SearchInput } from "./search-input";
import { ApiError } from "@/lib/api/client";
import { searchAnime } from "@/lib/api/sanka";
import type { Metadata } from "next";
import { Suspense } from "react";

export const revalidate = 0;

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const { q } = await searchParams;
  if (q) {
    return {
      title: `Search: ${q}`,
      description: `Hasil pencarian anime untuk "${q}" di NimeSkuy — Sanka`,
    };
  }
  return {
    title: "Cari Anime",
    description: "Cari anime favoritmu di NimeSkuy — Sanka API",
  };
}

async function SearchResults({ query }: { query: string }) {
  if (!query.trim()) {
    return (
      <EmptyState
        title="Cari anime favoritmu"
        description="Ketik kata kunci di atas untuk mulai mencari."
      />
    );
  }

  try {
    const results = await searchAnime(query);
    if (results.length === 0) {
      return (
        <EmptyState
          title="Anime tidak ditemukan"
          description={`Tidak ada hasil untuk "${query}". Coba kata kunci lain.`}
        />
      );
    }
    return (
      <div className="space-y-4">
        <p className="text-[13px] text-[#a0a0a0]">
          Menampilkan <span className="text-white font-bold">{results.length}</span> hasil untuk <span className="text-white font-semibold">&quot;{query}&quot;</span>
          <span className="ml-2 rounded-full bg-[#111] border border-[#1c1c1c] px-2 py-0.5 text-xs text-[#707070]">Sanka</span>
        </p>
        <AnimeGrid list={results} />
      </div>
    );
  } catch (err) {
    const msg = err instanceof ApiError ? err.message : "Gagal mencari anime.";
    return (
      <EmptyState icon="error" title="Gagal memuat hasil" description={msg} />
    );
  }
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q ?? "";

  return (
    <div className="mx-auto max-w-\[1520px\] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-[22px] font-black tracking-tight text-white sm:text-2xl">Cari Anime</h1>
        <p className="text-[13px] text-[#a0a0a0]">Temukan anime dengan cepat — Sanka</p>
      </div>
      <Suspense>
        <SearchInput initialValue={query} />
      </Suspense>

      <Suspense fallback={<AnimeGridSkeleton count={8} />}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}


