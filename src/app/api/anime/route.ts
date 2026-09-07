import { NextRequest, NextResponse } from "next/server";
import { fetchAllAnime, searchAnime, getTrendingAnime, getHindiDubbedAnime } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true" || searchParams.get("purge") === "true";
    const query = searchParams.get("q");
    const genre = searchParams.get("genre");
    const trending = searchParams.get("trending");
    const hindi = searchParams.get("hindi");
    let animeList = await fetchAllAnime(force);

    if (query) {
      animeList = await searchAnime(query);
    } else if (trending === "true") {
      animeList = await getTrendingAnime();
    } else if (hindi === "true") {
      animeList = await getHindiDubbedAnime();
    }

    if (genre) {
      const g = genre.toLowerCase();
      animeList = animeList.filter((a) =>
        a.genres.some((item) => item.toLowerCase() === g)
      );
    }

    const limitParam = searchParams.get("limit");
    const limit = limitParam === "all" || limitParam === "-1" || limitParam === "0" ? animeList.length : parseInt(limitParam || "50", 10);

    return NextResponse.json(animeList.slice(0, limit), {
      headers: {
        "Cache-Control": force
          ? "no-cache, no-store, must-revalidate"
          : "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error: any) {
    console.error("[AnimeAPI] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime", message: error.message },
      { status: 500 }
    );
  }
}
