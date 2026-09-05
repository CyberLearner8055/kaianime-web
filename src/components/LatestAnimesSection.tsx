"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { Anime } from "@/lib/types";
import AnimeTadkaCard from "./AnimeTadkaCard";

interface LatestAnimesSectionProps {
  allAnime: Anime[];
}

export default function LatestAnimesSection({ allAnime }: LatestAnimesSectionProps) {
  const [activeTab, setActiveTab] = useState<"all" | "series" | "movies">("all");

  const filtered = allAnime.filter((a) => {
    if (activeTab === "all") return true;
    const isMovie = a.type?.toLowerCase() === "movie" || a.episodesCount === 1;
    if (activeTab === "movies") return isMovie;
    if (activeTab === "series") return !isMovie;
    return true;
  });

  const displayList = filtered.slice(0, 18);

  return (
    <section className="my-8" id="latest-updates">
      {/* Header with Title & Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/8 mb-6">
        <div className="flex items-center gap-2.5">
          <Clock className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Latest Animes
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="at-text-tabs">
          <button
            onClick={() => setActiveTab("all")}
            className={`at-txt-tab ${activeTab === "all" ? "active" : ""}`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("series")}
            className={`at-txt-tab ${activeTab === "series" ? "active" : ""}`}
          >
            Series
          </button>
          <button
            onClick={() => setActiveTab("movies")}
            className={`at-txt-tab ${activeTab === "movies" ? "active" : ""}`}
          >
            Movies
          </button>
        </div>
      </div>

      {/* Grid of Anime Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {displayList.map((anime) => (
          <AnimeTadkaCard key={anime.id} anime={anime} />
        ))}
      </div>

      {/* View All Animes Bottom Button */}
      <div className="text-center mt-8">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm transition-all hover:scale-102"
        >
          <span>View All Animes</span>
          <ChevronRight className="w-4 h-4 text-blue-400" />
        </Link>
      </div>
    </section>
  );
}
