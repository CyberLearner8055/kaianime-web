import { NextRequest, NextResponse } from "next/server";
import { extractStream } from "@/lib/extractor";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store, max-age=0",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

async function handleExtract(serverUrl: string | null) {
  if (!serverUrl || typeof serverUrl !== "string" || !serverUrl.trim()) {
    return NextResponse.json(
      { error: "Missing or invalid 'url' parameter" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const trimmed = serverUrl.trim();

  try {
    const data = await extractStream(trimmed);
    if (!data || !data.url) {
      return NextResponse.json(
        { error: "Could not extract direct stream" },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const refererParam = data.referer || trimmed;
    const originParam = data.origin || "";

    // Proxy the stream through /api/proxy to guarantee 100% CORS and referer bypass
    const proxiedStreamUrl = `/api/proxy?url=${encodeURIComponent(
      data.url
    )}&referer=${encodeURIComponent(refererParam)}&origin=${encodeURIComponent(originParam)}`;

    return NextResponse.json(
      {
        success: true,
        m3u8: proxiedStreamUrl,
        directM3u8: data.url,
        streamUrl: proxiedStreamUrl,
        url: proxiedStreamUrl,
        subtitles: data.subtitles || [],
        isHls: data.isHls ?? true,
        referer: refererParam,
        origin: originParam,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    console.error("[API/Extract] Error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal extraction error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serverUrl = searchParams.get("url");
  return handleExtract(serverUrl);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { searchParams } = new URL(req.url);
    const serverUrl = body?.url || searchParams.get("url");
    return handleExtract(serverUrl);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Invalid request body" },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}
