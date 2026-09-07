import { getEpisodeDetail } from "@/lib/api/sanka";
import { ApiError } from "@/lib/api/client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { WatchClient } from "./watch-client";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ episodeSlug: string }> }): Promise<Metadata> {
  const { episodeSlug } = await params;
  try {
    const ep = await getEpisodeDetail(episodeSlug);
    return {
      title: `${ep.title} | NimeSkuy — Sanka`,
      description: `Nonton ${ep.title} sub Indo di NimeSkuy`,
    };
  } catch {
    return { title: "Episode tidak ditemukan | NimeSkuy" };
  }
}

export default async function WatchPage({ params }: { params: Promise<{ episodeSlug: string }> }) {
  const { episodeSlug } = await params;

  if (!episodeSlug || episodeSlug.length > 300 || /[^a-z0-9-]/.test(episodeSlug)) {
    notFound();
  }

  let detail;
  try {
    detail = await getEpisodeDetail(episodeSlug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    return (
      <div className="mx-auto max-w-\[1520px\] px-4 py-12">
        <EmptyState
          icon="error"
          title="Gagal memuat episode"
          description={err instanceof ApiError ? err.message : "Terjadi kesalahan"}
          action={
            <Link href="/" className="rounded-full bg-[#d50032] px-6 py-2.5 text-sm font-bold text-white">
              Kembali ke Home
            </Link>
          }
        />
      </div>
    );
  }

  return <WatchClient initialDetail={detail} episodeSlug={episodeSlug} />;
}


