"use client";

import React from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { Anime } from "@/lib/types";

interface AnimeTadkaCardProps {
  anime: Anime;
  priority?: boolean;
}

export default function AnimeTadkaCard({ anime, priority = false }: AnimeTadkaCardProps) {
  const isMovie = anime.type?.toLowerCase() === "movie" || anime.episodesCount === 1;
  const seBadgeText = isMovie
    ? "Movie"
    : anime.episodesCount
    ? `Ep ${anime.episodesCount}`
    : "Series";

  // Language badge: NEVER show "Sub". All anime have Hindi, English, Japanese
  let audioBadgeText = "Hindi Dub";
  if (anime.langs && anime.langs.toLowerCase().includes("hin")) {
    audioBadgeText = "Hindi Dub";
  } else if (anime.langs && anime.langs.toLowerCase().includes("multi")) {
    audioBadgeText = "Multi Audio";
  } else {
    audioBadgeText = "Hin • Eng • Jpn";
  }

  return (
    <div className="anime-card group">
      <Link href={`/anime/${anime.id}`} className="block">
        <div className="poster-box relative aspect-[2/3] rounded-xl overflow-hidden bg-[#0a0d14] border border-white/8 group-hover:border-blue-500/50 transition-all duration-300">
          {/* Top-Left Season/Episode or Movie Badge & Live Ongoing Pill */}
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1 z-10 pointer-events-none">
            {anime.status === "Ongoing" && (
              <span className="px-1.5 py-0.5 text-[10px] font-black bg-amber-400 text-black rounded-md shadow-md flex items-center gap-1 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                Ongoing
              </span>
            )}
            <span className={`badge se-badge px-2 py-0.5 text-[10px] font-extrabold rounded-md ${
              isMovie
                ? "bg-blue-600 text-white"
                : "bg-black/80 backdrop-blur-md text-white border border-white/10"
            }`}>
              {seBadgeText}
            </span>
          </div>

          {/* Top-Right Audio Badge: Guaranteed Hindi / Multi Audio */}
          <span className="badge meta-badge absolute top-2 right-2 px-2 py-0.5 text-[10px] font-extrabold rounded-md z-10 bg-blue-600 text-white shadow-md">
            {audioBadgeText}
          </span>

          {/* Circular Play Button on Hover */}
          <div className="play-hover absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 transform scale-80 group-hover:scale-100 transition-transform duration-250">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>

          {/* Poster Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={anime.poster}
            alt={anime.title}
            loading={priority ? "eager" : "lazy"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Details Title */}
        <div className="card-details pt-2">
          <h3 className="card-title text-xs sm:text-[13px] font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1" title={anime.title}>
            {anime.title}
          </h3>
        </div>
      </Link>
    </div>
  );
}
