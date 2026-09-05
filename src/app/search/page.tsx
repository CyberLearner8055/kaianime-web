import React, { Suspense } from "react";
import type { Metadata } from "next";
import { fetchAllAnime, getAllGenres } from "@/lib/data";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Browse & Search Anime Catalog | KaiAnime.site",
  description:
    "Search and browse our entire database of anime series and movies. Filter by genre, Hindi dub, rating, and watch with zero ads on KaiAnime.site.",
};

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const [allAnime, allGenres] = await Promise.all([
    fetchAllAnime(),
    getAllGenres(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchClient initialAnime={allAnime} allGenres={allGenres} />
    </Suspense>
  );
}
