"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { AnimeCard as AnimeCardType } from "@/types/anime";
import { Star, Play } from "lucide-react";
import { useDragScroll } from "@/hooks/use-drag-scroll";

export function AnimeCard({ anime, className }: { anime: AnimeCardType; className?: string }) {
  return (
    <Link
      href={`/anime/${anime.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl bg-[#0c0c0c] border border-[#1c1c1c] hover:border-[#2a2a2a] hover:bg-[#141414] transition-all duration-200",
        className
      )}
      draggable={false}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-[#111]">
        <img
          src={anime.poster}
          alt={`${anime.title} anime poster`}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06] pointer-events-none"
        />
        {/* subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

        {/* Top badges */}
        <div className="absolute left-2 top-2 right-2 flex items-start justify-between gap-1.5">
          <div className="flex flex-col gap-1.5">
            {anime.score && (
              <span className="inline-flex items-center gap-1 rounded-md bg-black/75 backdrop-blur px-1.5 py-1 text-[11px] font-bold leading-none text-[#f5c518] border border-white/10 shadow-sm">
                <Star className="h-3 w-3 fill-[#f5c518] text-[#f5c518]" />
                {anime.score}
              </span>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {anime.status && (
              <span
                className={cn(
                  "rounded-md px-1.5 py-1 text-[10px] font-black uppercase tracking-wider leading-none text-white shadow-sm",
                  anime.status.toLowerCase().includes("ongoing") || anime.status.toLowerCase().includes("airing")
                    ? "bg-[#d50032]"
                    : anime.status.toLowerCase().includes("completed")
                      ? "bg-[#46d369] text-black"
                      : "bg-[#1c1c1c] border border-[#2a2a2a] text-[#f0f0f0]"
                )}
              >
                {anime.status}
              </span>
            )}
            {anime.studios && !anime.status && (
              <span className="rounded-md bg-black/70 backdrop-blur px-1.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white border border-white/10">
                {anime.studios}
              </span>
            )}
          </div>
        </div>

        {/* Center play */}
        <div className="absolute inset-0 hidden items-center justify-center bg-black/25 backdrop-blur-[1px] group-hover:flex transition">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-xl scale-90 group-hover:scale-100 transition-transform">
            <Play className="h-5 w-5 fill-black ml-0.5" />
          </div>
        </div>

        {/* Bottom meta overlay inside poster (episode count) */}
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <div className="flex items-center gap-1.5">
            {anime.episodes ? (
              <span className="rounded-md bg-black/70 backdrop-blur px-1.5 py-1 text-[11px] font-semibold text-white border border-white/5">
                {anime.episodes} EPS
              </span>
            ) : null}
            {anime.season ? (
              <span className="hidden sm:inline-flex rounded-md bg-[#111]/80 backdrop-blur px-1.5 py-1 text-[10px] font-medium text-[#a0a0a0] border border-white/5">
                {anime.season}
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-[#f0f0f0] group-hover:text-white transition">
          {anime.title}
        </h3>
        <div className="flex flex-wrap items-center gap-1 text-[11px] leading-none text-[#707070]">
          {anime.latestReleaseDate ? <span className="text-[#a0a0a0]">{anime.latestReleaseDate}</span> : null}
          {anime.lastReleaseDate && !anime.latestReleaseDate ? <span className="text-[#a0a0a0]">{anime.lastReleaseDate}</span> : null}
          {anime.releaseDay ? (
            <>
              {(anime.latestReleaseDate || anime.lastReleaseDate) && <span className="h-1 w-1 rounded-full bg-[#2a2a2a]" />}
              <span>{anime.releaseDay}</span>
            </>
          ) : null}
          {anime.genres && anime.genres.length > 0 && (
            <>
              <span className="h-1 w-1 rounded-full bg-[#2a2a2a]" />
              <span className="truncate max-w-[110px]">{anime.genres.slice(0, 2).map((g) => g.name).join(" • ")}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export function AnimeGrid({ list }: { list: AnimeCardType[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {list.map((anime) => (
        <AnimeCard key={anime.slug} anime={anime} />
      ))}
    </div>
  );
}

export function AnimeCarousel({ list, title, href }: { list: AnimeCardType[]; title: string; href?: string }) {
  const { ref, onMouseDown, onTouchStart, onMouseLeave, onMouseUp, isDragging } = useDragScroll();
  if (!list.length) return null;
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[15px] font-bold tracking-tight text-white sm:text-[17px] flex items-center gap-2.5">
          <span className="h-5 w-1 rounded-full bg-[#d50032] hidden sm:block" />
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="inline-flex items-center gap-1 rounded-full bg-[#111] border border-[#1c1c1c] px-3.5 py-1.5 text-xs font-semibold text-[#a0a0a0] hover:text-white hover:bg-[#141414] hover:border-[#2a2a2a] transition"
          >
            Lihat semua
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-60"><path d="m9 18 6-6-6-6" /></svg>
          </Link>
        )}
      </div>
      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <div
          ref={ref}
          data-lenis-prevent
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchEnd={onMouseUp}
          className={cn(
            "flex gap-3 overflow-x-auto pb-3 scrollbar-hide select-none cursor-grab active:cursor-grabbing",
            isDragging ? "snap-none scroll-auto" : "scroll-smooth snap-x snap-mandatory"
          )}
        >
          {list.map((anime) => (
            <AnimeCard key={anime.slug} anime={anime} className="w-[148px] sm:w-[168px] shrink-0 snap-start" />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black to-transparent sm:hidden" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black to-transparent sm:hidden" />
      </div>
    </section>
  );
}
