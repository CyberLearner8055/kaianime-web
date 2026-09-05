import { NextResponse } from "next/server";
import { getSpotlightAnime } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const spotlights = await getSpotlightAnime();
    const data = spotlights.map((a) => ({
      id: a.id,
      originalId: a.originalId,
      title: a.title,
      poster: a.poster,
      banner: a.banner,
      rating: a.rating,
      genres: a.genres,
      type: a.type,
      status: a.status,
    }));

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal trending error" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
