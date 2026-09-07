"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, Hash, ArrowRight } from "lucide-react";
import type { Genre } from "@/types/anime";

export function GenreGrid({ genres }: { genres: Genre[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return genres;
    return genres.filter((g) => g.name.toLowerCase().includes(term) || g.slug.toLowerCase().includes(term));
  }, [q, genres]);

  return (
    <div className="space-y-5">
      {/* toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 items-center rounded-full bg-[#111] border border-[#1c1c1c] px-3 text-xs font-semibold text-[#a0a0a0]">
            {genres.length} GENRE
          </span>
          <span className="text-xs text-[#52525c]">Sanka • Otakudesu</span>
        </div>
        <div className="relative w-full sm:w-[280px] group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52525c] group-focus-within:text-[#a0a0a0] transition" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari genre..."
            className="w-full rounded-full bg-[#0c0c0c] border border-[#1c1c1c] py-2.5 pl-9 pr-4 text-[13px] font-medium text-white placeholder:text-[#52525c] focus:outline-none focus:border-[#2a2a2a] focus:bg-[#111] transition"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#1c1c1c] bg-[#0c0c0c]/50 p-10 text-center">
          <p className="text-sm font-medium text-[#a0a0a0]">Tidak ada genre untuk “{q}”</p>
          <p className="mt-1 text-xs text-[#52525c]">Coba kata kunci lain</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((g) => (
            <Link
              key={g.slug}
              href={`/genre/${g.slug}`}
              className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-xl border border-[#1c1c1c] bg-[#0c0c0c] p-5 text-center transition hover:border-[#2a2a2a] hover:bg-[#111]"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#f5c518]/0 to-transparent opacity-0 transition group-hover:via-[#f5c518]/30 group-hover:opacity-100" />
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1c1c1c] bg-[#111] text-[#707070] transition group-hover:border-[#f5c518]/20 group-hover:bg-[#f5c518]/10 group-hover:text-[#f5c518]">
                <Hash className="h-4 w-4" />
              </span>
              <div className="space-y-1">
                <div className="text-[14px] font-bold leading-none tracking-tight text-white transition group-hover:text-[#f5c518]">
                  {g.name}
                </div>
                <div className="text-[11px] font-medium tracking-widest text-[#52525c]">{g.slug}</div>
              </div>
              <span className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#1c1c1c] bg-[#111] text-[#52525c] opacity-0 transition group-hover:opacity-100 group-hover:text-[#a0a0a0]">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      )}

      <p className="pt-2 text-center text-xs text-[#52525c]">
        Klik genre untuk lihat anime — data via <span className="text-[#707070]">Sanka</span> • cache 24 jam
      </p>
    </div>
  );
}
