import { HeroCarousel } from "@/components/anime/hero";
import { AnimeCard, AnimeCarousel } from "@/components/anime/anime-card";
import { ContinueWatching } from "@/components/anime/continue-watching";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { ApiError } from "@/lib/api/client";
import { getHome, getSchedule, getGenres, getTrending } from "@/lib/api/sanka";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "NimeSkuy | Streaming Anime Sub Indo & Database Anime",
  description:
    "NimeSkuy adalah platform streaming anime sub Indo terlengkap — katalog ongoing, completed, movie, genre, dan jadwal rilis harian. Dikembangkan oleh Bondan Banuaji.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "NimeSkuy | Streaming Anime Sub Indo & Database Anime",
    description:
      "NimeSkuy adalah platform streaming anime sub Indo terlengkap — katalog ongoing, completed, movie, genre, dan jadwal rilis harian. Dikembangkan oleh Bondan Banuaji.",
    url: absoluteUrl("/"),
    type: "website",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "NimeSkuy — Streaming Anime Sub Indo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NimeSkuy | Streaming Anime Sub Indo & Database Anime",
    description:
      "Streaming anime sub Indo terlengkap — katalog, genre, jadwal harian. Dikembangkan oleh Bondan Banuaji.",
    images: ["/logo.png"],
  },
};

async function HomeContent() {
  try {
     const [home, genres, schedule, trending] = await Promise.all([
       getHome().catch(() => ({ ongoing: [], completed: [] })),
       getGenres().catch(() => []),
       getSchedule().catch(() => []),
       getTrending().catch(() => []),
     ]);

     const ongoingList = home.ongoing;
     const completedList = home.completed;
     const heroAnimes = trending.slice(0, 10);

    const schedulePreview = schedule.slice(0, 1).flatMap((d) => d.animeList.slice(0, 6));

    return (
      <div className="space-y-8 sm:space-y-10">
        {heroAnimes.length > 0 ? (
          <div className="relative w-screen left-1/2 -translate-x-1/2">
            <HeroCarousel animes={heroAnimes} />
          </div>
        ) : null}

        <ContinueWatching />

        {ongoingList.length > 0 ? (
          <AnimeCarousel list={ongoingList} title="Ongoing Anime" href="/ongoing" />
        ) : null}

        {completedList.length > 0 ? (
          <AnimeCarousel list={completedList} title="Completed Anime" href="/completed" />
        ) : null}

        {ongoingList.length === 0 && completedList.length === 0 ? (
          <EmptyState
            icon="film"
            title="Belum ada data anime"
            description="Gagal memuat data dari server. Coba refresh beberapa saat lagi."
          />
        ) : null}

        {/* Schedule preview - IDLIX style */}
        {schedule.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[15px] font-bold tracking-tight text-white sm:text-[17px] flex items-center gap-2.5">
                <span className="h-5 w-1 rounded-full bg-[#d50032] hidden sm:block" />
                Jadwal Hari Ini
                <span className="hidden sm:inline-flex rounded-full bg-[#d50032]/15 border border-[#d50032]/20 px-2 py-0.5 text-[11px] font-bold text-[#ff6568] tracking-wide uppercase">
                  {schedule[0]?.day ?? "Today"}
                </span>
              </h2>
              <Link
                href="/schedule"
                className="inline-flex items-center gap-1 rounded-full bg-[#111] border border-[#1c1c1c] px-3.5 py-1.5 text-xs font-semibold text-[#a0a0a0] hover:text-white hover:bg-[#141414] hover:border-[#2a2a2a] transition"
              >
                Lihat jadwal
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-60"><path d="m9 18 6-6-6-6" /></svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              {schedulePreview.map((a) => (
                <AnimeCard key={a.slug} anime={a} />
              ))}
            </div>
          </section>
        )}

        {/* Genre chips - IDLIX style */}
        {genres.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[15px] font-bold tracking-tight text-white sm:text-[17px] flex items-center gap-2.5">
                <span className="h-5 w-1 rounded-full bg-[#f5c518] hidden sm:block" />
                Genre Populer
              </h2>
              <Link
                href="/genre"
                className="inline-flex items-center gap-1 rounded-full bg-[#111] border border-[#1c1c1c] px-3.5 py-1.5 text-xs font-semibold text-[#a0a0a0] hover:text-white hover:bg-[#141414] hover:border-[#2a2a2a] transition"
              >
                Semua genre
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-60"><path d="m9 18 6-6-6-6" /></svg>
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {genres.slice(0, 16).map((g) => (
                <Link
                  key={g.slug}
                  href={`/genre/${g.slug}`}
                  className="rounded-full bg-[#0c0c0c] border border-[#1c1c1c] px-4 py-2 text-[13px] font-medium text-[#a0a0a0] hover:bg-[#141414] hover:text-white hover:border-[#2a2a2a] hover:shadow-sm transition"
                >
                  {g.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  } catch (err) {
    const msg = err instanceof ApiError ? err.message : "Gagal memuat homepage.";
    return (
      <div className="py-16 text-center">
        <p className="text-[#a0a0a0]">{msg}</p>
        <p className="text-sm text-[#707070] mt-1">Coba refresh halaman.</p>
      </div>
    );
  }
}

export default async function HomePage() {
  const breadcrumb = breadcrumbJsonLd([{ name: "Home", url: "/" }]);
  return (
    <div className="mx-auto max-w-\[1520px\] px-4 sm:px-6 lg:px-8 py-6">
      <JsonLd data={breadcrumb} />
      {/* SEO: satu H1 deskriptif per halaman; hero memakai h2 */}
      <h1 className="sr-only">NimeSkuy — Platform Streaming Anime Sub Indo Terlengkap, dikembangkan oleh Bondan Banuaji</h1>
      <HomeContent />
      <section aria-label="Tentang NimeSkuy" className="mt-10 rounded-2xl border border-[#1c1c1c] bg-[#0c0c0c] p-5 sm:p-6">
        <h2 className="text-[14px] font-bold tracking-tight text-white flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-[#d50032]" /> Tentang NimeSkuy
        </h2>
        <p className="mt-2 text-[13.5px] leading-6 text-[#a0a0a0]">
          NimeSkuy adalah platform streaming anime yang dikembangkan oleh{" "}
          <Link href="/about" className="font-semibold text-white underline decoration-white/20 underline-offset-4 hover:decoration-white/40">
            Bondan Banuaji
          </Link>{" "}
          — menyajikan katalog anime lengkap, informasi episode, genre, dan detail anime dengan pengalaman menonton yang cepat dan nyaman.
          Jelajahi{" "}
          <Link href="/ongoing" className="text-white hover:underline">
            ongoing
          </Link>
          ,{" "}
          <Link href="/completed" className="text-white hover:underline">
            completed
          </Link>
          ,{" "}
          <Link href="/genre" className="text-white hover:underline">
            genre
          </Link>{" "}
          dan{" "}
          <Link href="/schedule" className="text-white hover:underline">
            jadwal rilis
          </Link>{" "}
          setiap hari.
        </p>
      </section>
    </div>
  );
}


