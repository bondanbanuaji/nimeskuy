import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const revalidate = 86400;

const ANILIST_QUERY = `
query ($search: String) {
  Media(search: $search, type: ANIME) {
    bannerImage
    coverImage { large extraLarge }
    title { romaji english native }
  }
}
`;

async function fetchGoogleCover(title: string): Promise<string | null> {
  try {
    // Google Images — ambil sampul high-res format bagus, biar gak burik
    const q = encodeURIComponent(`${title} anime poster`);
    const url = `https://www.google.com/search?q=${q}&tbm=isch&udm=2&hl=en`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);

    // Google simpan high-res url di href imgres?imgurl= atau di JSON blob
    // coba extract dari <a href="/imgres?imgurl=...">
    const links = $('a[href*="imgres?imgurl="]');
    for (let i = 0; i < Math.min(links.length, 5); i++) {
      const href = $(links[i]).attr("href");
      if (!href) continue;
      const m = href.match(/imgurl=([^&]+)/);
      if (m) {
        try {
          const decoded = decodeURIComponent(m[1]);
          if (decoded.startsWith("http") && /\.(jpg|jpeg|png|webp)(\?|$)/i.test(decoded)) return decoded;
          if (decoded.startsWith("http")) return decoded;
        } catch {}
      }
    }
    // fallback: cari img src yang bukan gstatic thumbnail kecil — ambil yang https dan bukan data:
    const imgs = $("img");
    for (let i = 0; i < imgs.length; i++) {
      const src = $(imgs[i]).attr("src") || $(imgs[i]).attr("data-src") || "";
      if (src.startsWith("https://") && !src.includes("gstatic.com/images?q=tbn:") && src.length > 40) {
        // hindari logo google
        if (src.includes("google.com/logos")) continue;
        return src;
      }
    }
    // fallback: extract dari script JSON gstatic
    const m2 = html.match(/https:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*/gi);
    if (m2) {
      const cand = m2.find((u) => !u.includes("gstatic.com/images?q=tbn:ANd9GcQ") && u.length > 60);
      if (cand) return cand.replace(/\\u002F/g, "/").replace(/\\\//g, "/");
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return NextResponse.json({ success: false, error: { message: "slug required" } }, { status: 400 });

  try {
    const sankaRes = await fetch(`${process.env.SANKA_API_URL || "https://www.sankavollerei.web.id"}/anime/anime/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
    });
    const sankaJson = await sankaRes.json().catch(() => null);
    const sankaData = sankaJson?.data ?? sankaJson;
    const title: string | undefined = sankaData?.title as string | undefined;
    const sankaPoster: string | undefined = sankaData?.poster as string | undefined;
    if (!title) return NextResponse.json({ success: false, error: { message: "title not found" } }, { status: 404 });

    // 1. Google dulu — format bagus, high-res, gak burik
    const googleCover = await fetchGoogleCover(title);
    if (googleCover) {
      return NextResponse.json({ success: true, data: { banner: googleCover, title, source: "google" } }, { status: 200 });
    }

    // 2. Anilist bannerImage (landscape high-res)
    try {
      const anilistRes = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query: ANILIST_QUERY, variables: { search: title } }),
        next: { revalidate: 86400 },
      });
      if (anilistRes.ok) {
        const anilistJson = await anilistRes.json();
        const media = anilistJson?.data?.Media as { bannerImage?: string | null; coverImage?: { large?: string; extraLarge?: string } } | undefined;
        const banner = media?.bannerImage ?? media?.coverImage?.extraLarge ?? media?.coverImage?.large ?? null;
        if (banner && typeof banner === "string" && banner.startsWith("http")) {
          return NextResponse.json({ success: true, data: { banner, title, source: "anilist" } }, { status: 200 });
        }
      }
    } catch {}

    // 3. Jikan
    try {
      const q = encodeURIComponent(title);
      const jikanRes = await fetch(`https://api.jikan.moe/v4/anime?q=${q}&limit=1&sfw=true`, {
        next: { revalidate: 86400 },
        headers: { Accept: "application/json" },
      });
      if (jikanRes.ok) {
        const jikanJson = await jikanRes.json();
        const first = jikanJson?.data?.[0];
        const images = first?.images as Record<string, { image_url?: string; large_image_url?: string }> | undefined;
        const banner = images?.webp?.large_image_url ?? images?.jpg?.large_image_url ?? images?.webp?.image_url ?? images?.jpg?.image_url ?? null;
        if (banner) return NextResponse.json({ success: true, data: { banner, title: first.title, source: "jikan" } }, { status: 200 });
      }
    } catch {}

    if (sankaPoster) return NextResponse.json({ success: true, data: { banner: sankaPoster, title, source: "sanka" } }, { status: 200 });

    return NextResponse.json({ success: false, error: { message: "no image" } }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ success: false, error: { message: (e as Error).message } }, { status: 500 });
  }
}
