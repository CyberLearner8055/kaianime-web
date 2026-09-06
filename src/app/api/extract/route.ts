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

async function fetchFallbackSubtitles(title?: string, season: number = 1, ep: number = 1) {
  if (!title) return [];
  try {
    const cleanTitle = title
      .replace(/\(.*?\)/g, "")
      .replace(/\[.*?\]/g, "")
      .replace(/[:\-]/g, " ")
      .trim();

    const padSeason = String(season || 1).padStart(2, "0");
    const padEp = String(ep || 1).padStart(2, "0");
    const queries = [
      `${cleanTitle} S${padSeason}E${padEp}`,
      `${cleanTitle} Episode ${ep}`,
    ];

    for (const q of queries) {
      try {
        const url = `https://rest.opensubtitles.org/search/query-${encodeURIComponent(q)}/sublanguageid-eng`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(url, {
          headers: { "User-Agent": "TemporaryUserAgent" },
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const match = data.find((item: any) => item.SubFormat === "srt") || data[0];
            if (match && match.SubDownloadLink) {
              return [
                {
                  label: "English (Subtitles)",
                  language: "eng",
                  file: `/api/proxy?url=${encodeURIComponent(match.SubDownloadLink)}&type=subtitle`,
                  default: true,
                },
              ];
            }
          }
        }
      } catch (_) {}
    }
  } catch (_) {}
  return [];
}

async function handleExtract(
  serverUrl: string | null,
  title?: string,
  season: number = 1,
  ep: number = 1
) {
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

    // Proxy the stream through /api/proxy with cache-buster &_v=2 to guarantee fresh un-cached playback
    const proxiedStreamUrl = `/api/proxy?url=${encodeURIComponent(
      data.url
    )}&_v=2&referer=${encodeURIComponent(refererParam)}&origin=${encodeURIComponent(originParam)}`;

    // Proxy every subtitle track through /api/proxy to guarantee 100% CORS, WebVTT headers, and referer bypass
    const proxiedSubtitles = (data.subtitles || []).map((sub) => {
      const originalFile = sub.file || "";
      const isExternal =
        originalFile.startsWith("http://") || originalFile.startsWith("https://");
      const proxiedFile = isExternal
        ? `/api/proxy?url=${encodeURIComponent(originalFile)}&referer=${encodeURIComponent(
            refererParam
          )}&origin=${encodeURIComponent(originParam)}&type=subtitle`
        : originalFile;
      return {
        ...sub,
        file: proxiedFile,
      };
    });

    // If no subtitles were detected in the stream, fetch fallback subtitles
    if (proxiedSubtitles.length === 0 && title) {
      const fallbackSubs = await fetchFallbackSubtitles(title, season, ep);
      fallbackSubs.forEach((s) => proxiedSubtitles.push(s));
    }

    return NextResponse.json(
      {
        success: true,
        m3u8: proxiedStreamUrl,
        directM3u8: data.url,
        streamUrl: proxiedStreamUrl,
        url: proxiedStreamUrl,
        subtitles: proxiedSubtitles,
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
  const title = searchParams.get("title") || undefined;
  const season = parseInt(searchParams.get("season") || "1", 10) || 1;
  const ep = parseInt(searchParams.get("ep") || "1", 10) || 1;
  return handleExtract(serverUrl, title, season, ep);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { searchParams } = new URL(req.url);
    const serverUrl = body?.url || searchParams.get("url");
    const title = body?.title || searchParams.get("title") || undefined;
    const season = parseInt(body?.season || searchParams.get("season") || "1", 10) || 1;
    const ep = parseInt(body?.ep || searchParams.get("ep") || "1", 10) || 1;
    return handleExtract(serverUrl, title, season, ep);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Invalid request body" },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}
