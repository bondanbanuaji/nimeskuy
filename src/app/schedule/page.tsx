import { getSchedule } from "@/lib/api/sanka";
import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/empty-state";
import { AnimeCard } from "@/components/anime/anime-card";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Jadwal Rilis Anime",
  description: "Jadwal rilis anime harian di NimeSkuy — Sanka API",
};

const dayOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default async function SchedulePage() {
  try {
    const schedule = await getSchedule();
    if (!schedule.length) {
      return (
        <div className="mx-auto max-w-\[1520px\] px-4 py-12">
          <EmptyState title="Jadwal tidak tersedia" description="Gagal memuat jadwal." />
        </div>
      );
    }

    const sorted = [...schedule].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

    return (
      <div className="mx-auto max-w-\[1520px\] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-[22px] font-black tracking-tight text-white sm:text-2xl">Jadwal Rilis</h1>
          <p className="text-[13px] text-[#a0a0a0]">Jadwal anime tayang per hari — Sanka</p>
        </div>

        <div className="space-y-8">
          {sorted.map((day) => (
            <section key={day.day} className="space-y-3">
              <h2 className="text-[15px] font-bold tracking-tight text-white flex items-center gap-2.5">
                <span className="h-5 w-1 rounded-full bg-[#d50032]" />
                {day.day}
                <span className="rounded-full bg-[#111] border border-[#1c1c1c] px-2.5 py-0.5 text-xs font-semibold text-[#707070]">{day.animeList.length} anime</span>
              </h2>
              {day.animeList.length === 0 ? (
                <p className="text-sm text-[#707070] pl-3.5">Tidak ada anime.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {day.animeList.map((a) => (
                    <AnimeCard key={a.slug} anime={a} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    );
  } catch {
    return (
      <div className="mx-auto max-w-\[1520px\] px-4 py-12">
        <EmptyState icon="error" title="Gagal memuat jadwal" description="Coba lagi nanti." />
      </div>
    );
  }
}


