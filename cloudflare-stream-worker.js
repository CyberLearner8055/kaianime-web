/**
 * KaiAnime & AnimeDrive - High Speed HLS Video Stream Proxy
 * Deploy on Cloudflare Workers (100% FREE - UNLIMITED BANDWIDTH)
 */

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const reqUrl = new URL(request.url);
    const targetUrl = reqUrl.searchParams.get("url");
    const referer = reqUrl.searchParams.get("referer") || targetUrl || "";
    const origin = reqUrl.searchParams.get("origin") || "";

    if (!targetUrl) {
      return new Response("Missing target url parameter", {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    try {
      const upstreamHeaders = new Headers();
      upstreamHeaders.set("User-Agent", USER_AGENT);
      if (referer) upstreamHeaders.set("Referer", referer);
      if (origin) upstreamHeaders.set("Origin", origin);

      // Forward range header for smooth seeking
      const range = request.headers.get("Range");
      if (range) upstreamHeaders.set("Range", range);

      const upstreamRes = await fetch(targetUrl, {
        method: request.method,
        headers: upstreamHeaders,
      });

      if (!upstreamRes.ok && upstreamRes.status !== 206) {
        return new Response(`Upstream error: ${upstreamRes.statusText}`, {
          status: upstreamRes.status,
          headers: CORS_HEADERS,
        });
      }

      const contentTypeHeader =
        upstreamRes.headers.get("content-type") || "application/octet-stream";
      const contentType = contentTypeHeader.toLowerCase();

      // Check if M3U8 manifest
      const isM3u8 =
        !targetUrl.toLowerCase().includes(".ts") &&
        !targetUrl.toLowerCase().includes(".m4s") &&
        !targetUrl.toLowerCase().endsWith(".js") &&
        (targetUrl.toLowerCase().includes(".m3u8") ||
          targetUrl.includes("/hls/") ||
          contentType.includes("mpegurl") ||
          contentType.includes("vnd.apple.mpegurl") ||
          contentType.includes("x-mpegurl"));

      const workerBase = `${reqUrl.origin}${reqUrl.pathname}`;

      // 1. M3U8 Manifest Rewriting
      if (isM3u8) {
        const manifestText = await upstreamRes.text();
        const baseUrl = new URL(targetUrl);
        const basePath =
          baseUrl.origin +
          baseUrl.pathname.substring(0, baseUrl.pathname.lastIndexOf("/") + 1);

        const rewritten = manifestText
          .split("\n")
          .map((line) => {
            const trimmed = line.trim();
            if (!trimmed) return line;

            // Rewrite URI="..." attributes (audio tracks & encryption keys)
            if (trimmed.startsWith("#")) {
              if (trimmed.includes('URI="')) {
                return line.replace(/URI="([^"]+)"/g, (_, uriVal) => {
                  let fullUri = uriVal;
                  if (
                    uriVal.startsWith("http://") ||
                    uriVal.startsWith("https://")
                  ) {
                    fullUri = uriVal;
                  } else if (uriVal.startsWith("/")) {
                    fullUri = baseUrl.origin + uriVal;
                  } else {
                    fullUri = basePath + uriVal;
                  }
                  const proxied = `${workerBase}?url=${encodeURIComponent(
                    fullUri
                  )}&referer=${encodeURIComponent(
                    referer
                  )}&origin=${encodeURIComponent(origin)}`;
                  return `URI="${proxied}"`;
                });
              }
              return line;
            }

            // Rewrite stream sub-playlists & segment URLs
            let fullUrl = trimmed;
            if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
              fullUrl = trimmed;
            } else if (trimmed.startsWith("/")) {
              fullUrl = baseUrl.origin + trimmed;
            } else {
              fullUrl = basePath + trimmed;
            }

            return `${workerBase}?url=${encodeURIComponent(
              fullUrl
            )}&referer=${encodeURIComponent(
              referer
            )}&origin=${encodeURIComponent(origin)}`;
          })
          .join("\n");

        return new Response(rewritten, {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/vnd.apple.mpegurl",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
      }

      // 2. Subtitle Processing
      const isSubtitleType = reqUrl.searchParams.get("type") === "subtitle";
      const isVtt =
        targetUrl.toLowerCase().includes(".vtt") || contentType.includes("vtt");
      const isSrt =
        targetUrl.toLowerCase().includes(".srt") || contentType.includes("srt");

      if (isSubtitleType || isVtt || isSrt) {
        let text = await upstreamRes.text();
        let clean = text
          .replace(/.*OpenSubtitles.*[\r\n]*/gi, "")
          .replace(/.*Advertise your product.*[\r\n]*/gi, "");

        let vtt = clean.trim();
        if (!vtt.startsWith("WEBVTT")) {
          vtt = vtt.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
          vtt = `WEBVTT\n\n${vtt}`;
        }

        return new Response(vtt, {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "text/vtt; charset=utf-8",
            "Cache-Control": "public, max-age=86400",
          },
        });
      }

      // 3. High-Speed Video Chunks (.ts, .m4s, .mp4) - Direct Stream Pipe
      let chunkType = contentType;
      if (
        targetUrl.toLowerCase().includes(".ts") ||
        (targetUrl.includes("/p/") && targetUrl.endsWith(".js"))
      ) {
        chunkType = "video/mp2t";
      } else if (targetUrl.toLowerCase().includes(".mp4")) {
        chunkType = "video/mp4";
      }

      const responseHeaders = new Headers(CORS_HEADERS);
      responseHeaders.set("Content-Type", chunkType);
      const cl = upstreamRes.headers.get("content-length");
      if (cl) responseHeaders.set("Content-Length", cl);
      const cr = upstreamRes.headers.get("content-range");
      if (cr) responseHeaders.set("Content-Range", cr);
      responseHeaders.set("Accept-Ranges", "bytes");
      responseHeaders.set("Cache-Control", "public, max-age=31536000, immutable");

      return new Response(upstreamRes.body, {
        status: upstreamRes.status,
        headers: responseHeaders,
      });
    } catch (err) {
      return new Response(`Proxy Error: ${err.message}`, {
        status: 500,
        headers: CORS_HEADERS,
      });
    }
  },
};
