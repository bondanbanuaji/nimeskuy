"use client";

import Link from "next/link";
import type { AnimeCard } from "@/types/anime";
import { Play, Star, VolumeX, Volume2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type HeroDetail = {
  synopsis?: string[];
  year?: string | null;
  duration?: string | null;
};

export function Hero({ anime }: { anime: AnimeCard }) {
  if (!anime) return null;
  return <HeroCarousel animes={[anime]} />;
}

export function HeroCarousel({ animes }: { animes: AnimeCard[] }) {
  const list = animes.slice(0, 10);
  const [current, setCurrent] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [detail, setDetail] = useState<HeroDetail | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const idleRef = useRef<NodeJS.Timeout | null>(null);

  const anime = list[current] ?? list[0];
  if (!anime) return null;

  const SLIDE_MS = 15000;

  useEffect(() => {
    if (list.length <= 1) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % list.length), SLIDE_MS);
    timerRef.current = id;
    return () => clearInterval(id);
  }, [list.length]);

  const goTo = (i: number) => {
    setCurrent(i);
    setShowTrailer(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      const id = setInterval(() => setCurrent((c) => (c + 1) % list.length), SLIDE_MS);
      timerRef.current = id;
    }
  };

  // trailer autoplay setelah bengong 5s
  useEffect(() => {
    setShowTrailer(false);
    const resetIdle = () => {
      setShowTrailer(false);
      if (idleRef.current) clearTimeout(idleRef.current);
      idleRef.current = setTimeout(() => setShowTrailer(true), 5000);
    };
    resetIdle();
    const events: (keyof WindowEventMap)[] = ["mousemove", "mousedown", "keydown", "touchstart", "wheel"];
    const handler = () => resetIdle();
    events.forEach((e) => window.addEventListener(e, handler, { passive: true } as any));
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      if (idleRef.current) clearTimeout(idleRef.current);
      events.forEach((e) => window.removeEventListener(e, handler as any));
      window.removeEventListener("scroll", handler as any);
    };
  }, [current]);

  // fetch synopsis/metadata dari Sanka detail untuk description
  const [trailerSrc, setTrailerSrc] = useState<string>("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const fallback = (anime as unknown as { trailerUrl?: string }).trailerUrl ?? null;
    if (fallback) {
      setTrailerSrc(fallback);
    } else {
      setTrailerSrc("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
    }
    // ambil synopsis/year/duration
    fetch(`/api/anime/${encodeURIComponent(anime.slug)}`)
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        const data = j?.data as Record<string, unknown> | undefined;
        if (!data) return;
        const syn = (data.synopsis as { paragraphs?: string[] })?.paragraphs ?? (data.synopsis as string[] | undefined);
        const synArr = Array.isArray(syn) ? syn : Array.isArray((data as unknown as { synopsis?: string[] }).synopsis) ? (data as unknown as { synopsis: string[] }).synopsis : [];
        const t = (data.trailer as string) ?? (data.trailerUrl as string) ?? (data.youtube as string) ?? null;
        if (t && typeof t === "string" && t.startsWith("http")) setTrailerSrc(t);
        setDetail({
          synopsis: synArr as string[],
          year: (data.aired as string) ?? (data.year as string) ?? null,
          duration: (data.duration as string) ?? null,
        });
      })
      .catch(() => {});
    // ambil banner high-res biar gak burik — Jikan large_image_url, fallback ke poster Sanka
    fetch(`/api/anime/banner/${encodeURIComponent(anime.slug)}`)
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        const b = j?.data?.banner as string | undefined;
        if (b && typeof b === "string" && b.startsWith("http")) setBannerUrl(b);
        else setBannerUrl(null);
      })
      .catch(() => {
        if (!cancelled) setBannerUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [anime.slug, anime]);

  const description = detail?.synopsis?.join(" ") ?? "";
  // Year dari aired/year — extract 4 digit
  const rawYear = detail?.year ?? (detail as unknown as { aired?: string })?.aired ?? null;
  const yearMatch = rawYear ? String(rawYear).match(/(19|20)\d{2}/) : null;
  const year = yearMatch ? yearMatch[0] : null;
  const duration = detail?.duration ?? null;
  const season = anime.season ? String(anime.season) : null;
  const episodes = anime.episodes ? `${anime.episodes} ${anime.episodes === 1 ? "Episode" : "Episodes"}` : null;
  const genres = anime.genres?.slice(0, 3).map((g) => g.name).join(", ") ?? null;
  const status = anime.status ? String(anime.status).toUpperCase() : null;

  const getStatusStyle = (s: string | null) => {
    if (!s) return "bg-white/10 text-white border border-white/15";
    const u = s.toUpperCase();
    if (u.includes("ONGOING")) return "bg-[#d50032] text-white border border-[#d50032]";
    if (u.includes("COMPLETED")) return "bg-[#46d369] text-black border border-[#46d369]";
    if (u.includes("UPCOMING")) return "bg-[#f5c518] text-black border border-[#f5c518]";
    return "bg-white/10 text-white border border-white/15";
  };

  return (
    <div className="relative overflow-hidden bg-black border-0 rounded-none min-h-[62svh] sm:min-h-[68svh] lg:min-h-[70vh] flex flex-col justify-end -mt-[calc(var(--site-header-h)+1.5rem)] mx-[calc(50%-50vw)] w-screen max-w-none">
      {/* background — full width cinematic, pakai banner high-res biar gak burik */}
      <div key={anime.slug} className="absolute inset-0">
        <img
          src={bannerUrl ?? anime.poster}
          alt={anime.title}
          className="h-full w-full object-cover"
          loading={current === 0 ? "eager" : "lazy"}
          // @ts-ignore
          style={{ objectPosition: "center 20%" }}
          // @ts-ignore — referensi context7: pakai large_image_url dari Jikan biar gak burik
          fetchPriority={current === 0 ? "high" : "auto"}
        />
        {/* overlay sesuai spec: kiri lebih gelap, bawah gelap */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,.85) 0%, rgba(0,0,0,.55) 45%, rgba(0,0,0,.12) 100%), linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,0) 58%), rgba(0,0,0,.18)",
          }}
        />
        {/* inner shadow kedalam biar bawah gak kaku */}
        <div className="absolute inset-0 shadow-[inset_0_-90px_80px_rgba(0,0,0,0.65),inset_0_-30px_30px_rgba(0,0,0,0.45)] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 via-black/20 to-transparent pointer-events-none" />
        {showTrailer && (
          <video
            key={`${anime.slug}-trailer`}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            preload="auto"
            poster={anime.poster}
            src={trailerSrc}
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
        )}
        {/* subtle top fade biar header tetap readable saat transparan */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* content — kiri, konsisten ukurannya jangan fleksibel */}
      <div className="relative mx-auto flex w-full max-w-[1520px] min-h-[380px] sm:min-h-[420px] lg:min-h-[440px] flex-col justify-between gap-0 p-4 sm:p-8 lg:p-10 pt-[calc(var(--site-header-h)+2rem)] sm:pt-[calc(var(--site-header-h)+3rem)] lg:pt-[calc(var(--site-header-h)+4rem)] pb-8 sm:pb-10">
        <div className="w-full sm:w-[640px] max-w-[640px] shrink-0 space-y-3 sm:space-y-4">
          {/* badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[#d50032] px-3 py-1 text-[11px] font-black tracking-widest text-white">FEATURED</span>
          </div>

          {/* title — focal */}
          <h1 className="text-[28px] font-black leading-[0.95] tracking-tight text-white sm:text-[36px] lg:text-[44px] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] line-clamp-3">
            {anime.title}
          </h1>

          {/* metadata row tepat di bawah judul — ⭐ Rating · Year · Season · Episodes · Genres · [Status] */}
          <div className="flex flex-wrap items-center gap-2 text-[13px] sm:text-sm leading-none">
            {/* rating — gold prominent */}
            {anime.score && (
              <span className="inline-flex items-center gap-1 font-bold text-[#f5c518]">
                <Star className="h-4 w-4 fill-[#f5c518] text-[#f5c518]" aria-hidden />
                {anime.score}
              </span>
            )}
            {year && (
              <>
                {(anime.score || false) && <span className="text-white/30" aria-hidden>·</span>}
                <span className="font-medium text-white/70">{year}</span>
              </>
            )}
            {season && (
              <>
                {(anime.score || year) && <span className="text-white/30" aria-hidden>·</span>}
                <span className="font-medium text-white/70">{season}</span>
              </>
            )}
            {episodes && (
              <>
                {(anime.score || year || season) && <span className="text-white/30" aria-hidden>·</span>}
                <span className="font-medium text-white/70">{episodes}</span>
              </>
            )}
            {genres && (
              <>
                {(anime.score || year || season || episodes) && <span className="text-white/30" aria-hidden>·</span>}
                <span className="font-medium text-white/70">{genres}</span>
              </>
            )}
            {status && (
              <>
                {(anime.score || year || season || episodes || genres) && <span className="text-white/30" aria-hidden>·</span>}
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-black tracking-widest ${getStatusStyle(status)}`}>{status}</span>
              </>
            )}
          </div>

          {/* description — line-clamp 2-3 */}
          {description ? (
            <p className="line-clamp-2 max-w-[560px] text-[13.5px] leading-6 text-white/80 sm:line-clamp-3 sm:text-[14.5px] sm:leading-7">
              {description}
            </p>
          ) : (
            <p className="line-clamp-2 max-w-[520px] text-[13.5px] leading-6 text-white/70 sm:text-[14px]">Streaming anime sub Indo terbaru — tersedia di NimeSkuy via Sanka.</p>
          )}

          {/* CTA */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              href={`/anime/${anime.slug}`}
              aria-label={`Tonton ${anime.title}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#d50032] px-7 py-3.5 text-[13px] font-black tracking-wide text-white hover:bg-[#e8003a] transition shadow-[0_8px_24px_rgba(213,0,50,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Play className="h-4 w-4 fill-white" aria-hidden /> Tonton
            </Link>
            <Link
              href={`/anime/${anime.slug}`}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-[13px] font-bold text-white backdrop-blur border border-white/15 hover:bg-white/15 transition"
            >
              Detail
            </Link>
          </div>
        </div>

        {/* bottom row: indicator kiri, mute kanan */}
        <div className="mt-6 flex items-end justify-between gap-4 sm:mt-8">
          {list.length > 1 ? (
            <div className="flex items-center gap-1" role="tablist" aria-label="Hero carousel">
              {list.map((_, i) => {
                const active = i === current;
                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    role="tab"
                    aria-selected={active}
                    aria-label={`Ke slide ${i + 1} dari ${list.length}: ${list[i].title}`}
                    className="flex items-center justify-center px-1.5 min-h-[40px] group/dot touch-manipulation cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full"
                  >
                    {active ? (
                      <span className="block relative w-10 sm:w-12 h-1.5 rounded-full bg-white/25 overflow-hidden">
                        <span key={current} className="hero-progress-fill absolute inset-y-0 left-0 bg-white" style={{ animation: `hero-progress ${SLIDE_MS}ms linear forwards` }} />
                      </span>
                    ) : (
                      <span className="block w-2.5 h-2.5 rounded-full bg-white/40 transition-colors group-hover/dot:bg-white/70" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div />
          )}

          {/* mute — hanya jika trailer ada */}
          <button
            onClick={() => setIsMuted((m) => !m)}
            aria-label={isMuted ? "Unmute trailer" : "Mute trailer"}
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur border border-white/15 hover:bg-black/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>


    </div>
  );
}
