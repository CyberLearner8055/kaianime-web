import { Anime, Episode } from "./types";
import { getSiteConfig } from "./config";

const DATA_URL = "https://raw.githubusercontent.com/CyberLearner8055/appdata/refs/heads/main/anime-data.json";
const APPSCRIPT_TRENDING_URL =
  "https://script.google.com/macros/s/AKfycbwz3t4Lnntv_rhDMrsDe0uN8V7vRJBm6QWyziV8mw1LuvRDohS2iw8Urk3H0wjvtZogpQ/exec?page=trending&kind=anime";

// In-memory cache for ultra-fast server responses
let memoryCache: Anime[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 300 * 1000; // 5 minutes

let trendingCache: Anime[] | null = null;
let lastTrendingFetch = 0;

export function purgeAnimeDataCache(): void {
  memoryCache = null;
  lastFetchTime = 0;
  trendingCache = null;
  lastTrendingFetch = 0;
  runningCache = null;
  lastRunningFetch = 0;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\[.*?\]/g, "")
    .replace(/\(.*?\)/g, "")
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function fetchAllAnime(): Promise<Anime[]> {
  const now = Date.now();
  if (memoryCache && now - lastFetchTime < CACHE_TTL) {
    return memoryCache;
  }

  const siteConfig = getSiteConfig();
  const currentDataUrl = siteConfig.dataUrl || DATA_URL;

  try {
    const res = await fetch(currentDataUrl, {
      cache: "no-store",
      headers: {
        "Accept": "application/json",
        "User-Agent": "KaiAnime-Web/1.0",
      },
    });

    if (!res.ok) {
      if (memoryCache) return memoryCache;
      throw new Error(`Failed to fetch anime data: ${res.status}`);
    }

    const rawData = await res.json();
    if (!Array.isArray(rawData)) return [];

    const parsed: Anime[] = rawData.map((item: any) => {
      const rawTitle = String(item.title || "Untitled").trim();
      const rawId = String(item.id || "");
      const cleanSlug = slugify(rawTitle) || rawId || "anime";

      // Parse genres
      const rawGenres = item.genres;
      let genres: string[] = [];
      if (Array.isArray(rawGenres)) {
        genres = rawGenres.map((g) => String(g).trim()).filter(Boolean);
      } else if (typeof rawGenres === "string") {
        genres = rawGenres.split(",").map((g) => g.trim()).filter(Boolean);
      }

      // Parse seasons and episodes
      const episodes: Episode[] = [];
      const seasonsData = item.seasonsData || {};
      const seasonKeys = Object.keys(seasonsData)
        .map(Number)
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);
      const availableSeasons = seasonKeys.length > 0 ? seasonKeys : [1];

      availableSeasons.forEach((sNum) => {
        const epList = seasonsData[String(sNum)] || [];
        epList.forEach((ep: any) => {
          const servers: Record<string, string> = {};
          for (let i = 1; i <= 5; i++) {
            const val = ep[`server${i}`];
            if (val && typeof val === "string" && val.trim().length > 0) {
              servers[`Server ${i}`] = val.trim();
            }
          }
          const epNumber = Number(ep.epNum) || 0;
          episodes.push({
            id: `${cleanSlug}-s${sNum}-ep${epNumber}`,
            season: sNum,
            number: epNumber,
            title: `Episode ${epNumber}`,
            servers,
          });
        });
      });

      // Sort episodes ascending
      episodes.sort((a, b) => (a.season || 1) - (b.season || 1) || a.number - b.number);

      // Parse Rating accurately from "8.62/10"
      let rating = 8.2;
      if (item.rating) {
        const num = parseFloat(String(item.rating).replace(/\/10.*/, "").trim());
        if (!isNaN(num) && num > 0) {
          rating = Math.min(10, Math.max(1, num));
        }
      }

      // Check for Hindi Dub
      const langs = String(item.langs || "").toLowerCase();
      const dubbedBy = String(item.dubbedBy || "").toLowerCase();
      const titleLower = rawTitle.toLowerCase();
      // Every anime on KaiAnime is at minimum Hindi, English, Japanese
      const rawLangs = item.langs ? String(item.langs).trim() : "Hindi, English, Japanese";

      return {
        id: cleanSlug,
        originalId: rawId,
        title: rawTitle,
        japaneseTitle: item.japaneseTitle || "",
        synopsis: item.synopsis || "No synopsis available yet for this title.",
        genres,
        poster: item.img || "https://animedrive.me/wp-content/uploads/2024/09/cropped-anime-drive-logo.png",
        banner: item.banner || item.mobileBanner || item.img,
        type: item.type || "Series",
        status:
          siteConfig.animeOverrides?.[cleanSlug]?.status ||
          siteConfig.animeOverrides?.[rawId]?.status ||
          (item.status
            ? item.status === "Ongoing" || item.status === "RELEASING"
              ? "Ongoing"
              : "Completed"
            : item.type === "Movie" || episodes.length === 1
            ? "Completed"
            : item.inSlider || item.section === "Ongoing" || item.section === "running"
            ? "Ongoing"
            : "Completed"),
        rating,
        episodesCount: episodes.length,
        episodes,
        seasons: availableSeasons,
        isHindiDubbed: true,
        isTrending: Boolean(item.inSlider),
        isPopular: Boolean(
          siteConfig.animeOverrides?.[cleanSlug]?.isPinned ||
          siteConfig.animeOverrides?.[rawId]?.isPinned ||
          item.section === "Popular" ||
          item.inSlider ||
          rating >= 8.5
        ),
        year: item.year || "2024",
        quality: item.quality || "1080p FHD",
        langs: rawLangs,
        dubbedBy: item.dubbedBy || "Official / Anime Drive",
      };
    });

    memoryCache = parsed;
    lastFetchTime = now;
    return parsed;
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") {
      throw err;
    }
    console.error("[DataService] Error fetching anime data:", err);
    return memoryCache || [];
  }
}

export const getAllAnime = fetchAllAnime;

export async function getAnimeByIdOrSlug(identifier: string): Promise<Anime | null> {
  const all = await fetchAllAnime();
  const cleanId = decodeURIComponent(identifier).toLowerCase().trim();
  return (
    all.find(
      (a) =>
        a.id.toLowerCase() === cleanId ||
        (a.originalId && a.originalId.toLowerCase() === cleanId) ||
        slugify(a.title) === cleanId ||
        a.title.toLowerCase() === cleanId
    ) || null
  );
}

// Upper Slider: Live App-Matched Trending Anime (Anime Drive App analytics parity)
export async function getAppTrendingAnime(): Promise<Anime[]> {
  const now = Date.now();
  if (trendingCache && now - lastTrendingFetch < CACHE_TTL) {
    return trendingCache;
  }

  const all = await fetchAllAnime();

  try {
    const res = await fetch(APPSCRIPT_TRENDING_URL, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const matched: Anime[] = [];
        for (const item of data) {
          const rawId = String(item.id || "");
          const title = String(item.title || "").toLowerCase();
          const found = all.find(
            (a) =>
              (a.originalId && a.originalId === rawId) ||
              a.title.toLowerCase() === title ||
              slugify(a.title) === slugify(title)
          );
          if (found && !matched.some((m) => m.id === found.id)) {
            matched.push(found);
          }
        }
        if (matched.length > 0) {
          // Fill up to 10 with top rated titles if needed
          const fallbackCandidates = all
            .filter((a) => a.rating >= 8.3 && !matched.some((m) => m.id === a.id))
            .slice(0, 10 - matched.length);
          const fullList = [...matched, ...fallbackCandidates].slice(0, 10);
          trendingCache = fullList;
          lastTrendingFetch = now;
          return fullList;
        }
      }
    }
  } catch (e) {
    console.warn("[DataService] App trending fetch failed, falling back to top rated:", e);
  }

  // Fallback: top rated titles
  const topBlockbusters = all
    .filter((a) => a.rating >= 8.2 || a.isPopular)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);
  trendingCache = topBlockbusters;
  lastTrendingFetch = now;
  return topBlockbusters;
}

export async function getTrendingAnime(): Promise<Anime[]> {
  return getAppTrendingAnime();
}

export async function getSpotlightAnime(): Promise<Anime[]> {
  const config = getSiteConfig();
  const all = await fetchAllAnime();

  if (config.spotlightAnimeSlugs && config.spotlightAnimeSlugs.length > 0) {
    const curated: Anime[] = [];
    for (const slug of config.spotlightAnimeSlugs) {
      const target = slug.toLowerCase().trim();
      const found = all.find(
        (a) =>
          a.id.toLowerCase() === target ||
          (a.originalId && a.originalId.toLowerCase() === target) ||
          slugify(a.title) === target ||
          a.title.toLowerCase() === target
      );
      if (found && !curated.some((c) => c.id === found.id)) {
        curated.push(found);
      }
    }
    if (curated.length > 0) {
      return curated;
    }
  }

  return getAppTrendingAnime();
}

function cleanMatchTitle(s: string): string {
  let t = s.toLowerCase().trim();
  t = t.replace(/\(.*?\)|\[.*?\]/g, "");
  t = t.replace(/\s*(season\s*\d+|part\s*\d+|s\d+).*$/i, "");
  t = t.replace(/[^a-z0-9]/g, "");
  return t;
}

let runningCache: Anime[] | null = null;
let lastRunningFetch = 0;

// Running Anime Rail (Matched directly with live App Ongoing API)
export async function getRunningAnime(): Promise<Anime[]> {
  const now = Date.now();
  if (runningCache && now - lastRunningFetch < CACHE_TTL) {
    return runningCache;
  }

  const all = await fetchAllAnime();

  try {
    const res = await fetch("https://medal-chronicle-initial-fee.trycloudflare.com/", {
      cache: "no-store",
      headers: { "User-Agent": "AnimeDrive-Web/1.0" },
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const data = await res.json();
      const ongoingItems: any[] = [];
      if (Array.isArray(data.ongoing)) ongoingItems.push(...data.ongoing);
      if (Array.isArray(data.upcoming)) ongoingItems.push(...data.upcoming);

      if (ongoingItems.length > 0) {
        const matched: Anime[] = [];
        const seenIds = new Set<string>();

        for (const item of ongoingItems) {
          const rawTitle = String(item.title || "").trim();
          if (!rawTitle) continue;
          const cleanApi = cleanMatchTitle(rawTitle);
          if (!cleanApi) continue;

          for (const a of all) {
            if (seenIds.has(a.id)) continue;
            const cleanApp = cleanMatchTitle(a.title);
            if (
              cleanApp &&
              (cleanApp === cleanApi ||
                cleanApp.includes(cleanApi) ||
                cleanApi.includes(cleanApp))
            ) {
              matched.push(a);
              seenIds.add(a.id);
              break;
            }
          }
        }

        if (matched.length > 0) {
          // Fill up to 18 with ongoing status anime if needed
          const fallbacks = all.filter(
            (a) => a.status.toLowerCase() === "ongoing" && !seenIds.has(a.id)
          );
          const fullList = [...matched, ...fallbacks].slice(0, 18);
          runningCache = fullList;
          lastRunningFetch = now;
          return fullList;
        }
      }
    }
  } catch (err) {
    console.warn("[DataService] Ongoing API fetch failed, falling back to ongoing status:", err);
  }

  // Fallback if API tunnel is down
  const running = all.filter(
    (a) =>
      a.status.toLowerCase() === "ongoing" ||
      a.genres.some((g) => g.toLowerCase().includes("ongoing"))
  );
  const result = running.length >= 6 ? running.slice(0, 18) : all.slice(0, 18);
  runningCache = result;
  lastRunningFetch = now;
  return result;
}

// Action Anime Rail
export async function getActionAnime(): Promise<Anime[]> {
  const all = await fetchAllAnime();
  return all
    .filter((a) =>
      a.genres.some((g) => {
        const gl = g.toLowerCase();
        return gl.includes("action") || gl.includes("adventure");
      })
    )
    .slice(0, 18);
}

// Isekai Anime Rail
export async function getIsekaiAnime(): Promise<Anime[]> {
  const all = await fetchAllAnime();
  return all
    .filter((a) => {
      const g = a.genres.map((x) => x.toLowerCase());
      const t = a.title.toLowerCase();
      const s = a.synopsis.toLowerCase();
      return (
        g.includes("isekai") ||
        g.includes("fantasy") ||
        t.includes("reincarnat") ||
        t.includes("another world") ||
        t.includes("isekai") ||
        s.includes("reincarnat") ||
        s.includes("another world") ||
        s.includes("isekai") ||
        t.includes("slime") ||
        t.includes("shield hero") ||
        t.includes("overlord") ||
        t.includes("mushoku")
      );
    })
    .slice(0, 18);
}

// Romance Anime Rail
export async function getRomanceAnime(): Promise<Anime[]> {
  const all = await fetchAllAnime();
  return all
    .filter((a) => {
      const g = a.genres.map((x) => x.toLowerCase());
      const t = a.title.toLowerCase();
      const s = a.synopsis.toLowerCase();
      return (
        g.includes("romance") ||
        (g.includes("drama") &&
          (s.includes("love") ||
            s.includes("romantic") ||
            t.includes("love") ||
            t.includes("girlfriend") ||
            t.includes("horimiya") ||
            t.includes("kaguya")))
      );
    })
    .slice(0, 18);
}

export async function getHindiDubbedAnime(): Promise<Anime[]> {
  const all = await fetchAllAnime();
  return all.filter((a) => a.isHindiDubbed);
}

export async function getRecentAnime(): Promise<Anime[]> {
  const all = await fetchAllAnime();
  return all.slice(0, 18);
}

export async function getAllGenres(): Promise<string[]> {
  const all = await fetchAllAnime();
  const set = new Set<string>();
  all.forEach((a) => a.genres.forEach((g) => set.add(g)));
  return Array.from(set).sort();
}

export async function searchAnime(query: string): Promise<Anime[]> {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  const all = await fetchAllAnime();
  return all.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      (a.japaneseTitle && a.japaneseTitle.toLowerCase().includes(q)) ||
      a.genres.some((g) => g.toLowerCase().includes(q)) ||
      (a.langs && a.langs.toLowerCase().includes(q))
  );
}

export function toSlimAnime(a: Anime): Anime {
  return {
    id: a.id,
    originalId: a.originalId,
    title: a.title,
    japaneseTitle: a.japaneseTitle,
    synopsis: a.synopsis,
    genres: a.genres,
    poster: a.poster,
    banner: a.banner,
    type: a.type,
    status: a.status,
    rating: a.rating,
    episodesCount: a.episodesCount,
    episodes:
      a.episodes && a.episodes.length > 0
        ? [{ id: a.episodes[0].id, number: a.episodes[0].number, title: "Episode 1", servers: {} }]
        : [{ id: `${a.id}-ep1`, number: 1, title: "Episode 1", servers: {} }],
    seasons: a.seasons,
    isHindiDubbed: a.isHindiDubbed,
    isTrending: a.isTrending,
    isPopular: a.isPopular,
    year: a.year,
    quality: a.quality,
    langs: a.langs,
    dubbedBy: a.dubbedBy,
  };
}
