import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { getHome } from "@/lib/api/sanka";

export async function GET() {
  try {
    const data = await getHome();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ success: false, error: { code: err.code, message: err.message } }, { status: err.status });
    }
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Gagal memuat home" } }, { status: 500 });
  }
}
