import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { isAllowedEmbedUrl, isValidServerId } from "@/lib/config";
import { getStreamingUrl } from "@/lib/api/sanka";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ serverId: string }> }
) {
  const { serverId } = await params;

  if (!isValidServerId(serverId)) {
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message: "Server ID tidak valid" } },
      { status: 400 }
    );
  }

  try {
    const url = await getStreamingUrl(serverId);
    if (!isAllowedEmbedUrl(url)) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_URL", message: "URL streaming tidak valid" } },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: true, data: { url } }, { status: 200 });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { success: false, error: { code: err.code, message: err.message } },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Gagal memuat pilihan tayang" } },
      { status: 500 }
    );
  }
}
