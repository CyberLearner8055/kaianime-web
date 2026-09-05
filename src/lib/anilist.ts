import { EnrichedMetadata, AnimeCharacter } from "./types";

const ANILIST_API_URL = "https://graphql.anilist.co";
const metadataCache = new Map<string, EnrichedMetadata>();

const ANILIST_QUERY = `
query ($search: String) {
  Media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
    title {
      romaji
      english
      native
    }
    description(asHtml: false)
    studios(isMain: true) {
      nodes {
        name
      }
    }
    season
    seasonYear
    status
    format
    duration
    averageScore
    source
    trailer {
      id
      site
    }
    characters(sort: ROLE, perPage: 8) {
      edges {
        role
        node {
          name {
            full
          }
          image {
            medium
          }
        }
      }
    }
  }
}
`;

function cleanQueryTitle(raw: string): string {
  return raw
    .replace(/\(.*?\)/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/Season\s+\d+/i, "")
    .replace(/Part\s+\d+/i, "")
    .replace(/S\d+/i, "")
    .replace(/Dual\s+Audio/i, "")
    .replace(/Hindi\s+Dub/i, "")
    .trim();
}

export async function fetchAniListMetadata(animeTitle: string): Promise<EnrichedMetadata | null> {
  const searchKey = cleanQueryTitle(animeTitle).toLowerCase();
  if (metadataCache.has(searchKey)) {
    return metadataCache.get(searchKey)!;
  }

  try {
    const res = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: ANILIST_QUERY,
        variables: { search: searchKey },
      }),
      signal: AbortSignal.timeout(1000),
      next: { revalidate: 86400 }, // Cache metadata for 24 hours
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const media = data?.data?.Media;
    if (!media) return null;

    const characters: AnimeCharacter[] = (media.characters?.edges || []).map((edge: any) => ({
      name: edge.node?.name?.full || "Unknown",
      role: edge.role || "MAIN",
      image: edge.node?.image?.medium || "",
    }));

    const studio = media.studios?.nodes?.[0]?.name || "Unknown Studio";

    const enriched: EnrichedMetadata = {
      romajiTitle: media.title?.romaji || "",
      englishTitle: media.title?.english || "",
      nativeTitle: media.title?.native || "",
      studio,
      season: media.season || "",
      seasonYear: String(media.seasonYear || ""),
      status: media.status || "FINISHED",
      format: media.format || "TV",
      duration: media.duration || 24,
      averageScore: media.averageScore || 80,
      source: media.source || "Manga",
      trailerId: media.trailer?.id,
      characters,
    };

    metadataCache.set(searchKey, enriched);
    return enriched;
  } catch (err) {
    console.warn(`[AniList] Failed to enrich metadata for "${animeTitle}":`, err);
    return null;
  }
}
