"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Trash2, Clock } from "lucide-react";

interface WatchHistoryItem {
  id: string;
  title: string;
  poster: string;
  episodeNumber: number;
  season?: number;
  currentTime?: number;
  duration?: number;
  progressPercent?: number;
  timestamp: number;
}

export default function ContinueWatchingSection() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kaianime_history");
      if (saved) {
        const parsed: WatchHistoryItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed.slice(0, 6));
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleClearAll = () => {
    localStorage.removeItem("kaianime_history");
    setHistory([]);
  };

  if (history.length === 0) return null;

  return (
    <section className="my-8">
      {/* Head */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg sm:text-xl font-black text-white">Continue Watching</h2>
        </div>
        <button
          onClick={handleClearAll}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs font-semibold transition-colors"
          title="Clear History"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      {/* History Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {history.map((item) => (
          <Link
            key={item.id}
            href={`/watch/${item.id}/${item.episodeNumber}${item.season && item.season > 1 ? `?season=${item.season}` : ""}`}
            className="group relative rounded-xl overflow-hidden bg-[#0d1017] border border-white/8 hover:border-blue-500/40 transition-all block shadow-lg"
          >
            <div className="aspect-[2/3] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.poster}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[10px] font-extrabold text-white">
                {item.season && item.season > 1 ? `S${item.season} ` : ""}Ep {item.episodeNumber}
              </span>

              {/* Progress bar across bottom of thumbnail */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/80 overflow-hidden">
                <div
                  className="h-full bg-red-600 rounded-r-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, item.progressPercent || 0))}%` }}
                />
              </div>
            </div>

            <div className="p-2.5">
              <h3 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span className="font-semibold text-slate-300">EP {item.episodeNumber}</span>
                {typeof item.progressPercent === "number" && item.progressPercent > 0 ? (
                  <span className="text-red-400 font-bold">{Math.round(item.progressPercent)}% watched</span>
                ) : (
                  <span className="text-blue-400 font-medium">Resume</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
