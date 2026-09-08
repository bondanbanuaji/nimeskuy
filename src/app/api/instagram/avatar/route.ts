import { NextResponse } from "next/server";

export const revalidate = 86400; // 24 jam

export async function GET() {
  try {
    const res = await fetch("https://www.instagram.com/bdn_bnj/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
        "Cache-Control": "no-cache",
      },
      // next revalidate handled by route segment
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json({ avatarUrl: null }, { status: 200 });
    }

    const html = await res.text();

    let avatarUrl: string | null = null;

    // 1) profile_pic_url_hd
    const m1 = html.match(/"profile_pic_url_hd"\s*:\s*"([^"]+)"/);
    if (m1?.[1]) {
      try {
        avatarUrl = JSON.parse(`"${m1[1]}"`);
      } catch {
        avatarUrl = m1[1];
      }
    }

    // 2) profile_pic_url fallback
    if (!avatarUrl) {
      const m2 = html.match(/"profile_pic_url"\s*:\s*"([^"]+)"/);
      if (m2?.[1]) {
        try {
          avatarUrl = JSON.parse(`"${m2[1]}"`);
        } catch {
          avatarUrl = m2[1];
        }
      }
    }

    // 3) og:image fallback
    if (!avatarUrl) {
      const m3 = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/);
      if (m3?.[1]) avatarUrl = m3[1];
    }

    if (avatarUrl) {
      // Instagram escapes: \/ and \u0026
      avatarUrl = avatarUrl.replace(/\\u0026/g, "&").replace(/\\\//g, "/");
      // validate url
      try {
        new URL(avatarUrl);
      } catch {
        avatarUrl = null;
      }
    }

    return NextResponse.json(
      { avatarUrl },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch {
    return NextResponse.json({ avatarUrl: null }, { status: 200 });
  }
}
