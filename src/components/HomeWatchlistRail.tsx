"use client";

import React from "react";
import Link from "next/link";
import { Heart, ChevronRight, Play } from "lucide-react";
import { useWatchlist, WatchlistItem } from "@/lib/watchlist";
import AnimeCard from "./AnimeCard";
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

export default function HomeWatchlistRail() {
  const { watchlist, count, isLoaded } = useWatchlist();

  if (!isLoaded || count === 0) {
    return null;
  }

  return (
    <section className="my-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-400 shadow-inner">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>My Watchlist</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-600/30 text-rose-300 border border-rose-500/30">
                {count} {count === 1 ? "saved" : "saved"}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Your saved anime collection ready to stream
            </p>
          </div>
        </div>

        <Link
          href="/watchlist"
          className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors group"
        >
          <span>View All Watchlist</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Horizontal Scrollable Rail */}
      <div className="relative">
        <div className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x">
          {watchlist.map((item) => {
            const anime = itemToAnime(item);
            return (
              <div
                key={item.id}
                className="w-[140px] sm:w-[170px] md:w-[190px] shrink-0 snap-start"
              >
                <AnimeCard anime={anime} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
