import { getCompleted } from "@/lib/api/sanka";
import { AnimeGrid } from "@/components/anime/anime-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Metadata } from "next";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Movie Anime",
  description: "Daftar anime movie sub Indo di NimeSkuy â€” Sanka API",
};

export default async function MoviesPage() {
  try {
    const { list } = await getCompleted(1);
    const movies = list.filter((a) => a.title.toLowerCase().includes("movie") || a.season?.toLowerCase().includes("movie"));
    const display = movies.length > 5 ? movies : list.slice(0, 18);
    if (!display.length) {
      return (
        <div className="mx-auto max-w-\[1520px\] px-4 py-12">
          <EmptyState title="Belum ada movie" description="Belum ada data movie untuk saat ini." />
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-\[1520px\] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-[22px] font-black tracking-tight text-white sm:text-2xl flex items-center gap-2.5">
            <span className="h-6 w-1 rounded-full bg-[#3b82f6]" /> Movie Anime
          </h1>
          <p className="text-[13px] text-[#a0a0a0] pl-3.5">Koleksi movie anime sub Indo â€” Sanka</p>
        </div>
        <AnimeGrid list={display} />
      </div>
    );
  } catch {
    return (
      <div className="mx-auto max-w-\[1520px\] px-4 py-12">
        <EmptyState icon="error" title="Gagal memuat movie" description="Coba lagi nanti." />
      </div>
    );
  }
}


