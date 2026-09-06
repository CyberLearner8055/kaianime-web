import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Range, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function HEAD(req: NextRequest) {
  return GET(req);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");
  const referer = searchParams.get("referer") || targetUrl || "";
  const origin = searchParams.get("origin") || "";

  if (!targetUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const headers: Record<string, string> = {
      "User-Agent": USER_AGENT,
    };
    if (referer) headers["Referer"] = referer;
    if (origin) headers["Origin"] = origin;

    // Handle range headers for seeking
    const range = req.headers.get("range");
    if (range) headers["Range"] = range;

    const response = await fetch(targetUrl, { headers });

    if (!response.ok && response.status !== 206) {
      return new NextResponse(`Proxy fetch error: ${response.statusText}`, {
        status: response.status,
      });
    }

    const contentTypeHeader = response.headers.get("content-type") || "application/octet-stream";
    const contentType = contentTypeHeader.toLowerCase();

    // 1. M3U8 Manifests (Master or Sub-playlists)
    const isM3u8 =
      !targetUrl.toLowerCase().includes(".ts") &&
      !targetUrl.toLowerCase().includes(".m4s") &&
      !targetUrl.toLowerCase().endsWith(".js") &&
      (targetUrl.toLowerCase().includes(".m3u8") ||
        targetUrl.includes("/hls/") ||
        contentType.includes("mpegurl") ||
        contentType.includes("vnd.apple.mpegurl") ||
        contentType.includes("x-mpegurl"));

    if (isM3u8) {
      const manifestText = await response.text();
      const baseUrl = new URL(targetUrl);
      const basePath = baseUrl.origin + baseUrl.pathname.substring(0, baseUrl.pathname.lastIndexOf("/") + 1);

      // Rewrite relative URLs inside M3U8 so all audio, keys, and stream playlists pass through this proxy
      const rewrittenManifest = manifestText
        .split("\n")
        .map((line) => {
          const trimmed = line.trim();
          if (!trimmed) return line;

          // Rewrite URI="..." attributes (e.g. #EXT-X-MEDIA audio tracks or #EXT-X-KEY encryption keys)
          if (trimmed.startsWith("#")) {
            if (trimmed.includes('URI="')) {
              return line.replace(/URI="([^"]+)"/g, (_, uriVal) => {
                let fullUri = uriVal;
                if (uriVal.startsWith("http://") || uriVal.startsWith("https://")) {
                  fullUri = uriVal;
                } else if (uriVal.startsWith("/")) {
                  fullUri = baseUrl.origin + uriVal;
                } else {
                  fullUri = basePath + uriVal;
                }
                const proxied = `/api/proxy?url=${encodeURIComponent(fullUri)}&_v=2&referer=${encodeURIComponent(
                  referer
                )}&origin=${encodeURIComponent(origin)}`;
                return `URI="${proxied}"`;
              });
            }
            return line;
          }

          let fullUrl = trimmed;
          if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
            fullUrl = trimmed;
          } else if (trimmed.startsWith("/")) {
            fullUrl = baseUrl.origin + trimmed;
          } else {
            fullUrl = basePath + trimmed;
          }

          const proxyUrl = `/api/proxy?url=${encodeURIComponent(fullUrl)}&_v=2&referer=${encodeURIComponent(
            referer
          )}&origin=${encodeURIComponent(origin)}`;
          return proxyUrl;
        })
        .join("\n");

      return new NextResponse(rewrittenManifest, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    // 2. Classify Video Segment vs Subtitles
    const isVideoSegment =
      targetUrl.toLowerCase().includes(".ts") ||
      targetUrl.toLowerCase().includes(".m4s") ||
      targetUrl.toLowerCase().includes(".mp4") ||
      (targetUrl.includes("/p/") && targetUrl.endsWith(".js"));

    const isSubtitleType = searchParams.get("type") === "subtitle";
    const isVtt =
      !targetUrl.toLowerCase().includes(".m3u8") &&
      (targetUrl.toLowerCase().includes(".vtt") ||
        contentType.includes("vtt") ||
        contentType.includes("text/vtt"));
    const isSrt =
      targetUrl.toLowerCase().includes(".srt") || contentType.includes("srt");
    const isGz =
      isSubtitleType &&
      (targetUrl.endsWith(".gz") || response.headers.get("content-encoding") === "gzip");

    const isSubtitle = !isVideoSegment && (isSubtitleType || isVtt || isSrt || isGz);

    // 3. Subtitles Handler (WebVTT, SRT, or OpenSubtitles .gz)
    if (isSubtitle) {
      let rawText = "";
      if (isGz) {
        try {
          const zlibModule = eval("require")("zlib");
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          rawText = zlibModule.gunzipSync(buffer).toString("utf8");
        } catch {
          rawText = await response.text();
        }
      } else {
        rawText = await response.text();
      }

      // Filter out promotional lines if present from external subtitle sources
      let cleanText = rawText
        .replace(/.*OpenSubtitles.*[\r\n]*/gi, "")
        .replace(/.*Advertise your product.*[\r\n]*/gi, "")
        .replace(/.*contact.*opensubtitles.*[\r\n]*/gi, "");

      let vttText = cleanText.trim();
      if (!vttText.startsWith("WEBVTT")) {
        vttText = vttText.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
        vttText = `WEBVTT\n\n${vttText}`;
      }

      return new NextResponse(vttText, {
        status: 200,
        headers: {
          "Content-Type": "text/vtt; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      });
    }

    // 4. Binary Video Segments / Chunks (TS, MP4, JS-obfuscated TS)
    let chunkContentType = contentType;
    if (
      targetUrl.toLowerCase().includes(".ts") ||
      (targetUrl.includes("/p/") && targetUrl.endsWith(".js"))
    ) {
      chunkContentType = "video/mp2t";
    } else if (targetUrl.toLowerCase().includes(".mp4")) {
      chunkContentType = "video/mp4";
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const responseHeaders: Record<string, string> = {
      "Content-Type": chunkContentType,
      "Content-Length": String(buffer.byteLength),
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Accept-Ranges": "bytes",
    };

    const contentRange = response.headers.get("content-range");
    if (contentRange) responseHeaders["Content-Range"] = contentRange;

    return new NextResponse(buffer, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return new NextResponse(`Proxy error: ${err?.message || "Unknown error"}`, { status: 500 });
  }
}
