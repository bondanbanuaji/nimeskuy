"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import type { EpisodeInfo } from "@/types/anime";
import { Search, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function EpisodeList({
  episodes,
  currentSlug,
  variant = "detail",
}: {
  episodes: EpisodeInfo[];
  currentSlug?: string;
  variant?: "detail" | "watch";
}) {
  const [q, setQ] = useState("");
  const [asc, setAsc] = useState(false);

  const filtered = useMemo(() => {
    let list = [...episodes];
    list.sort((a, b) => {
      const na = a.number ?? 0;
      const nb = b.number ?? 0;
      return asc ? na - nb : nb - na;
    });
    if (q.trim()) {
      const lower = q.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(lower) ||
          String(e.number).includes(lower) ||
          e.slug.toLowerCase().includes(lower)
      );
    }
    return list;
  }, [episodes, q, asc]);

  if (!episodes.length) {
    return <div className="py-8 text-center text-sm text-[#707070]">Belum ada episode.</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#707070] group-focus-within:text-[#a0a0a0]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari episode..."
            className="w-full rounded-full bg-[#111] border border-[#1c1c1c] py-2.5 pl-10 pr-4 text-[13.5px] font-medium text-white placeholder:text-[#707070] focus:outline-none focus:border-[#2a2a2a] focus:bg-[#141414] transition"
          />
        </div>
        <button
          onClick={() => setAsc(!asc)}
          className="inline-flex items-center gap-2 rounded-full bg-[#111] border border-[#1c1c1c] px-4 py-2.5 text-[13px] font-semibold text-[#a0a0a0] hover:bg-[#141414] hover:text-white hover:border-[#2a2a2a] transition"
        >
          <ArrowUpDown className="h-4 w-4" />
          {asc ? "Terlama" : "Terbaru"}
        </button>
      </div>

      <div
        className={cn(
          variant === "watch"
            ? "grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10"
            : "grid grid-cols-1 gap-2"
        )}
      >
        {filtered.map((ep) => {
          const isActive = currentSlug === ep.slug;
          if (variant === "watch") {
            return (
              <Link
                key={ep.slug}
                href={`/watch/${ep.slug}`}
                aria-label={`Episode ${ep.number ?? ep.title}`}
                className={cn(
                  "flex h-11 min-h-[44px] items-center justify-center rounded-xl border text-[13px] font-bold transition",
                  isActive
                    ? "bg-[#d50032] border-[#d50032] text-white shadow-[0_2px_10px_rgba(213,0,50,0.3)]"
                    : "bg-[#111] border-[#1c1c1c] text-[#a0a0a0] hover:bg-[#141414] hover:text-white hover:border-[#2a2a2a]"
                )}
              >
                {ep.number ?? "?"}
              </Link>
            );
          }
          return (
            <Link
              key={ep.slug}
              href={`/watch/${ep.slug}`}
              className={cn(
                "flex items-center justify-between rounded-xl border px-4 py-3 transition group",
                isActive
                  ? "bg-[#d50032]/10 border-[#d50032]/30 text-white"
                  : "bg-[#111] border-[#1c1c1c] hover:bg-[#141414] hover:border-[#2a2a2a] text-[#a0a0a0] hover:text-white"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black",
                    isActive ? "bg-[#d50032] text-white" : "bg-[#0c0c0c] border border-[#1c1c1c] text-[#707070] group-hover:text-white"
                  )}
                >
                  {ep.number ?? "?"}
                </span>
                <span className="truncate text-[13px] font-medium">{ep.title}</span>
              </div>
              <span className="ml-2 shrink-0 text-xs text-[#707070]">{ep.date ?? ""}</span>
            </Link>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="py-8 text-center text-sm text-[#707070]">Tidak ada episode yang cocok.</div>
      )}
    </div>
  );
}
