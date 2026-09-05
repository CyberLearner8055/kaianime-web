"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Trash2, Clock } from "lucide-react";

interface WatchHistoryItem {
  id: string;
  title: string;
  poster: string;
  episodeNumber: number;
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
            href={`/watch/${item.id}/${item.episodeNumber}`}
            className="group relative rounded-xl overflow-hidden bg-[#0d1017] border border-white/8 hover:border-blue-500/40 transition-all block"
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
                Ep {item.episodeNumber}
              </span>
            </div>

            <div className="p-2">
              <h3 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
