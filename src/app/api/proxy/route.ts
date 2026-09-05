import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

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
    const isM3u8 =
      targetUrl.toLowerCase().includes(".m3u8") ||
      targetUrl.includes("/hls/") ||
      contentType.includes("mpegurl") ||
      contentType.includes("vnd.apple.mpegurl") ||
      contentType.includes("x-mpegurl");

    if (isM3u8) {
      const manifestText = await response.text();
      const baseUrl = new URL(targetUrl);
      const basePath = baseUrl.origin + baseUrl.pathname.substring(0, baseUrl.pathname.lastIndexOf("/") + 1);

      // Rewrite relative URLs inside M3U8 so they also pass through this proxy
      const rewrittenManifest = manifestText
        .split("\n")
        .map((line) => {
          const trimmed = line.trim();
          if (!trimmed) return line;

          // Rewrite URI="..." attributes (e.g. #EXT-X-MEDIA audio tracks or #EXT-X-KEY)
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
                const proxied = `/api/proxy?url=${encodeURIComponent(fullUri)}&referer=${encodeURIComponent(
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

          const proxyUrl = `/api/proxy?url=${encodeURIComponent(fullUrl)}&referer=${encodeURIComponent(
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
          "Cache-Control": "no-cache",
        },
      });
    }

    // Subtitles (WebVTT, SRT) - Normalize and ensure proper text/vtt headers
    const isVtt =
      targetUrl.toLowerCase().includes(".vtt") ||
      contentType.includes("vtt") ||
      contentType.includes("subtitles");
    const isSrt =
      targetUrl.toLowerCase().includes(".srt") ||
      contentType.includes("srt");

    if (isVtt || isSrt) {
      let vttText = await response.text();
      // Ensure proper WEBVTT header and formatting
      if (isSrt || !vttText.trim().startsWith("WEBVTT")) {
        // Convert SRT commas (00:01:23,456) to WebVTT periods (00:01:23.456)
        const formatted = vttText.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
        vttText = `WEBVTT\n\n${formatted.trim()}`;
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

    // Binary chunks (TS, MP4)
    const body = response.body;
    const responseHeaders: Record<string, string> = {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Cache-Control": "public, max-age=31536000, immutable",
    };

    const contentLength = response.headers.get("content-length");
    if (contentLength) responseHeaders["Content-Length"] = contentLength;

    const contentRange = response.headers.get("content-range");
    if (contentRange) responseHeaders["Content-Range"] = contentRange;

    return new NextResponse(body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return new NextResponse(`Proxy error: ${err?.message || "Unknown error"}`, { status: 500 });
  }
}
