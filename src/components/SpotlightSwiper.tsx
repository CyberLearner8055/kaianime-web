"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Star, Sparkles, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Anime } from "@/lib/types";

interface SpotlightSwiperProps {
  spotlights: Anime[];
}

export default function SpotlightSwiper({ spotlights }: SpotlightSwiperProps) {
  const [current, setCurrent] = useState(0);

  // App-style items: Anime Drive Promo Slide + Top Trending Anime
  const promoSlide = {
    isPromo: true,
    badge: "ANIME DRIVE OFFICIAL",
    title: "100% Ad-Free Anime Streaming",
    subtitle: "Huge Library • Multi-Language Hindi Dubs • Ultra HD",
    buttonText: "Explore Full Catalog",
    url: "/search",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
  };

  const slides: any[] = [
    promoSlide,
    ...spotlights.slice(0, 7).map((a) => ({ isPromo: false, anime: a }))
  ];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeItem = slides[current] || slides[0];

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="my-4 relative">
      {/* App-like Carousel Card (Height: 220px on mobile, 270px on sm, 300px on md) */}
      <div className="relative w-full h-[220px] sm:h-[260px] md:h-[290px] rounded-2xl overflow-hidden bg-[#07090e] border border-white/10 shadow-2xl shadow-blue-950/20 group">
        {/* Background Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            activeItem.isPromo
              ? activeItem.image
              : activeItem.anime.banner || activeItem.anime.poster
          }
          alt="Featured Banner"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.7] transition-all duration-700"
        />

        {/* App-like Cinematic Gradient (Dark bottom-left to transparent top-right) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/75 to-transparent sm:w-4/5" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050608] via-[#050608]/80 to-transparent w-full md:w-3/5" />

        {/* Bottom Left Content */}
        <div className="relative z-10 h-full p-4 sm:p-7 md:p-8 flex flex-col justify-end max-w-xl">
          {activeItem.isPromo ? (
            <>
              {/* Promo Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-black text-[10px] uppercase tracking-wider shadow-md shadow-blue-600/30">
                  <Sparkles className="w-3 h-3" />
                  {activeItem.badge}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-bold backdrop-blur-md">
                  Zero Popups
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-md">
                {activeItem.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium line-clamp-1">
                {activeItem.subtitle}
              </p>

              <div className="mt-3 sm:mt-4">
                <Link
                  href={activeItem.url}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
                >
                  <span>{activeItem.buttonText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Anime Top Row: FEATURED Glass Badge + Rating */}
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-black text-[10px] uppercase tracking-wider shadow-md shadow-blue-600/30">
                  FEATURED
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 border border-white/15 text-amber-300 text-[10px] font-extrabold backdrop-blur-md">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {activeItem.anime.rating ? Number(activeItem.anime.rating).toFixed(1) : "8.5"}
                </span>

                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-white/10 text-slate-200 text-[10px] font-semibold backdrop-blur-md">
                  {activeItem.anime.langs || "Hindi, English, Japanese"}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-md line-clamp-1">
                {activeItem.anime.title}
              </h2>

              {/* Genres */}
              <p className="text-xs text-slate-300 mt-1 font-medium line-clamp-1">
                {activeItem.anime.genres.slice(0, 3).join(" • ") || "Action • Fantasy"}
              </p>

              {/* App-like Glass Watch Now Button */}
              <div className="flex items-center gap-3 mt-3 sm:mt-4">
                <Link
                  href={`/watch/${activeItem.anime.id}/1`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Now</span>
                </Link>

                <Link
                  href={`/anime/${activeItem.anime.id}`}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs backdrop-blur-md transition-colors"
                >
                  <span>Details</span>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Prev / Next Arrows */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-7 h-7 rounded-lg bg-black/60 hover:bg-blue-600 text-white flex items-center justify-center border border-white/10 transition-colors"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="w-7 h-7 rounded-lg bg-black/60 hover:bg-blue-600 text-white flex items-center justify-center border border-white/10 transition-colors"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* App-like Indicator Dots (Elongated Pill for Active) */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all rounded-full ${
              idx === current
                ? "w-6 h-1.5 bg-blue-500"
                : "w-1.5 h-1.5 bg-white/25 hover:bg-white/40"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
