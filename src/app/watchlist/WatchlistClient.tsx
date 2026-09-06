"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Heart,
  Play,
  Trash2,
  Sparkles,
  Search,
  Star,
  Film,
  ArrowRight,
  RefreshCw,
  Compass,
} from "lucide-react";
import { useWatchlist, WatchlistItem } from "@/lib/watchlist";
import AnimeCard from "@/components/AnimeCard";
import { Anime } from "@/lib/types";

function itemToAnime(item: WatchlistItem): Anime {
  return {
    id: item.id,
    originalId: item.id,
    title: item.title,
    synopsis: "",
    genres: item.genres || ["Action", "Adventure"],
    poster: item.poster,
    type: item.type || "TV",
    status: "Completed",
    rating: item.rating || 8.5,
    episodesCount: item.episodesCount || 1,
    episodes: [{ id: `${item.id}-1`, number: 1, title: "Episode 1", servers: {} }],
    seasons: [1],
    isHindiDubbed: true,
  };
}

export default function WatchlistClient() {
  const { watchlist, isLoaded, clear, remove, count } = useWatchlist();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "rating" | "title">("recent");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredList = useMemo(() => {
    let list = [...watchlist];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) => item.title.toLowerCase().includes(q));
    }

    if (sortBy === "recent") {
      list.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [watchlist, searchQuery, sortBy]);

  if (!isLoaded) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading your watchlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 sm:p-10 mb-8 bg-gradient-to-br from-rose-950/20 via-slate-900/50 to-[#08090D]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-3">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>Personal Collection</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>My Watchlist</span>
              {count > 0 && (
                <span className="text-sm sm:text-base font-bold px-3 py-0.5 rounded-full bg-rose-600/30 text-rose-300 border border-rose-500/30">
                  {count} {count === 1 ? "Anime" : "Anime Series"}
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
              Quickly resume and stream your saved anime series anytime in 1080p Ultra HD with Hindi Dub and English Subtitles.
            </p>
          </div>

          {/* Action Bar */}
          {count > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              {showClearConfirm ? (
                <div className="flex items-center gap-2 bg-rose-950/50 border border-rose-500/40 p-1.5 rounded-2xl animate-fade-in">
                  <span className="text-xs text-rose-300 font-medium px-2">Clear all?</span>
                  <button
                    onClick={() => {
                      clear();
                      setShowClearConfirm(false);
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Yes, Clear
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-600/20 text-slate-300 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear List</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filter & Search Toolbar (When items exist) */}
      {count > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Search within Watchlist */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in your watchlist..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/60 transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-400 font-medium">Sort by:</span>
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setSortBy("recent")}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  sortBy === "recent"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Recently Added
              </button>
              <button
                onClick={() => setSortBy("rating")}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  sortBy === "rating"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Top Rated
              </button>
              <button
                onClick={() => setSortBy("title")}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  sortBy === "title"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                A-Z
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {count === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center glass-panel rounded-3xl border border-white/10 px-4">
          <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-5 shadow-inner">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            Your Watchlist is Empty
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-8">
            Click the <Heart className="w-3.5 h-3.5 inline text-rose-500 fill-rose-500 mx-1" /> heart icon on any anime poster or detail page to add it to your personal watchlist.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xl shadow-blue-600/30 transition-all active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Trending Anime</span>
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Search Catalog</span>
            </Link>
          </div>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="py-16 text-center glass-panel rounded-3xl border border-white/10">
          <p className="text-slate-300 font-semibold text-sm mb-2">
            No anime found matching &ldquo;{searchQuery}&rdquo;
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-blue-400 hover:underline cursor-pointer"
          >
            Clear search query
          </button>
        </div>
      ) : (
        /* Cards Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {filteredList.map((item) => {
            const animeObj = itemToAnime(item);
            return (
              <div key={item.id} className="relative group">
                <AnimeCard anime={animeObj} />
                {/* Direct quick watch link */}
                <Link
                  href={`/watch/${item.id}/1`}
                  className="mt-2 w-full py-2 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Stream Ep 1</span>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
