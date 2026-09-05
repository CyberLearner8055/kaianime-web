import React from "react";
import Link from "next/link";
import { Star, Play, Layers } from "lucide-react";
import { Anime } from "@/lib/types";

interface AnimeCardProps {
  anime: Anime;
  priority?: boolean;
  rank?: number;
}

export default function AnimeCard({ anime, priority = false, rank }: AnimeCardProps) {
  const firstEpisode = anime.episodes && anime.episodes.length > 0 ? anime.episodes[0].number : 1;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-[#0e131f]/75 border border-white/5 hover:border-blue-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/15 overflow-hidden">
      {/* Poster Media */}
      <Link
        href={`/anime/${anime.id}`}
        className="relative block aspect-[2/3] w-full overflow-hidden bg-slate-900"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={anime.poster}
          alt={anime.title}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-108"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-transparent to-black/35 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wide bg-blue-600 text-white shadow-md rounded-md backdrop-blur-sm">
              Hindi Dub
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-black/60 text-slate-200 border border-white/10 rounded-md backdrop-blur-sm">
              HD
            </span>
          </div>

          <div className="flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-bold bg-black/75 text-amber-300 border border-amber-500/20 rounded-md backdrop-blur-sm">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{anime.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Rank Watermark for Top 10 */}
        {rank !== undefined && (
          <div className="absolute bottom-1 left-2 pointer-events-none text-5xl font-black italic tracking-tighter text-white/15 group-hover:text-blue-500/30 transition-colors drop-shadow">
            #{rank}
          </div>
        )}

        {/* Center Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/50 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Bottom Episode Pill */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-300 pointer-events-none">
          <span className="flex items-center gap-1 px-2 py-0.5 bg-black/80 rounded-md border border-white/10 font-medium">
            <Layers className="w-3 h-3 text-blue-400" />
            {anime.episodesCount} Ep
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {anime.type || "Series"}
          </span>
        </div>
      </Link>

      {/* Info Details */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-1.5">
        <div>
          <h3 className="font-bold text-sm text-white hover:text-blue-400 transition-colors line-clamp-1">
            <Link
              href={`/anime/${anime.id}`}
              title={anime.title}
            >
              {anime.title}
            </Link>
          </h3>
          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
            {anime.genres.slice(0, 2).join(" • ") || "Anime"}
          </p>
        </div>

        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate">{anime.year}</span>
          <Link
            href={`/watch/${anime.id}/${firstEpisode}`}
            className="font-bold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
          >
            Watch <Play className="w-2.5 h-2.5 fill-current" />
          </Link>
        </div>
      </div>
    </div>
  );
}
