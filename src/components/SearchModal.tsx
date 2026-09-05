"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Star, Play, Sparkles } from "lucide-react";
import { Anime } from "@/lib/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/anime?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.slice(0, 8));
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl glass-panel rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-10">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-blue-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anime by title, genre, or keyword..."
            className="flex-1 bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-slate-400 bg-white/5 border border-white/10 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {loading && (
            <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Searching anime database...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-10 text-center text-xs text-slate-400">
              No anime found for &quot;{query}&quot;. Try another title or keyword.
            </div>
          )}

          {!loading && !query && (
            <div className="py-8 px-4 text-center">
              <Sparkles className="w-6 h-6 text-blue-400/60 mx-auto mb-2" />
              <p className="text-xs text-slate-400">
                Type an anime name like <span className="text-blue-400 font-semibold">&quot;Solo Leveling&quot;</span>,{" "}
                <span className="text-blue-400 font-semibold">&quot;Naruto&quot;</span>, or{" "}
                <span className="text-blue-400 font-semibold">&quot;Jujutsu Kaisen&quot;</span>
              </p>
            </div>
          )}

          {results.map((anime) => (
            <Link
              key={anime.id}
              href={`/anime/${anime.id}`}
              onClick={onClose}
              className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                    {anime.title}
                  </h4>
                  {anime.isHindiDubbed && (
                    <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded">
                      HINDI
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 mb-1">
                  {anime.genres.slice(0, 3).join(" • ")}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span>{anime.type || "Series"}</span>
                  <span>•</span>
                  <span>{anime.episodesCount} Episodes</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {anime.rating || "8.5"}
                  </span>
                </div>
              </div>

              <div className="p-2 rounded-lg text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-600/10 transition-colors">
                <Play className="w-4 h-4 fill-current" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
