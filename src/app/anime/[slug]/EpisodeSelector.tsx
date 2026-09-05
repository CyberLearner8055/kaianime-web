"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Layers, Search } from "lucide-react";
import { Episode } from "@/lib/types";

interface EpisodeSelectorProps {
  animeId: string;
  episodes: Episode[];
  seasons: number[];
  isHindiDubbed?: boolean;
}

export default function EpisodeSelector({
  animeId,
  episodes,
  seasons,
  isHindiDubbed = false,
}: EpisodeSelectorProps) {
  const [selectedSeason, setSelectedSeason] = useState<number>(seasons[0] || 1);
  const [searchFilter, setSearchFilter] = useState<string>("");

  const seasonEpisodes = episodes.filter(
    (ep) => (ep.season || 1) === selectedSeason
  );

  const filteredEpisodes = seasonEpisodes.filter((ep) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      ep.number.toString().includes(q) ||
      ep.title.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-black text-white tracking-tight">
            Episodes ({episodes.length})
          </h2>
        </div>

        {/* Search inside episodes */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Ep #"
              className="w-24 sm:w-28 pl-8 pr-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Season Tabs if multiple seasons */}
      {seasons.length > 1 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {seasons.map((sNum) => (
            <button
              key={sNum}
              onClick={() => setSelectedSeason(sNum)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSeason === sNum
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-500"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
              }`}
            >
              Season {sNum}
            </button>
          ))}
        </div>
      )}

      {/* Episode Grid */}
      {filteredEpisodes.length === 0 ? (
        <div className="p-8 rounded-2xl glass-panel text-center text-slate-400 text-xs">
          No episodes found matching your filter.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 max-h-[460px] overflow-y-auto p-1 pr-2">
          {filteredEpisodes.map((ep) => (
            <Link
              key={ep.id}
              href={`/watch/${animeId}/${ep.number}`}
              className="group relative flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 transition-all duration-200 hover:scale-103 shadow-sm hover:shadow-lg hover:shadow-blue-900/30"
            >
              <div className="flex items-center gap-1">
                <Play className="w-3 h-3 text-blue-400 group-hover:text-white fill-current opacity-75 group-hover:opacity-100" />
                <span className="text-xs font-black text-white group-hover:text-white">
                  EP {ep.number}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-blue-100 font-medium mt-1">
                {isHindiDubbed ? "Dub & Sub" : "English Sub"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
