import React, { Suspense } from "react";
import type { Metadata } from "next";
import { fetchAllAnime, getAllGenres } from "@/lib/data";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Browse & Search Anime Catalog | KaiAnime.me",
  description:
    "Search and browse our entire database of anime series and movies. Filter by genre, Hindi dub, rating, and watch with zero ads on KaiAnime.me.",
  alternates: {
    canonical: "https://kaianime.me/search",
  },
};

export const dynamic = "force-dynamic";

function toSearchAnime(a: any) {
  return {
    id: a.id,
    title: a.title,
    japaneseTitle: a.japaneseTitle,
    poster: a.poster,
    genres: a.genres || [],
    rating: a.rating || 0,
    isHindiDubbed: Boolean(a.isHindiDubbed),
    type: a.type || "TV",
    status: a.status || "Completed",
    episodesCount: a.episodesCount || 1,
    langs: a.langs || "Hindi, English, Japanese",
    seasons: [],
    episodes: [{ id: `${a.id}-1`, number: 1, title: "Episode 1", servers: {} }],
  };
}

export default async function SearchPage() {
  const [allAnime, allGenres] = await Promise.all([
    fetchAllAnime(),
    getAllGenres(),
  ]);

  const searchAnimeList = allAnime.map(toSearchAnime);

  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchClient initialAnime={searchAnimeList as any} allGenres={allGenres} />
    </Suspense>
  );
}
