"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Filter, Mic, Star, Layers, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Anime } from "@/lib/types";
import AnimeCard from "@/components/AnimeCard";

interface SearchClientProps {
  initialAnime: Anime[];
  allGenres: string[];
}

export default function SearchClient({ initialAnime, allGenres }: SearchClientProps) {
  const searchParams = useSearchParams();

  const queryParam = searchParams.get("q") || "";
  const genreParam = searchParams.get("genre") || "";
  const filterParam = searchParams.get("filter") || "";
  const langParam = (searchParams.get("lang") || "").toLowerCase().trim();
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const [query, setQuery] = useState(queryParam);
  const [selectedGenre, setSelectedGenre] = useState<string>(genreParam);
  const [onlyHindi, setOnlyHindi] = useState<boolean>(filterParam === "hindi");
  const [sortBy, setSortBy] = useState<"rating" | "latest" | "title">(
    filterParam === "top" ? "rating" : "title"
  );

  const ITEMS_PER_PAGE = 24;

  const filteredAnime = useMemo(() => {
    return initialAnime
      .filter((anime) => {
        // Language filter from Sidebar
        if (langParam) {
          // If Hindi, English, or Japanese: show all anime as virtually all titles support these
          if (langParam === "hindi" || langParam === "english" || langParam === "japanese") {
            // Match all
          } else {
            // Specific regional or foreign languages: Tamil, Telugu, Kannada, Malayalam, Bengali, Korean, Chinese, Marathi
            const animeLangs = (anime.langs || "").toLowerCase();
            if (!animeLangs.includes(langParam)) {
              return false;
            }
          }
        }

        // Query filter
        if (query.trim()) {
          const q = query.toLowerCase().trim();
          const matchesTitle = anime.title.toLowerCase().includes(q);
          const matchesJp = anime.japaneseTitle?.toLowerCase().includes(q);
          const matchesGenre = anime.genres.some((g) => g.toLowerCase().includes(q));
          if (!matchesTitle && !matchesJp && !matchesGenre) return false;
        }

        // Genre filter
        if (selectedGenre) {
          const g = selectedGenre.toLowerCase();
          if (!anime.genres.some((item) => item.toLowerCase() === g)) {
            return false;
          }
        }

        // Hindi Dub filter
        if (onlyHindi && !anime.isHindiDubbed) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return 0; // default order from data
      });
  }, [initialAnime, langParam, query, selectedGenre, onlyHindi, sortBy]);

  const totalItems = filteredAnime.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);

  const paginatedAnime = useMemo(() => {
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredAnime.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAnime, safePage]);

  const clearFilters = () => {
    setQuery("");
    setSelectedGenre("");
    setOnlyHindi(false);
    setSortBy("latest");
  };

  const hasActiveFilters = Boolean(query || selectedGenre || onlyHindi || sortBy !== "latest");

  const getPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedGenre) params.set("genre", selectedGenre);
    if (onlyHindi) params.set("filter", "hindi");
    if (sortBy !== "latest") params.set("sort", sortBy);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return `/search${qs ? "?" + qs : ""}`;
  };

  const startCount = totalItems > 0 ? (safePage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endCount = Math.min(safePage * ITEMS_PER_PAGE, totalItems);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search Bar */}
      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Browse & Search Anime
        </h1>
        <p className="text-slate-400 text-sm">
          Explore hundreds of series and movies with zero ads, high-speed streaming, and Hindi dubs.
        </p>

        {/* Input bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anime by title, character, or genre..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Hindi Dub Toggle */}
            <button
              onClick={() => setOnlyHindi(!onlyHindi)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                onlyHindi
                  ? "bg-blue-600/25 text-blue-400 border-blue-500/40"
                  : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Hindi Dub Only</span>
            </button>

            {/* Active Language Badge if selected from Sidebar */}
            {langParam && (
              <Link
                href="/search"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
                title="Clear Language Filter"
              >
                <span className="capitalize">{langParam} Audio</span>
                <X className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            )}

            {/* Sort options */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-medium">
              <button
                onClick={() => setSortBy("latest")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  sortBy === "latest" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Featured
              </button>
              <button
                onClick={() => setSortBy("rating")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  sortBy === "rating" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Top Rated
              </button>
              <button
                onClick={() => setSortBy("title")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  sortBy === "title" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                A-Z
              </button>
            </div>
          </div>

          {/* Active Filter Count / Reset */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Genre Quick Filter Chips */}
        <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
          <button
            onClick={() => setSelectedGenre("")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              !selectedGenre
                ? "bg-blue-600 text-white font-bold"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            All Genres
          </button>
          {allGenres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(selectedGenre === g ? "" : g)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedGenre === g
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white">{startCount}-{endCount}</strong> of <strong className="text-white">{totalItems}</strong> anime (Page {safePage} of {totalPages})
        </span>
        {selectedGenre && (
          <span>
            Filtered by genre: <strong className="text-blue-400">{selectedGenre}</strong>
          </span>
        )}
      </div>

      {/* Anime Grid */}
      {filteredAnime.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-2xl space-y-3">
          <p className="text-base text-white font-bold">No anime matching your search</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, clearing genre filters, or browsing the full catalog.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {paginatedAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>

          {/* Crawlable Pagination Bar */}
          {totalPages > 1 && (
            <div className="pt-8 pb-4 flex flex-wrap items-center justify-center gap-2">
              {safePage > 1 ? (
                <Link
                  href={getPageUrl(safePage - 1)}
                  rel="prev"
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </Link>
              ) : (
                <span className="px-3.5 py-2 rounded-xl bg-white/5 text-slate-600 border border-white/5 text-xs font-bold cursor-not-allowed flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </span>
              )}

              {/* Page Number Pills */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  return (
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - safePage) <= 2
                  );
                })
                .map((p, idx, arr) => {
                  const prevP = arr[idx - 1];
                  const hasGap = prevP && p - prevP > 1;

                  return (
                    <React.Fragment key={p}>
                      {hasGap && (
                        <span className="px-2 text-xs text-slate-500 font-bold">...</span>
                      )}
                      <Link
                        href={getPageUrl(p)}
                        className={`w-9 h-9 rounded-xl text-xs font-black flex items-center justify-center transition-all ${
                          p === safePage
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40 scale-105"
                            : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/8"
                        }`}
                      >
                        {p}
                      </Link>
                    </React.Fragment>
                  );
                })}

              {safePage < totalPages ? (
                <Link
                  href={getPageUrl(safePage + 1)}
                  rel="next"
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="px-3.5 py-2 rounded-xl bg-white/5 text-slate-600 border border-white/5 text-xs font-bold cursor-not-allowed flex items-center gap-1">
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
