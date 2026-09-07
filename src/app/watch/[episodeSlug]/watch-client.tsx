"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { EpisodeDetail } from "@/types/anime";
import { VideoPlayer } from "@/components/watch/video-player";
import { EpisodeList } from "@/components/anime/episode-list";
import { saveHistory } from "@/lib/utils/storage";
import { ChevronLeft, ChevronRight, List, Server } from "lucide-react";

export function WatchClient({ initialDetail, episodeSlug }: { initialDetail: EpisodeDetail; episodeSlug: string }) {
  const [activeUrl, setActiveUrl] = useState<string | null>(initialDetail.defaultStreamingUrl);
  const [activeServer, setActiveServer] = useState<string | null>(null);
  const [loadingServer, setLoadingServer] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const num = extractNumber(initialDetail.title) ?? initialDetail.episodeList.find((e) => e.slug === episodeSlug)?.number ?? null;
    saveHistory({
      animeSlug: initialDetail.animeSlug,
      animeTitle: initialDetail.title.replace(/ Episode.*$/i, ""),
      episodeSlug,
      episodeNumber: num,
      episodeTitle: initialDetail.title,
      updatedAt: Date.now(),
    });
  }, [initialDetail, episodeSlug]);

  async function selectServer(serverId: string) {
    setLoadingServer(true);
    setServerError(null);
    setActiveServer(serverId);
    try {
      const res = await fetch(`/api/server/${encodeURIComponent(serverId)}?episode=${encodeURIComponent(episodeSlug)}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message || "Gagal memuat server");
      }
      const url = json.data?.url as string;
      if (!url) throw new Error("URL tidak tersedia");
      setActiveUrl(url);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Gagal memuat server";
      setServerError(msg);
    } finally {
      setLoadingServer(false);
    }
  }

  return (
    <div className="mx-auto max-w-\[1520px\] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Player — PRD #23 Streaming Flow: Episode API → Server list → embed URL */}
      <div className="space-y-4">
        <VideoPlayer src={activeUrl} title={initialDetail.title} />
        {loadingServer && <p className="text-sm text-[#a0a0a0]">Memuat server...</p>}
        {serverError && <p className="text-sm text-red-400">{serverError} Coba server lain.</p>}
        <p className="rounded-xl bg-[#111] border border-[#1c1c1c] p-3 text-xs text-[#a0a0a0]">
          Streaming via <b className="text-white">Sanka API</b> — embed langsung. Data proxy via <code className="rounded bg-[#0c0c0c] border border-[#1c1c1c] px-1 py-0.5">/api/server/:serverId</code>.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-[16px] font-bold leading-tight text-white sm:text-[18px]">{initialDetail.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <Link href={`/anime/${initialDetail.animeSlug}`} className="text-[13px] font-medium text-[#d50032] hover:text-[#ff3d2e]">
                Lihat detail anime
              </Link>
              <span className="rounded-full bg-[#111] border border-[#1c1c1c] px-2 py-0.5 text-xs text-[#707070]">Sanka</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {initialDetail.hasPrevEpisode && initialDetail.prevEpisode ? (
              <Link
                href={`/watch/${initialDetail.prevEpisode.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#111] border border-[#1c1c1c] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#141414] hover:border-[#2a2a2a] transition"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0c0c0c] border border-[#1c1c1c] px-4 py-2 text-[13px] font-medium text-[#707070] cursor-not-allowed">
                <ChevronLeft className="h-4 w-4" /> Prev
              </span>
            )}
            <Link
              href={`/anime/${initialDetail.animeSlug}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#111] border border-[#1c1c1c] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#141414] transition"
            >
              <List className="h-4 w-4" /> List
            </Link>
            {initialDetail.hasNextEpisode && initialDetail.nextEpisode ? (
              <Link
                href={`/watch/${initialDetail.nextEpisode.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#d50032] px-4 py-2 text-[13px] font-bold text-white hover:bg-[#e8003a] shadow-sm transition"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0c0c0c] border border-[#1c1c1c] px-4 py-2 text-[13px] font-medium text-[#707070] cursor-not-allowed">
                Next <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </div>
        </div>

        {/* Server selector — PRD #25 */}
        <div className="rounded-2xl bg-[#0c0c0c] border border-[#1c1c1c] p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-[#707070]" />
            <h2 className="text-[13px] font-bold tracking-tight text-white">Pilih Server — Sanka</h2>
          </div>
          {initialDetail.servers.length === 0 ? (
            <p className="text-sm text-[#707070]">Tidak ada server tersedia.</p>
          ) : (
            <div className="space-y-3">
              {initialDetail.servers.map((q) => (
                <div key={q.title} className="space-y-2">
                  <div className="text-[11px] font-bold text-[#707070] uppercase tracking-widest">{q.title}</div>
                  <div className="flex flex-wrap gap-2">
                    {q.serverList.length === 0 ? (
                      <span className="text-xs text-[#707070]">Tidak ada server untuk kualitas ini</span>
                    ) : (
                      q.serverList.map((s) => {
                        const isActive = activeServer === s.serverId;
                        return (
                          <button
                            key={s.serverId}
                            onClick={() => selectServer(s.serverId)}
                            className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition ${
                              isActive
                                ? "bg-[#d50032] border-[#d50032] text-white shadow-sm"
                                : "bg-[#111] border-[#1c1c1c] text-[#a0a0a0] hover:bg-[#141414] hover:text-white hover:border-[#2a2a2a]"
                            }`}
                          >
                            {s.title}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-[#707070]">Jika video tidak muncul, coba ganti server lain. Embed via <code className="bg-[#111] border border-[#1c1c1c] px-1 rounded">/anime/server/:serverId</code> Sanka.</p>
        </div>

        {/* Episode list — PRD #21 */}
        <div className="rounded-2xl bg-[#0c0c0c] border border-[#1c1c1c] p-4 sm:p-5">
          <h2 className="text-[13px] font-bold tracking-tight text-white mb-3 flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-[#d50032]" /> Daftar Episode
          </h2>
          <EpisodeList episodes={initialDetail.episodeList} currentSlug={episodeSlug} variant="watch" />
        </div>
      </div>
    </div>
  );
}

function extractNumber(title: string): number | null {
  const m = title.match(/episode\s*(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}


