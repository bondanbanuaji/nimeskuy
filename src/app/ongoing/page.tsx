import { getOngoing } from "@/lib/api/sanka";
import { AnimeGrid } from "@/components/anime/anime-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ApiError } from "@/lib/api/client";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 300;

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ page?: string }> }): Promise<Metadata> {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const { absoluteUrl } = await import("@/lib/site");
  const title = currentPage > 1 ? `Anime Ongoing — Halaman ${currentPage} | NimeSkuy` : "Anime Ongoing | NimeSkuy";
  const description =
    "Daftar anime ongoing terbaru sub Indo di NimeSkuy — update setiap musim, streaming cepat, dan info episode lengkap.";
  const canonical = currentPage > 1 ? `/ongoing?page=${currentPage}` : "/ongoing";
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonical),
      siteName: "NimeSkuy",
      type: "website",
      locale: "id_ID",
      images: [{ url: "/logo.png", width: 512, height: 512, alt: "NimeSkuy — Anime Ongoing" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo.png"],
    },
  };
}

export default async function OngoingPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  try {
    const { list } = await getOngoing(currentPage);
    if (!list.length) {
      return (
        <div className="mx-auto max-w-\[1520px\] px-4 py-12">
          <EmptyState title="Tidak ada anime ongoing" description="Belum ada data untuk halaman ini." />
        </div>
      );
    }
    const { Breadcrumbs } = await import("@/components/seo/breadcrumbs");
    const { JsonLd, breadcrumbJsonLd } = await import("@/components/seo/json-ld");
    const bc = breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Ongoing Anime", url: "/ongoing" },
    ]);
    return (
      <div className="mx-auto max-w-\[1520px\] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <JsonLd data={bc} />
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Ongoing" }]} />
        <div className="space-y-1">
          <h1 className="text-[22px] font-black tracking-tight text-white sm:text-2xl flex items-center gap-2.5">
            <span className="h-6 w-1 rounded-full bg-[#d50032]" /> Ongoing Anime
          </h1>
          <p className="text-[13px] text-[#a0a0a0] pl-3.5">Anime yang sedang tayang — Sanka</p>
        </div>
        <AnimeGrid list={list} />
        <div className="flex items-center justify-center gap-2 pt-2">
          {currentPage > 1 && (
            <Link
              href={`/ongoing?page=${currentPage - 1}`}
              className="rounded-full bg-[#111] border border-[#1c1c1c] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#141414] hover:border-[#2a2a2a] transition"
            >
              Previous
            </Link>
          )}
          <span className="rounded-full bg-[#d50032] px-4 py-2 text-[13px] font-bold text-white shadow-[0_2px_10px_rgba(213,0,50,0.3)]">Halaman {currentPage}</span>
          <Link
            href={`/ongoing?page=${currentPage + 1}`}
            className="rounded-full bg-[#111] border border-[#1c1c1c] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#141414] hover:border-[#2a2a2a] transition"
          >
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
          <EmptyState title="Tidak ada anime ongoing" description="Halaman melebihi batas data. Kembali ke halaman sebelumnya." />
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-\[1520px\] px-4 py-12">
        <EmptyState icon="error" title="Gagal memuat ongoing anime" description={err instanceof ApiError ? err.message : "Coba lagi nanti."} />
      </div>
    );
  }
}


