import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { getOngoing } from "@/lib/api/sanka";

export async function GET(req: NextRequest) {
  const page = Math.max(1, parseInt(req.nextUrl.searchParams.get("page") ?? "1", 10) || 1);
  try {
    const data = await getOngoing(page);
    return NextResponse.json({ success: true, data: data.list, pagination: data.pagination }, { status: 200 });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ success: false, error: { code: err.code, message: err.message } }, { status: err.status });
    }
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Gagal memuat ongoing" } }, { status: 500 });
  }
}
