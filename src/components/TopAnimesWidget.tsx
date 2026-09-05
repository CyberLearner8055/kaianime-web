"use client";

import React from "react";
import Link from "next/link";
import { Star, Flame } from "lucide-react";
import { Anime } from "@/lib/types";

interface TopAnimesWidgetProps {
  topAnime: Anime[];
}

export default function TopAnimesWidget({ topAnime }: TopAnimesWidgetProps) {
  // Direct Top 10 list without redundant tabs
  const top10 = topAnime.slice(0, 10);

  return (
    <section className="my-8">
      {/* Clean Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-white/8 mb-5">
        <Flame className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Top Animes
        </h2>
      </div>

      {/* Top 10 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
        {top10.map((anime, idx) => (
          <Link
            key={anime.id}
            href={`/anime/${anime.id}`}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0a0d14] hover:bg-[#101420] border border-white/8 hover:border-blue-500/40 transition-all group"
          >
            {/* Rank Number */}
            <span
              className={`w-7 text-center font-black text-lg ${
                idx === 0
                  ? "text-blue-400"
                  : idx === 1
                  ? "text-slate-200"
                  : idx === 2
                  ? "text-blue-500"
                  : "text-slate-500"
              }`}
            >
              {String(idx + 1).padStart(2, "0")}
            </span>

            {/* Thumbnail Poster */}
            <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900 border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={anime.poster}
                alt={anime.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors truncate">
                {anime.title}
              </h3>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {anime.genres.slice(0, 2).join(", ") || "Anime"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-bold">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {anime.rating ? Number(anime.rating).toFixed(1) : "8.5"}
                </span>
                <span className="text-[10px] text-slate-400">
                  {anime.episodesCount ? `${anime.episodesCount} Ep` : "Series"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
