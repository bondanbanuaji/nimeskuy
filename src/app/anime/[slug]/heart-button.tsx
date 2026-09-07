"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { isFavorite, toggleFavorite } from "@/lib/utils/storage";

// re-export icons needed by page
export { Star, Calendar, Film, Clock } from "lucide-react";

export function HeartButton({ slug, title, poster }: { slug: string; title: string; poster: string }) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(isFavorite(slug));
  }, [slug]);

  function onToggle() {
    const added = toggleFavorite({ slug, title, poster, addedAt: Date.now() });
    setFav(added);
  }

  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-[13px] font-bold transition ${
        fav
          ? "bg-[#d50032] border-[#d50032] text-white shadow-[0_2px_10px_rgba(213,0,50,0.3)]"
          : "bg-[#111] border-[#1c1c1c] text-white hover:bg-[#141414] hover:border-[#2a2a2a]"
      }`}
    >
      <Heart className={`h-4 w-4 ${fav ? "fill-white" : ""}`} />
      {fav ? "Favorit" : "Tambah Favorit"}
    </button>
  );
}
