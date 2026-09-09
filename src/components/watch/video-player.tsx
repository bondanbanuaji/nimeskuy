"use client";

import { useState } from "react";
import { isAllowedEmbedUrl } from "@/lib/config";

export function VideoPlayer({ src, title }: { src: string | null; title?: string }) {
  const [error, setError] = useState<string | null>(null);

  if (!src) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-[#0c0c0c] border border-[#1c1c1c] text-[#a0a0a0]">
        <div className="text-center p-6">
          <p className="font-semibold text-white">Video belum dapat diputar</p>
          <p className="text-sm mt-1 text-[#707070]">Pilih sumber tayang lain atau muat ulang halaman.</p>
        </div>
      </div>
    );
  }

  if (!isAllowedEmbedUrl(src)) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-[#0c0c0c] border border-[#1c1c1c] text-[#a0a0a0]">
        <p>Video belum dapat diputar.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black border border-[#1c1c1c]">
      <div className="relative aspect-video w-full">
        <iframe
          key={src}
          src={src}
          title={title ?? "Video Player"}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
          onError={() => setError("Video gagal dimuat. Silakan coba lagi.")}
        />
      </div>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur text-white text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
