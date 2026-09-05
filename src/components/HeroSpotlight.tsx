"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Play, Info, Star, ChevronLeft, ChevronRight, ShieldCheck, Flame } from "lucide-react";
import { Anime } from "@/lib/types";

interface HeroSpotlightProps {
  featured: Anime[];
}

export default function HeroSpotlight({ featured }: HeroSpotlightProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  // Auto-advance spotlight every 6 seconds
  useEffect(() => {
    if (!featured || featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featured]);

  if (!featured || featured.length === 0) return null;

  const current = featured[currentIndex];
  const firstEp = current.episodes && current.episodes.length > 0 ? current.episodes[0].number : 1;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % featured.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);

  // Touch Swipe for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartXRef.current = null;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[480px] sm:h-[540px] md:h-[600px] lg:h-[640px] overflow-hidden bg-black select-none"
    >
      {/* Background Banner with Dynamic Transitions */}
      {featured.map((item, idx) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.banner || item.poster}
            alt={item.title}
            className="w-full h-full object-cover object-center filter brightness-[0.62]"
          />
          {/* Multi-layered Gradients for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent w-full md:w-3/4" />
        </div>
      ))}

      {/* Hero Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 sm:pb-12 z-10">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          {/* Badges / Meta */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider rounded-lg shadow-md">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Ad-Free
            </span>

            <span className="flex items-center gap-1 px-2.5 py-1 bg-red-600/90 text-white font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider rounded-lg shadow-md">
              <Flame className="w-3.5 h-3.5" /> Trending Now
            </span>

            {current.isHindiDubbed ? (
              <span className="px-2.5 py-1 bg-emerald-500 text-black font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider rounded-lg shadow-md">
                Hindi Dubbed
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-white/10 text-white font-semibold text-[10px] sm:text-[11px] rounded-lg border border-white/15 backdrop-blur-md">
                Japanese Sub
              </span>
            )}

            <span className="flex items-center gap-1 px-2 py-1 bg-black/60 text-amber-300 font-bold text-xs rounded-lg border border-amber-500/20 backdrop-blur-md">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {current.rating.toFixed(1)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] drop-shadow-md line-clamp-2">
            {current.title}
          </h1>

          {/* Genres */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {current.genres.slice(0, 4).map((g) => (
              <span
                key={g}
                className="px-2.5 py-0.5 text-[11px] sm:text-xs font-medium text-slate-300 bg-white/5 border border-white/10 rounded-md backdrop-blur-sm"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-xl font-normal drop-shadow">
            {current.synopsis}
          </p>

          {/* Call to Actions */}
          <div className="pt-1 sm:pt-2 flex items-center gap-3">
            <Link
              href={`/watch/${current.id}/${firstEp}`}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm md:text-base transition-all duration-200 shadow-lg shadow-blue-600/30 active:scale-95"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              <span>Watch Now</span>
            </Link>

            <Link
              href={`/anime/${current.id}`}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm md:text-base border border-white/15 backdrop-blur-md transition-all duration-200 active:scale-95"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span>Details</span>
            </Link>
          </div>
        </div>

        {/* Carousel Slide Indicators & Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-4 sm:pt-0 sm:absolute sm:right-8 sm:bottom-12">
          <div className="flex items-center gap-1.5">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  i === currentIndex ? "w-6 bg-blue-500" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={prevSlide}
              className="p-2 sm:p-2.5 rounded-xl bg-black/60 hover:bg-blue-600 text-white border border-white/10 backdrop-blur-md transition-colors"
              aria-label="Previous Featured Anime"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 sm:p-2.5 rounded-xl bg-black/60 hover:bg-blue-600 text-white border border-white/10 backdrop-blur-md transition-colors"
              aria-label="Next Featured Anime"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
