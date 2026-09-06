"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useWatchlist } from "@/lib/watchlist";

interface WatchlistButtonProps {
  anime: {
    id: string;
    title: string;
    poster: string;
    rating?: number;
    episodesCount?: number;
    genres?: string[];
    type?: string;
    year?: string | number;
  };
  variant?: "icon" | "button" | "pill";
  className?: string;
}

export default function WatchlistButton({
  anime,
  variant = "icon",
  className = "",
}: WatchlistButtonProps) {
  const { isInWatchlist, toggle, isLoaded } = useWatchlist();
  const [active, setActive] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setActive(isInWatchlist(anime.id));
    }
  }, [isLoaded, isInWatchlist, anime.id]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    setTimeout(() => setAnimating(false), 350);

    const newState = toggle({
      id: anime.id,
      title: anime.title,
      poster: anime.poster,
      rating: anime.rating,
      episodesCount: anime.episodesCount,
      genres: anime.genres,
      type: anime.type,
      year: anime.year,
    });
    setActive(newState);
  };

  if (variant === "button") {
    if (active) {
      return (
        <div className={`w-full flex items-center gap-2 ${className}`}>
          <button
            onClick={handleClick}
            type="button"
            className="flex-1 py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all duration-200 cursor-pointer bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border-rose-500/40 shadow-lg shadow-rose-950/30"
            title="Click to remove from Watchlist"
          >
            <Heart
              className={`w-4 h-4 transition-transform fill-rose-500 text-rose-500 ${
                animating ? "scale-125" : "scale-100"
              }`}
            />
            <span>Saved in Watchlist ✓</span>
          </button>
          <Link
            href="/watchlist"
            className="py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 transition-all active:scale-95 shrink-0"
          >
            <span>Open List</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      );
    }
    return (
      <button
        onClick={handleClick}
        type="button"
        className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all duration-200 cursor-pointer bg-white/5 hover:bg-white/10 text-slate-200 border-white/10 ${className}`}
      >
        <Heart
          className={`w-4 h-4 transition-transform text-slate-300 ${
            animating ? "scale-125" : "scale-100"
          }`}
        />
        <span>+ Add to Watchlist</span>
      </button>
    );
  }

  if (variant === "pill") {
    if (active) {
      return (
        <div className={`inline-flex items-center gap-1.5 ${className}`}>
          <button
            onClick={handleClick}
            type="button"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer bg-rose-500/20 text-rose-400 border-rose-500/40"
            title="Click to remove from Watchlist"
          >
            <Heart
              className={`w-3.5 h-3.5 fill-rose-500 text-rose-500 ${
                animating ? "scale-125" : "scale-100"
              }`}
            />
            <span>Watchlist ✓</span>
          </button>
          <Link
            href="/watchlist"
            className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-bold bg-blue-600/80 hover:bg-blue-500 text-white transition-all shadow-sm"
            title="Open My Watchlist"
          >
            <span>List &rarr;</span>
          </Link>
        </div>
      );
    }
    return (
      <button
        onClick={handleClick}
        type="button"
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10 ${className}`}
        title="Add to Watchlist"
      >
        <Heart
          className={`w-3.5 h-3.5 text-slate-400 ${
            animating ? "scale-125" : "scale-100"
          }`}
        />
        <span>+ Watchlist</span>
      </button>
    );
  }

  // Default "icon" variant for AnimeCard
  return (
    <button
      onClick={handleClick}
      type="button"
      aria-label={active ? "Remove from Watchlist" : "Add to Watchlist"}
      title={active ? "Remove from Watchlist" : "Add to Watchlist"}
      className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer z-10 ${
        active
          ? "bg-rose-600/90 text-white shadow-lg shadow-rose-600/40 scale-105"
          : "bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white border border-white/15 hover:border-white/30"
      } ${className}`}
    >
      <Heart
        className={`w-3.5 h-3.5 transition-transform ${
          active ? "fill-current" : ""
        } ${animating ? "scale-125" : "scale-100"}`}
      />
    </button>
  );
}
