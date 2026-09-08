"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getHistory, type HistoryItem } from "@/lib/utils/storage";
import { Clock, Play, Film } from "lucide-react";
import { useDragScroll } from "@/hooks/use-drag-scroll";
import { cn } from "@/lib/utils/cn";

export function ContinueWatching() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const { ref, onMouseDown, onTouchStart, onMouseLeave, onMouseUp, isDragging } = useDragScroll();

  useEffect(() => {
    setItems(getHistory().slice(0, 6));
  }, []);

  if (!items.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <span className="h-5 w-1 rounded-full bg-[#d50032] hidden sm:block" />
        <Clock className="h-[18px] w-[18px] text-[#d50032] sm:hidden" />
        <h2 className="text-[15px] font-bold tracking-tight text-white sm:text-[17px]">Lanjutkan Menonton</h2>
      </div>
      <div
        ref={ref}
        data-lenis-prevent
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onMouseUp}
        className={cn(
          "flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 select-none cursor-grab active:cursor-grabbing",
          isDragging ? "snap-none scroll-auto" : "scroll-smooth snap-x"
        )}
      >
        {items.map((it) => (
          <Link
            key={it.animeSlug}
            href={`/watch/${it.episodeSlug}`}
            className="group relative w-[260px] shrink-0 overflow-hidden rounded-xl bg-[#0c0c0c] border border-[#1c1c1c] hover:border-[#2a2a2a] hover:bg-[#141414] transition snap-start"
            draggable={false}
          >
            <div className="flex gap-3 p-3">
              {it.animePoster ? (
                <img
                  src={it.animePoster}
                  alt={it.animeTitle}
                  draggable={false}
                  className="h-20 w-14 rounded-lg object-cover bg-[#111] border border-[#1c1c1c] pointer-events-none"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                    const ph = (e.currentTarget.nextElementSibling as HTMLElement | null);
                    if (ph) ph.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="h-20 w-14 rounded-lg bg-[#111] border border-[#1c1c1c] items-center justify-center shrink-0"
                style={{ display: it.animePoster ? "none" : "flex" }}
              >
                <Film className="h-5 w-5 text-[#52525c]" />
              </div>
              <div className="flex flex-1 flex-col justify-center min-w-0">
                <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-white group-hover:text-white">{it.animeTitle}</p>
                <p className="text-xs font-medium text-[#a0a0a0] mt-1">Episode {it.episodeNumber ?? "?"}</p>
                <p className="text-[11px] text-[#707070] mt-1">{new Date(it.updatedAt).toLocaleDateString("id-ID")}</p>
              </div>
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d50032] text-white shadow-[0_2px_8px_rgba(213,0,50,0.3)] group-hover:bg-[#e8003a] transition">
                  <Play className="h-4 w-4 fill-white ml-0.5" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
