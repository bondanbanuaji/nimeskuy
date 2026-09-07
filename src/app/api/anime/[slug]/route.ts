import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { getAnimeDetail } from "@/lib/api/sanka";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug || slug.length > 200 || /[^a-z0-9-]/.test(slug)) {
    return NextResponse.json({ success: false, error: { code: "BAD_REQUEST", message: "Slug tidak valid" } }, { status: 400 });
  }
  try {
    const data = await getAnimeDetail(slug);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ success: false, error: { code: err.code, message: err.message } }, { status: err.status });
    }
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Gagal memuat anime" } }, { status: 500 });
  }
}
