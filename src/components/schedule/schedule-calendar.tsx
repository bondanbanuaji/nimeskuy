"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { ScheduleDay, AnimeCard } from "@/types/anime";
import { AnimeCard as AnimeCardView } from "@/components/anime/anime-card";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Sparkles } from "lucide-react";

const dayOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"] as const;
const dayShort: Record<string, string> = {
  Senin: "SEN",
  Selasa: "SEL",
  Rabu: "RAB",
  Kamis: "KAM",
  Jumat: "JUM",
  Sabtu: "SAB",
  Minggu: "MIN",
};

function getTodayName(): string {
  const d = new Date().getDay(); // 0 minggu
  const map: Record<number, string> = { 0: "Minggu", 1: "Senin", 2: "Selasa", 3: "Rabu", 4: "Kamis", 5: "Jumat", 6: "Sabtu" };
  return map[d];
}

function getWeekDates(weekOffset = 0): Record<string, Date> {
  const now = new Date();
  const day = now.getDay(); // 0-6 sun-sat
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);
  const out: Record<string, Date> = {};
  dayOrder.forEach((name, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    out[name] = d;
  });
  return out;
}

function MiniRow({ anime }: { anime: AnimeCard }) {
  return (
    <Link
      href={`/anime/${anime.slug}`}
      className="group flex gap-2.5 rounded-xl border border-transparent p-1.5 hover:border-[#1c1c1c] hover:bg-[#111] transition"
    >
      <img
        src={anime.poster}
        alt={`${anime.title} anime poster`}
        loading="lazy"
        className="h-[62px] w-[42px] shrink-0 rounded-lg object-cover bg-[#111] border border-[#1c1c1c] group-hover:border-[#2a2a2a]"
      />
      <div className="min-w-0 flex-1 py-0.5">
        <p className="line-clamp-2 text-[12.5px] font-semibold leading-[1.35] text-[#f0f0f0] group-hover:text-white">{anime.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {anime.score && (
            <span className="inline-flex items-center rounded-md bg-[#f5c518]/15 border border-[#f5c518]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#f5c518] leading-none">
              ★ {anime.score}
            </span>
          )}
          <span className="text-[11px] text-[#707070]">{anime.episodes ? `${anime.episodes} eps` : "—"}</span>
        </div>
      </div>
    </Link>
  );
}

export function ScheduleCalendar({ schedule }: { schedule: ScheduleDay[] }) {
  const sorted = useMemo(() => [...schedule].sort((a, b) => dayOrder.indexOf(a.day as never) - dayOrder.indexOf(b.day as never)), [schedule]);
  const map = useMemo(() => new Map(sorted.map((d) => [d.day, d])), [sorted]);

  const [today, setToday] = useState<string>("Senin");
  const [selected, setSelected] = useState<string>("Senin");
  const [mounted, setMounted] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const monthLabel = useMemo(() => {
    // pakai hari tengah minggu (Kamis) biar label akurat walau minggu nyebrang bulan
    const mid = weekDates["Kamis"] ?? new Date();
    return mid.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  }, [weekDates]);

  useEffect(() => {
    setMounted(true);
    const t = getTodayName();
    setToday(t);
    // default selected = today if has data else first day with anime else Senin
    if (map.has(t)) setSelected(t);
    else {
      const firstWith = sorted.find((d) => d.animeList.length > 0)?.day ?? dayOrder[0];
      setSelected(firstWith);
    }
  }, [sorted, map]);

  const selectedDay = map.get(selected);
  const total = sorted.reduce((a, b) => a + b.animeList.length, 0);

  return (
    <div className="space-y-5">
      {/* header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#d50032]/10 border border-[#d50032]/20 px-3 py-1 text-[11px] font-black tracking-widest text-[#ff6568] uppercase">
            <CalendarIcon className="h-3.5 w-3.5" /> Kalender Tayang
          </div>
          <h1 className="text-[26px] font-black tracking-tight text-white sm:text-[28px] leading-none">Jadwal Rilis</h1>
          <p className="text-[13px] leading-5 text-[#a0a0a0] max-w-[560px]">
            Kalender mingguan anime — <span className="text-[#f0f0f0] font-semibold capitalize">{monthLabel}</span> · {total} anime terjadwal · klik hari untuk lihat detail
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-[#0c0c0c] border border-[#1c1c1c] p-1">
            <button
              aria-label="Minggu sebelumnya"
              className="h-7 w-7 grid place-items-center rounded-full text-[#707070] hover:text-white hover:bg-[#1c1c1c] transition active:scale-95"
              onClick={() => setWeekOffset((o) => o - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs font-bold tracking-wide text-white capitalize min-w-[124px] text-center">{monthLabel}</span>
            <button
              aria-label="Minggu selanjutnya"
              className="h-7 w-7 grid place-items-center rounded-full text-[#707070] hover:text-white hover:bg-[#1c1c1c] transition active:scale-95"
              onClick={() => setWeekOffset((o) => o + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => {
              setWeekOffset(0);
              setSelected(today);
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#d50032] px-4 py-2 text-xs font-black tracking-wide text-white hover:bg-[#e8003a] transition shadow-[0_6px_16px_rgba(213,0,50,0.3)] active:scale-95"
          >
            <Clock className="h-3.5 w-3.5" /> Hari ini
          </button>
        </div>
      </div>

      {/* day strip - mobile + desktop mini */}
      <div data-lenis-prevent className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 sm:gap-2.5 w-max sm:w-full sm:grid sm:grid-cols-7">
          {dayOrder.map((day) => {
            const info = map.get(day);
            const count = info?.animeList.length ?? 0;
            const isToday = mounted && day === today;
            const isSelected = day === selected;
            const date = weekDates[day];
            const dateNum = date.getDate();
            return (
              <button
                key={day}
                onClick={() => setSelected(day)}
                className={cn(
                  "group relative flex min-w-[92px] sm:min-w-0 flex-col items-center gap-1 rounded-2xl border px-3 py-3 text-center transition sm:px-2 sm:py-3",
                  isSelected
                    ? "bg-[#d50032] border-[#d50032] text-white shadow-[0_8px_20px_rgba(213,0,50,0.35)]"
                    : isToday
                      ? "bg-[#d50032]/10 border-[#d50032]/30 text-white hover:bg-[#d50032]/15"
                      : "bg-[#0c0c0c] border-[#1c1c1c] text-[#a0a0a0] hover:bg-[#111] hover:text-white hover:border-[#2a2a2a]"
                )}
              >
                <span className={cn("text-[10px] font-black tracking-[0.14em]", isSelected ? "text-white/80" : "text-[#707070] group-hover:text-[#a0a0a0]")}>
                  {dayShort[day]}
                </span>
                <span className={cn("text-[22px] font-black leading-none tracking-tight", isSelected ? "text-white" : isToday ? "text-white" : "text-white")}>{dateNum}</span>
                <span className={cn("text-[11px] font-bold leading-none", isSelected ? "text-white" : "text-[#707070]")}>{day}</span>
                <span
                  className={cn(
                    "mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold leading-none",
                    isSelected ? "bg-white text-[#d50032]" : count > 0 ? "bg-[#1c1c1c] text-[#a0a0a0] border border-[#2a2a2a]" : "bg-transparent text-[#52525c] border border-dashed border-[#2a2a2a]"
                  )}
                >
                  {count} anime
                </span>
                {isToday && <span className={cn("absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#d50032] ring-2 ring-black", isSelected && "bg-white ring-[#d50032]")} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* calendar grid - desktop */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-[#1c1c1c] bg-[#0c0c0c]">
        {/* weekday header */}
        <div className="grid grid-cols-7 divide-x divide-[#1c1c1c] border-b border-[#1c1c1c] bg-[#111]">
          {dayOrder.map((day) => {
            const isToday = mounted && day === today;
            const isSelected = day === selected;
            const count = map.get(day)?.animeList.length ?? 0;
            return (
              <button
                key={day}
                onClick={() => setSelected(day)}
                className={cn(
                  "flex items-center justify-between gap-2 px-3 py-3 text-left transition",
                  isSelected ? "bg-[#d50032] text-white" : isToday ? "bg-[#d50032]/10 text-white" : "text-[#a0a0a0] hover:bg-[#0c0c0c] hover:text-white"
                )}
              >
                <div className="min-w-0">
                  <div className={cn("text-[11px] font-black tracking-widest", isSelected ? "text-white/80" : "text-[#707070]")}>{dayShort[day]}</div>
                  <div className="text-[13px] font-bold leading-none truncate">{day}</div>
                </div>
                <span className={cn("shrink-0 rounded-full px-2 py-1 text-[11px] font-black leading-none", isSelected ? "bg-white text-[#d50032]" : "bg-[#1c1c1c] border border-[#2a2a2a] text-[#f0f0f0]")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* body - 7 columns */}
        <div className="grid grid-cols-7 divide-x divide-[#1c1c1c] min-h-[420px] bg-[#0c0c0c]">
          {dayOrder.map((day) => {
            const info = map.get(day);
            const list = info?.animeList ?? [];
            const isToday = mounted && day === today;
            const isSelected = day === selected;
            return (
              <div
                key={day}
                className={cn(
                  "relative flex flex-col",
                  isToday && "bg-[#d50032]/[0.03]",
                  isSelected && "bg-[#d50032]/[0.06]"
                )}
              >
                {isSelected && <div className="absolute inset-x-0 top-0 h-[2px] bg-[#d50032]" />}
                {isToday && !isSelected && <div className="absolute inset-x-0 top-0 h-[2px] bg-[#d50032]/50" />}
                <div className="p-2 flex-1">
                  {list.length === 0 ? (
                    <div className="grid place-items-center rounded-xl border border-dashed border-[#1c1c1c] bg-[#111]/50 px-3 py-10 text-center">
                      <div className="space-y-1">
                        <div className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-[#1c1c1c] text-[#52525c]">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <p className="text-xs font-semibold text-[#707070]">Libur</p>
                        <p className="text-[11px] text-[#52525c]">Tidak ada tayang</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {list.map((a) => (
                        <MiniRow key={a.slug} anime={a} />
                      ))}
                    </div>
                  )}
                </div>
                {/* footer count */}
                <div className="sticky bottom-0 border-t border-[#1c1c1c] bg-[#0c0c0c]/90 backdrop-blur px-2.5 py-2 text-[11px] font-medium text-[#707070] flex items-center justify-between">
                  <span>{list.length} judul</span>
                  {isToday && <span className="h-1.5 w-1.5 rounded-full bg-[#d50032] animate-pulse" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* mobile / tablet detail - selected day */}
      <div className="lg:hidden overflow-hidden rounded-2xl border border-[#1c1c1c] bg-[#0c0c0c]">
        <div className="flex items-center justify-between gap-3 border-b border-[#1c1c1c] bg-[#111] px-4 py-3">
          <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-[#d50032]" />
            {selected}
            <span className="rounded-full bg-[#1c1c1c] border border-[#2a2a2a] px-2 py-0.5 text-xs font-semibold text-[#a0a0a0]">
              {selectedDay?.animeList.length ?? 0} anime
            </span>
            {mounted && selected === today && <span className="rounded-full bg-[#d50032] px-2 py-0.5 text-[11px] font-black text-white">HARI INI</span>}
          </h2>
          <span className="text-xs text-[#707070] hidden sm:inline">
            {weekDates[selected]?.toLocaleDateString("id-ID", { day: "numeric", month: "long" })}
          </span>
        </div>

        {!selectedDay || selectedDay.animeList.length === 0 ? (
          <div className="grid place-items-center px-6 py-16 text-center">
            <div className="space-y-2">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#111] border border-[#1c1c1c] text-[#52525c]">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-white">Tidak ada anime hari {selected}</p>
              <p className="text-xs text-[#707070]">Coba pilih hari lain di kalender atas</p>
            </div>
          </div>
        ) : (
          <div className="p-3 sm:p-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {selectedDay.animeList.map((a) => (
                <AnimeCardView key={a.slug} anime={a} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* desktop selected preview - optional, shows full cards for selected day below calendar */}
      <div className="hidden lg:block rounded-2xl border border-[#1c1c1c] bg-[#0c0c0c] p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="h-4 w-1 rounded-full bg-[#d50032]" /> {selected} — Detail
            <span className="rounded-full bg-[#111] border border-[#1c1c1c] px-2.5 py-1 text-xs text-[#707070]">{selectedDay?.animeList.length ?? 0} judul</span>
          </h3>
          <span className="text-xs text-[#707070]">
            {mounted && weekDates[selected]?.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
        {!selectedDay || selectedDay.animeList.length === 0 ? (
          <p className="text-sm text-[#707070]">Tidak ada anime untuk hari ini.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3 xl:grid-cols-6">
            {selectedDay.animeList.map((a) => (
              <AnimeCardView key={a.slug} anime={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
