"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getHistory, removeHistory, clearHistory, type HistoryItem } from "@/lib/utils/storage";
import { EmptyState } from "@/components/ui/empty-state";
import { Trash, Clock, Play, Film } from "lucide-react";

export default function HistoryPage() {
  const [list, setList] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setList(getHistory());
  }, []);

  function onRemove(slug: string) {
    removeHistory(slug);
    setList(getHistory());
  }
  function onClear() {
    clearHistory();
    setList([]);
  }

  if (list.length === 0) {
    return (
      <div className="mx-auto max-w-\[1520px\] px-4 py-12">
        <EmptyState
          title="Belum ada riwayat"
          description="Riwayat menontonmu akan muncul di sini."
          icon="film"
          action={<Link href="/" className="rounded-full bg-[#d50032] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#e8003a] transition">Mulai Menonton</Link>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-\[1520px\] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[22px] font-black tracking-tight text-white flex items-center gap-2.5">
            <span className="h-6 w-1 rounded-full bg-[#d50032]" />
            <Clock className="h-5 w-5 text-[#d50032]" /> Riwayat
          </h1>
          <p className="text-[13px] text-[#a0a0a0] pl-3.5">{list.length} anime terakhir ditonton</p>
        </div>
        <button onClick={onClear} className="rounded-full bg-[#111] border border-[#1c1c1c] px-4 py-2 text-[13px] font-semibold text-[#a0a0a0] hover:text-white hover:bg-[#141414] hover:border-[#2a2a2a] transition">
          Hapus semua
        </button>
      </div>

      <div className="space-y-2.5">
        {list.map((it) => (
          <div key={it.animeSlug} className="flex items-center gap-4 rounded-xl bg-[#0c0c0c] border border-[#1c1c1c] p-3 hover:border-[#2a2a2a] transition">
            {it.animePoster ? (
              <img
                src={it.animePoster}
                alt={it.animeTitle}
                className="h-20 w-14 rounded-lg object-cover bg-[#111] border border-[#1c1c1c] shrink-0"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  const ph = e.currentTarget.nextElementSibling as HTMLElement | null;
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
            <div className="flex-1 min-w-0">
              <Link href={`/anime/${it.animeSlug}`} className="line-clamp-1 text-[13px] font-bold text-white hover:text-[#ff3d2e] transition">
                {it.animeTitle}
              </Link>
              <p className="text-xs font-medium text-[#a0a0a0] mt-0.5">Episode {it.episodeNumber ?? "?"} • {new Date(it.updatedAt).toLocaleString("id-ID")}</p>
              <p className="text-xs text-[#707070] truncate">{it.episodeTitle}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/watch/${it.episodeSlug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#d50032] px-4 py-2 text-[13px] font-bold text-white hover:bg-[#e8003a] shadow-sm transition"
              >
                <Play className="h-3.5 w-3.5 fill-white" /> Lanjut
              </Link>
              <button
                onClick={() => onRemove(it.animeSlug)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111] border border-[#1c1c1c] text-[#a0a0a0] hover:bg-[#d50032] hover:text-white hover:border-[#d50032] transition"
                aria-label="Hapus"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


