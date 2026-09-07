import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { searchAnime } from "@/lib/api/sanka";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json({ success: false, error: { code: "BAD_REQUEST", message: "Query q wajib diisi" } }, { status: 400 });
  }
  try {
    const data = await searchAnime(q);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ success: false, error: { code: err.code, message: err.message } }, { status: err.status });
    }
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Gagal mencari anime" } }, { status: 500 });
  }
}
