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
  const { absoluteUrl } = await import("@/lib/site");
  try {
    const ep = await getEpisodeDetail(episodeSlug);
    // Episode/watch pages are player pages — thin content, parameter variations (?server= etc) must not be indexed.
    // Canonical is itself without query, but robots noindex prevents index bloat.
    return {
      title: `${ep.title} | NimeSkuy`,
      description: `Nonton ${ep.title} sub Indo di NimeSkuy. Pilih server streaming dan lanjutkan menonton dengan nyaman.`,
      alternates: { canonical: `/watch/${episodeSlug}` },
      openGraph: {
        title: `${ep.title} | NimeSkuy`,
        description: `Nonton ${ep.title} sub Indo di NimeSkuy.`,
        url: absoluteUrl(`/watch/${episodeSlug}`),
        siteName: "NimeSkuy",
        type: "video.episode",
        locale: "id_ID",
      },
      twitter: {
        card: "summary",
        title: `${ep.title} | NimeSkuy`,
        description: `Nonton ${ep.title} sub Indo di NimeSkuy.`,
      },
      robots: {
        index: false,
        follow: true,
        googleBot: { index: false, follow: true },
      },
    };
  } catch {
    return {
      title: "Episode tidak ditemukan | NimeSkuy",
      robots: { index: false, follow: true },
    };
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

  // Breadcrumb for UX even though noindex — helps internal linking
  const { Breadcrumbs } = await import("@/components/seo/breadcrumbs");
  const { JsonLd, breadcrumbJsonLd } = await import("@/components/seo/json-ld");
  const bc = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: detail.animeSlug ? "Anime" : "Watch", url: detail.animeSlug ? `/anime/${detail.animeSlug}` : "/" },
    { name: detail.title, url: `/watch/${episodeSlug}` },
  ]);
  return (
    <>
      <div className="mx-auto max-w-\[1520px\] px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <JsonLd data={bc} />
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            ...(detail.animeSlug ? [{ name: "Anime", href: `/anime/${detail.animeSlug}` } as const] : []),
            { name: detail.title },
          ]}
        />
      </div>
      <WatchClient initialDetail={detail} episodeSlug={episodeSlug} />
    </>
  );
}


