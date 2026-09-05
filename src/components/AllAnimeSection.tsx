"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Mic, X, ChevronDown, Sparkles } from "lucide-react";
import { Anime } from "@/lib/types";
import AnimeCard from "./AnimeCard";

interface AllAnimeSectionProps {
  initialAnime: Anime[];
  allGenres: string[];
}

export default function AllAnimeSection({ initialAnime, allGenres }: AllAnimeSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [onlyHindi, setOnlyHindi] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(24);

  // Popular quick-filter genres
  const popularGenres = ["Action", "Fantasy", "Romance", "Comedy", "Adventure", "Sci-Fi", "Drama", "Mystery"];

  const filteredAnime = useMemo(() => {
    return initialAnime.filter((anime) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = anime.title.toLowerCase().includes(q);
        const matchesJp = anime.japaneseTitle?.toLowerCase().includes(q);
        const matchesGenre = anime.genres.some((g) => g.toLowerCase().includes(q));
        if (!matchesTitle && !matchesJp && !matchesGenre) return false;
      }

      // 2. Genre Filter
      if (selectedGenre) {
        const g = selectedGenre.toLowerCase();
        if (g === "isekai") {
          const isIsekai =
            anime.genres.some((x) => x.toLowerCase().includes("isekai") || x.toLowerCase().includes("fantasy")) ||
            anime.title.toLowerCase().includes("reincarnat") ||
            anime.title.toLowerCase().includes("another world") ||
            anime.title.toLowerCase().includes("isekai");
          if (!isIsekai) return false;
        } else {
          if (!anime.genres.some((item) => item.toLowerCase().includes(g))) {
            return false;
          }
        }
      }

      // 3. Hindi Dub Filter
      if (onlyHindi && !anime.isHindiDubbed) {
        return false;
      }

      return true;
    });
  }, [initialAnime, searchQuery, selectedGenre, onlyHindi]);

  const displayedAnime = useMemo(() => {
    return filteredAnime.slice(0, visibleCount);
  }, [filteredAnime, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 24);
  };

  const handleSelectGenre = (genre: string) => {
    setSelectedGenre((prev) => (prev === genre ? "" : genre));
    setVisibleCount(24);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("");
    setOnlyHindi(false);
    setVisibleCount(24);
  };

  const hasActiveFilters = Boolean(searchQuery || selectedGenre || onlyHindi);

  return (
    <section id="all-anime" className="py-8 sm:py-12 space-y-6 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              All Anime (Complete Library)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore our vast catalog of {initialAnime.length}+ anime titles with 100% ad-free streaming
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-400">
          Showing <span className="text-white font-bold">{displayedAnime.length}</span> of{" "}
          <span className="text-blue-400 font-bold">{filteredAnime.length}</span> titles
        </div>
      </div>

      {/* Interactive Filter Bar */}
      <div className="glass-panel p-3.5 sm:p-5 rounded-2xl space-y-4 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(24);
              }}
              placeholder="Filter catalog by title or keyword..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Hindi Dub Toggle & Reset */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setOnlyHindi(!onlyHindi);
                setVisibleCount(24);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                onlyHindi
                  ? "bg-emerald-500 text-black border-emerald-400 shadow-md"
                  : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Hindi Dub Only</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Genre Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => handleSelectGenre("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              !selectedGenre
                ? "bg-blue-600 text-white border border-blue-400 shadow-sm"
                : "bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleSelectGenre("Isekai")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedGenre === "Isekai"
                ? "bg-blue-600 text-white border border-blue-400 shadow-sm"
                : "bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            Isekai
          </button>
          {popularGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleSelectGenre(genre)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedGenre === genre
                  ? "bg-blue-600 text-white border border-blue-400 shadow-sm"
                  : "bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Anime Cards */}
      {displayedAnime.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {displayedAnime.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-slate-400 glass-panel rounded-2xl p-8 space-y-2">
          <p className="text-base font-bold text-white">No anime found matching your filter</p>
          <p className="text-xs text-slate-400">Try changing the search query or resetting genre filters</p>
          <button
            onClick={clearFilters}
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Load More Button */}
      {displayedAnime.length < filteredAnime.length && (
        <div className="pt-6 text-center">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/5 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm border border-white/10 hover:border-blue-500 transition-all duration-200 active:scale-95 shadow-lg"
          >
            <span>Load More Anime</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}
