import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { getEpisodeDetail } from "@/lib/api/sanka";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ success: false, error: { code: "BAD_REQUEST", message: "Slug episode wajib" } }, { status: 400 });
  }
  try {
    const data = await getEpisodeDetail(slug);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ success: false, error: { code: err.code, message: err.message } }, { status: err.status });
    }
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Gagal memuat episode" } }, { status: 500 });
  }
}
