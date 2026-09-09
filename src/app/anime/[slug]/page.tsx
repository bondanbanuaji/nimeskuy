import { ApiError } from "@/lib/api/client";
import { getAnimeDetail } from "@/lib/api/sanka";
import { EpisodeList } from "@/components/anime/episode-list";
import { AnimeCard } from "@/components/anime/anime-card";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Star, Calendar, Film, Clock, HeartButton } from "./heart-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd, breadcrumbJsonLd, animeDetailJsonLd } from "@/components/seo/json-ld";

export const revalidate = 1800;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { absoluteUrl } = await import("@/lib/site");
  try {
    const anime = await getAnimeDetail(slug);
    const title = `${anime.title} | NimeSkuy`;
    const descRaw = anime.synopsis.slice(0, 2).join(" ").replace(/\s+/g, " ").trim();
    const description =
      descRaw.slice(0, 155) + (descRaw.length > 155 ? "…" : "") ||
      `Tonton dan jelajahi ${anime.title} — informasi episode, genre, dan detail lengkap di NimeSkuy.`;
    const url = absoluteUrl(`/anime/${slug}`);
    return {
      title: anime.title,
      description,
      alternates: { canonical: `/anime/${slug}` },
      openGraph: {
        title,
        description,
        url,
        siteName: "NimeSkuy",
        type: "video.tv_show",
        locale: "id_ID",
        images: anime.poster
          ? [{ url: anime.poster, width: 600, height: 900, alt: `${anime.title} — poster anime` }]
          : [{ url: "/logo.png", width: 512, height: 512, alt: "NimeSkuy" }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: anime.poster ? [anime.poster] : ["/logo.png"],
      },
      robots: { index: true, follow: true },
    };
  } catch {
    return {
      title: "Anime tidak ditemukan | NimeSkuy",
      robots: { index: false, follow: true },
    };
  }
}

export default async function AnimeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug || slug.length > 200 || /[^a-z0-9-]/.test(slug)) {
    notFound();
  }

  let anime;
  try {
    anime = await getAnimeDetail(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    return (
      <div className="mx-auto max-w-\[1520px\] px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          icon="error"
          title="Gagal memuat anime"
          description={err instanceof ApiError ? err.message : "Terjadi kesalahan."}
        />
      </div>
    );
  }

  const breadcrumbData = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Anime", url: "/ongoing" },
    { name: anime.title, url: `/anime/${slug}` },
  ]);
  const animeLd = animeDetailJsonLd({
    slug,
    title: anime.title,
    poster: anime.poster,
    synopsis: anime.synopsis,
    genres: anime.genres,
    score: anime.score,
    status: anime.status,
  });

  return (
    <div className="mx-auto max-w-\[1520px\] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <JsonLd data={[breadcrumbData, animeLd]} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Anime", href: "/ongoing" }, { name: anime.title }]} />
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0c0c0c] border border-[#1c1c1c]">
        <div className="absolute inset-0 opacity-[0.18]" aria-hidden="true">
          <img src={anime.poster} alt="" aria-hidden="true" className="h-full w-full object-cover blur-2xl scale-110" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        <div className="relative flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:p-8">
          <img
            src={anime.poster}
            alt={`${anime.title} anime poster`}
            width={256}
            height={384}
            className="h-auto w-full max-w-[280px] rounded-xl object-cover shadow-2xl mx-auto lg:mx-0 lg:w-64 lg:shrink-0 border border-white/10"
          />
          <div className="flex flex-1 flex-col gap-4">
            <div>
              <div className="flex items-start gap-2 flex-wrap">
                <h1 className="text-[22px] font-black tracking-tight text-white sm:text-[26px] leading-tight">{anime.title}</h1>
                <span className="rounded-full bg-[#111] border border-[#1c1c1c] px-2.5 py-1 text-[11px] font-semibold text-[#707070]">Sub Indo</span>
              </div>
              {anime.japanese && <p className="text-[13px] text-[#a0a0a0] mt-1.5 leading-relaxed">{anime.japanese}</p>}
            </div>

            <div className="flex flex-wrap gap-2">
              {anime.score && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5c518] px-3 py-1.5 text-xs font-black text-black">
                  <Star className="h-3.5 w-3.5 fill-black" /> {anime.score}
                </span>
              )}
              {anime.status && (
                <span className="rounded-full bg-[#d50032] px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-white">
                  {anime.status}
                </span>
              )}
              {anime.type && <span className="rounded-full bg-[#111] border border-[#1c1c1c] px-3 py-1.5 text-xs font-medium text-[#f0f0f0]">{anime.type}</span>}
              {anime.studios && <span className="rounded-full bg-[#111] border border-[#1c1c1c] px-3 py-1.5 text-xs font-medium text-[#a0a0a0]">{anime.studios}</span>}
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-sm sm:grid-cols-3">
              {anime.episodes && (
                <div className="rounded-xl bg-[#111] border border-[#1c1c1c] p-3">
                  <div className="text-[#707070] text-[11px] font-semibold tracking-wider uppercase">Total Episode</div>
                  <div className="font-bold text-white flex items-center gap-1.5 mt-1.5 text-[13px]"><Film className="h-4 w-4 text-[#a0a0a0]" /> {anime.episodes}</div>
                </div>
              )}
              {anime.duration && (
                <div className="rounded-xl bg-[#111] border border-[#1c1c1c] p-3">
                  <div className="text-[#707070] text-[11px] font-semibold tracking-wider uppercase">Durasi</div>
                  <div className="font-bold text-white flex items-center gap-1.5 mt-1.5 text-[13px]"><Clock className="h-4 w-4 text-[#a0a0a0]" /> {anime.duration}</div>
                </div>
              )}
              {anime.aired && (
                <div className="rounded-xl bg-[#111] border border-[#1c1c1c] p-3">
                  <div className="text-[#707070] text-[11px] font-semibold tracking-wider uppercase">Tayang</div>
                  <div className="font-bold text-white flex items-center gap-1.5 mt-1.5 text-[13px]"><Calendar className="h-4 w-4 text-[#a0a0a0]" /> {anime.aired}</div>
                </div>
              )}
            </div>

            {anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {anime.genres.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/genre/${g.slug}`}
                    className="rounded-full bg-[#111] border border-[#1c1c1c] px-3 py-1.5 text-xs font-medium text-[#a0a0a0] hover:bg-[#141414] hover:text-white hover:border-[#2a2a2a] transition"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2.5 pt-1">
              {anime.episodesList.length > 0 ? (
                <Link
                  href={`/watch/${anime.episodesList[anime.episodesList.length - 1].slug}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#d50032] px-6 py-3 text-[13px] font-bold text-white hover:bg-[#e8003a] transition shadow-[0_4px_16px_rgba(213,0,50,0.3)] sm:flex-none"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  Tonton Sekarang
                </Link>
              ) : (
                <span className="rounded-full bg-[#111] border border-[#1c1c1c] px-6 py-3 text-sm font-medium text-[#707070]">Belum ada episode</span>
              )}
              <HeartButton slug={slug} title={anime.title} poster={anime.poster} />
            </div>
          </div>
        </div>
      </div>

      {/* Synopsis */}
      {anime.synopsis.length > 0 && (
        <section className="rounded-2xl bg-[#0c0c0c] border border-[#1c1c1c] p-5 sm:p-6">
          <h2 className="text-[15px] font-bold tracking-tight text-white mb-3 flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-[#d50032]" /> Sinopsis
          </h2>
          <div className="space-y-3 text-[13.5px] leading-relaxed text-[#a0a0a0]">
            {anime.synopsis.map((p, i) => (
              <p key={i} className="text-[#c4c4c4] leading-[1.7]">{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* Episodes */}
      <section className="rounded-2xl bg-[#0c0c0c] border border-[#1c1c1c] p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-[#d50032]" /> Daftar Episode
          </h2>
          <span className="rounded-full bg-[#111] border border-[#1c1c1c] px-3 py-1 text-xs font-semibold text-[#707070]">{anime.episodesList.length} episode</span>
        </div>
        <EpisodeList episodes={anime.episodesList} />
      </section>

      {/* Recommended */}
      {anime.recommended && anime.recommended.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-[15px] font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="h-5 w-1 rounded-full bg-[#d50032]" />
            Rekomendasi
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {anime.recommended.map((a) => (
              <AnimeCard key={a.slug} anime={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


