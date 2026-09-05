"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Anime } from "@/lib/types";
import AnimeTadkaCard from "./AnimeTadkaCard";

interface ContentRailProps {
  id?: string;
  title: string;
  subtitle?: string;
  items?: Anime[];
  animeList?: Anime[];
  viewAllHref?: string;
  icon?: React.ReactNode;
}

export default function ContentRail({
  id,
  title,
  subtitle,
  items,
  animeList,
  viewAllHref,
  icon,
}: ContentRailProps) {
  const displayItems = items || animeList || [];
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -480 : 480;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!displayItems || displayItems.length === 0) return null;

  return (
    <section id={id} className="py-6 sm:py-8 scroll-mt-20">
      {/* Header */}
      <div className="flex items-end justify-between mb-4 sm:mb-6 px-1">
        <div>
          <div className="flex items-center gap-2">
            {icon && <span className="text-blue-400">{icon}</span>}
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 mr-2"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* Desktop Left/Right Scroll Arrows */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Rail Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayItems.map((anime) => (
          <div
            key={anime.id}
            className="w-[150px] sm:w-[175px] md:w-[195px] flex-shrink-0 snap-start"
          >
            <AnimeTadkaCard anime={anime} />
          </div>
        ))}
      </div>
    </section>
  );
}
