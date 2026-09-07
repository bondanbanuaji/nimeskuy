"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFavorites, removeFavorite, type FavoriteItem } from "@/lib/utils/storage";
import { EmptyState } from "@/components/ui/empty-state";
import { Trash, Heart, Film } from "lucide-react";

export default function FavoritesPage() {
  const [list, setList] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    setList(getFavorites());
  }, []);

  function onRemove(slug: string) {
    removeFavorite(slug);
    setList(getFavorites());
  }

  if (list.length === 0) {
    return (
      <div className="mx-auto max-w-\[1520px\] px-4 py-12">
        <EmptyState
          title="Belum ada favorit"
          description="Tambahkan anime favoritmu dengan klik tombol hati di halaman detail."
          icon="film"
          action={<Link href="/" className="rounded-full bg-[#d50032] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#e8003a] transition">Jelajahi Anime</Link>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-\[1520px\] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-[22px] font-black tracking-tight text-white flex items-center gap-2.5">
          <span className="h-6 w-1 rounded-full bg-[#d50032]" />
          <Heart className="h-5 w-5 text-[#d50032] fill-[#d50032]" /> Favorit
        </h1>
        <p className="text-[13px] text-[#a0a0a0] pl-3.5">{list.length} anime disimpan</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {list.map((fav) => (
          <div key={fav.slug} className="group relative overflow-hidden rounded-xl bg-[#0c0c0c] border border-[#1c1c1c] hover:border-[#2a2a2a] transition">
            <Link href={`/anime/${fav.slug}`}>
              <div className="relative aspect-[2/3] overflow-hidden bg-[#111]">
                <img
                  src={fav.poster}
                  alt={fav.title}
                  className="h-full w-full object-cover group-hover:scale-[1.04] transition duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                    const ph = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (ph) (ph as HTMLElement).style.display = "flex";
                  }}
                />
                <div
                  className="absolute inset-0 hidden items-center justify-center bg-[#111]"
                  style={{ display: "none" }}
                >
                  <Film className="h-6 w-6 text-[#52525c]" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none" />
              </div>
              <div className="p-2.5">
                <div className="line-clamp-2 text-[13px] font-semibold leading-snug text-white group-hover:text-white">{fav.title}</div>
                <div className="text-[11px] text-[#707070] mt-1">{new Date(fav.addedAt).toLocaleDateString("id-ID")}</div>
              </div>
            </Link>
            <button
              onClick={() => onRemove(fav.slug)}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 border border-white/10 text-white backdrop-blur hover:bg-[#d50032] hover:border-[#d50032] transition"
              aria-label="Hapus favorit"
            >
              <Trash className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


