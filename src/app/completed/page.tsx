import { getCompleted } from "@/lib/api/sanka";
import { AnimeGrid } from "@/components/anime/anime-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ApiError } from "@/lib/api/client";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Anime Completed",
  description: "Daftar anime completed sub Indo di NimeSkuy — Sanka API",
};

export default async function CompletedPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  try {
    const { list } = await getCompleted(currentPage);
    if (!list.length) {
      return (
        <div className="mx-auto max-w-\[1520px\] px-4 py-12">
          <EmptyState title="Tidak ada anime completed" description="Belum ada data untuk halaman ini." />
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-\[1520px\] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-[22px] font-black tracking-tight text-white sm:text-2xl flex items-center gap-2.5">
            <span className="h-6 w-1 rounded-full bg-[#46d369]" /> Completed Anime
          </h1>
          <p className="text-[13px] text-[#a0a0a0] pl-3.5">Anime yang telah tamat — Sanka</p>
        </div>
        <AnimeGrid list={list} />
        <div className="flex items-center justify-center gap-2 pt-2">
          {currentPage > 1 && (
            <Link href={`/completed?page=${currentPage - 1}`} className="rounded-full bg-[#111] border border-[#1c1c1c] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#141414] hover:border-[#2a2a2a] transition">
              Previous
            </Link>
          )}
          <span className="rounded-full bg-[#46d369] px-4 py-2 text-[13px] font-bold text-black">Halaman {currentPage}</span>
          <Link href={`/completed?page=${currentPage + 1}`} className="rounded-full bg-[#111] border border-[#1c1c1c] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#141414] hover:border-[#2a2a2a] transition">
            Next
          </Link>
        </div>
        <p className="text-center text-xs text-[#707070]">Pagination mengikuti data API. Jika halaman kosong, API telah mencapai akhir.</p>
      </div>
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return (
        <div className="mx-auto max-w-\[1520px\] px-4 py-12">
          <EmptyState title="Tidak ada anime completed" description="Halaman melebihi batas data." />
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-\[1520px\] px-4 py-12">
        <EmptyState icon="error" title="Gagal memuat completed anime" description={err instanceof ApiError ? err.message : "Coba lagi nanti."} />
      </div>
    );
  }
}


