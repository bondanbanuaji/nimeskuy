import { HeroCarousel } from "@/components/anime/hero";
import { AnimeCard, AnimeCarousel } from "@/components/anime/anime-card";
import { ContinueWatching } from "@/components/anime/continue-watching";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { ApiError } from "@/lib/api/client";
import { getHome, getSchedule, getGenres } from "@/lib/api/sanka";

export const revalidate = 300;

async function HomeContent() {
  try {
    const [home, genres, schedule] = await Promise.all([
      getHome().catch(() => ({ ongoing: [], completed: [] })),
      getGenres().catch(() => []),
      getSchedule().catch(() => []),
    ]);

    const ongoingList = home.ongoing;
    const completedList = home.completed;
    const heroAnimes = [...ongoingList, ...completedList].slice(0, 10);

    const schedulePreview = schedule.slice(0, 1).flatMap((d) => d.animeList.slice(0, 6));

    return (
      <div className="space-y-8 sm:space-y-10">
        {heroAnimes.length > 0 ? <HeroCarousel animes={heroAnimes} /> : null}

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
  return (
    <div className="mx-auto max-w-\[1520px\] px-4 sm:px-6 lg:px-8 py-6">
      <HomeContent />
    </div>
  );
}


