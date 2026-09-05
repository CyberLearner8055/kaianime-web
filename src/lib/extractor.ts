import { ExtractedStream, SubtitleTrack } from "./types";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

export function unpackJs(packed: string): string {
  try {
    const match = packed.match(/eval\(function\(p,a,c,k,e,[rd]\)\s*\{[\s\S]*?\}\s*\(([\s\S]*?)\)\s*\)/);
    if (!match) return packed;

    const argsStr = match[1];
    const lastParenIdx = argsStr.lastIndexOf(")");
    const cleanArgs = lastParenIdx !== -1 ? argsStr.substring(0, lastParenIdx) : argsStr;

    // Split parameters p, a, c, k
    const firstComma = cleanArgs.indexOf(",");
    let p = cleanArgs.substring(0, firstComma).trim();
    if (p.startsWith("'") || p.startsWith('"')) {
      p = p.substring(1, p.length - 1);
    }

    const rest1 = cleanArgs.substring(firstComma + 1).trim();
    const secComma = rest1.indexOf(",");
    const a = parseInt(rest1.substring(0, secComma).trim(), 10) || 62;

    const rest2 = rest1.substring(secComma + 1).trim();
    const thirdComma = rest2.indexOf(",");
    const c = parseInt(rest2.substring(0, thirdComma).trim(), 10) || 0;

    let kStr = rest2.substring(thirdComma + 1).trim();
    if (kStr.endsWith(".split('|')")) {
      kStr = kStr.substring(0, kStr.length - ".split('|')".length).trim();
    }
    if (kStr.startsWith("'") || kStr.startsWith('"')) {
      kStr = kStr.substring(1, kStr.length - 1);
    }
    const k = kStr.split("|");

    function baseN(val: number, radix: number): string {
      const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (val === 0) return "0";
      let res = "";
      let num = val;
      while (num > 0) {
        res = chars[num % radix] + res;
        num = Math.floor(num / radix);
      }
      return res;
    }

    let unpacked = p;
    for (let count = c - 1; count >= 0; count--) {
      const word = k[count] || "";
      if (word.length > 0) {
        const token = baseN(count, a);
        const regex = new RegExp(`\\b${token}\\b`, "g");
        unpacked = unpacked.replace(regex, word);
      }
    }
    return unpacked;
  } catch (err) {
    console.error("[Extractor] Unpack failed:", err);
    return packed;
  }
}

export function extractSubtitlesFromHtml(html: string): SubtitleTrack[] {
  const tracks: SubtitleTrack[] = [];
  if (!html) return tracks;

  try {
    // 1. Check playerjsDefaultSubtitle
    const defaultMatch = html.match(/playerjsDefaultSubtitle\s*=\s*["']([^"']*)["']/);
    const defaultLabel = defaultMatch ? defaultMatch[1].trim().toLowerCase() : "";

    // 2. Check playerjsSubtitle e.g. "[English]https://...,[Japanese]https://..." or "https://..."
    const playerjsMatch = html.match(/playerjsSubtitle\s*=\s*["']([^"']+)["']/);
    if (playerjsMatch && playerjsMatch[1].trim().length > 0) {
      const rawVal = playerjsMatch[1].trim();
      const items = rawVal.split(",");
      items.forEach((item, idx) => {
        const clean = item.trim();
        if (!clean) return;
        const tagMatch = clean.match(/^\[(.*?)\](.*)$/);
        let label = tagMatch ? tagMatch[1].trim() : `Track ${idx + 1}`;
        let file = tagMatch ? tagMatch[2].trim() : clean;

        if (file.startsWith("//")) file = `https:${file}`;
        if (!file.startsWith("http://") && !file.startsWith("https://")) return;

        if (label.toLowerCase() === "undefined" || !label) {
          label = "English";
        }

        const isDefault = defaultLabel ? label.toLowerCase().includes(defaultLabel) : idx === 0;
        tracks.push({
          label,
          language: label.substring(0, 3).toLowerCase(),
          file,
          default: isDefault,
        });
      });
    }

    // 3. Check for Dean Edwards packed script containing tracks
    let unpacked = html;
    if (html.includes("eval(function(p,a,c,k,e,")) {
      unpacked = unpackJs(html);
    }

    // Check "tracks": [...] in unpacked or html
    const tracksMatch =
      unpacked.match(/"tracks":\s*(\[[^\]]+\])/) || html.match(/"tracks":\s*(\[[^\]]+\])/);
    if (tracksMatch) {
      try {
        const rawJson = tracksMatch[1].replace(/\\([^\\])/g, "$1");
        const list = JSON.parse(rawJson);
        if (Array.isArray(list)) {
          list.forEach((t: any) => {
            if (t.kind === "captions" || t.kind === "subtitles" || t.file) {
              const f = t.file || "";
              if (f) {
                const file = f.startsWith("//") ? `https:${f}` : f;
                const label = t.label || t.name || "English";
                if (!tracks.some((existing) => existing.file === file)) {
                  tracks.push({
                    label,
                    language: t.language || "eng",
                    file,
                    default: Boolean(t.default),
                  });
                }
              }
            }
          });
        }
      } catch (_) {}
    }
  } catch (err) {
    console.warn("[Extractor] Error extracting subtitles from HTML:", err);
  }

  return tracks;
}

/**
 * Extracts direct Master M3U8 and subtitles from video servers
 */
export async function extractStream(serverUrl: string): Promise<ExtractedStream | null> {
  const trimmed = serverUrl.trim();
  if (!trimmed) return null;

  // 1. Direct M3U8 or MP4 link
  if (trimmed.includes(".m3u8") || trimmed.endsWith(".mp4")) {
    const urlObj = new URL(trimmed);
    return {
      url: trimmed,
      referer: trimmed,
      origin: urlObj.origin,
      isHls: !trimmed.endsWith(".mp4"),
      subtitles: [],
    };
  }

  // 2. Specialized Handler: as-cdn*.top / FirePlayer
  if (trimmed.includes("as-cdn") || trimmed.includes("firevideoplayer") || trimmed.includes("/video/")) {
    try {
      const urlObj = new URL(trimmed);
      const host = urlObj.host;
      const origin = urlObj.origin;
      const parts = urlObj.pathname.split("/").filter(Boolean);
      const videoId = parts[parts.length - 1];

      if (videoId) {
        const getVideoUrl = `${origin}/player/index.php?data=${encodeURIComponent(videoId)}&do=getVideo`;

        // Fetch direct getVideo API and server HTML page concurrently for ultra speed & full subtitle capture
        const [videoRes, pageRes] = await Promise.all([
          fetch(getVideoUrl, {
            method: "POST",
            headers: {
              "User-Agent": USER_AGENT,
              "Referer": trimmed,
              "Origin": origin,
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
              "X-Requested-With": "XMLHttpRequest",
            },
            body: new URLSearchParams({ hash: videoId, r: "" }),
          }).catch(() => null),
          fetch(trimmed, {
            headers: {
              "User-Agent": USER_AGENT,
              "Referer": trimmed,
              "Origin": origin,
            },
          }).catch(() => null),
        ]);

        let subtitles: SubtitleTrack[] = [];
        if (pageRes && pageRes.ok) {
          const html = await pageRes.text();
          subtitles = extractSubtitlesFromHtml(html);
        }

        if (videoRes && videoRes.ok) {
          const data = await videoRes.json();
          const m3u8 = data.videoSource || data.securedLink;
          if (m3u8 && typeof m3u8 === "string" && m3u8.includes(".m3u8")) {
            return {
              url: m3u8,
              referer: `${origin}/`,
              origin,
              isHls: true,
              subtitles,
            };
          }
        }
      }
    } catch (err) {
      console.warn("[Extractor] as-cdn direct API failed, trying HTML fallback:", err);
    }
  }

  // 3. Specialized Handler: megaplay.buzz / kryntal
  if (trimmed.includes("megaplay.buzz")) {
    try {
      const urlObj = new URL(trimmed);
      const origin = urlObj.origin;
      // Extract real ID from URL e.g. /stream/s-2/8242/sub -> 8242
      const idMatch = trimmed.match(/\/(\d+)(\/|$)/);
      if (idMatch) {
        const id = idMatch[1];
        const getSourcesUrl = `https://megaplay.buzz/stream/getSources?id=${id}`;
        const res = await fetch(getSourcesUrl, {
          headers: {
            "User-Agent": USER_AGENT,
            "Referer": trimmed,
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        if (res.ok) {
          const data = await res.json();
          const m3u8 = data.sources?.file || data.source?.file;
          if (m3u8) {
            const subtitles: SubtitleTrack[] = [];
            if (Array.isArray(data.tracks)) {
              data.tracks.forEach((t: any) => {
                if (t.file && (t.kind === "captions" || t.kind === "subtitles")) {
                  subtitles.push({
                    label: t.label || "English",
                    language: t.language || "eng",
                    file: t.file,
                    default: Boolean(t.default),
                  });
                }
              });
            }

            return {
              url: m3u8,
              referer: trimmed,
              origin,
              isHls: true,
              subtitles,
            };
          }
        }
      }
    } catch (err) {
      console.warn("[Extractor] megaplay direct API failed:", err);
    }
  }

  // 4. Generic Web Scraper Fallback
  try {
    const urlObj = new URL(trimmed);
    const origin = urlObj.origin;
    const res = await fetch(trimmed, {
      headers: {
        "User-Agent": USER_AGENT,
        "Referer": trimmed,
        "Origin": origin,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      return null;
    }

    const html = await res.text();

    // Check for packed JS
    let decodedScript = html;
    if (html.includes("eval(function(p,a,c,k,e,")) {
      decodedScript = unpackJs(html);
    }

    // Scrape M3U8 source
    let m3u8Url = "";
    const m3u8Match =
      decodedScript.match(/file\s*:\s*["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/) ||
      decodedScript.match(/videoSource\s*:\s*["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/) ||
      decodedScript.match(/sources\s*:\s*\[\s*\{\s*file\s*:\s*["'](https?:\/\/[^"']+)["']/) ||
      decodedScript.match(/["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/);

    if (m3u8Match) {
      m3u8Url = m3u8Match[1];
    }

    // Scrape subtitles
    const subtitles: SubtitleTrack[] = [];
    const tracksMatch =
      decodedScript.match(/tracks\s*:\s*(\[[^\]]+\])/) ||
      html.match(/tracks\s*:\s*(\[[^\]]+\])/);

    if (tracksMatch) {
      try {
        const rawTracks = JSON.parse(tracksMatch[1].replace(/([a-zA-Z0-9]+?):/g, '"$1":'));
        if (Array.isArray(rawTracks)) {
          rawTracks.forEach((t: any) => {
            if (t.kind === "captions" || t.kind === "subtitles" || t.file) {
              const file = t.file || "";
              if (file.endsWith(".vtt") || file.includes(".vtt?")) {
                subtitles.push({
                  label: t.label || t.name || "English",
                  language: t.language || "eng",
                  file: file.startsWith("//") ? `https:${file}` : file,
                  default: Boolean(t.default),
                });
              }
            }
          });
        }
      } catch (_) {}
    }

    if (subtitles.length === 0) {
      const htmlSubs = extractSubtitlesFromHtml(html);
      htmlSubs.forEach((s) => subtitles.push(s));
    }

    if (!m3u8Url) {
      return null;
    }

    return {
      url: m3u8Url,
      referer: trimmed,
      origin,
      isHls: true,
      subtitles,
    };
  } catch (err) {
    console.error("[Extractor] Failed to extract from", serverUrl, err);
    return null;
  }
}
