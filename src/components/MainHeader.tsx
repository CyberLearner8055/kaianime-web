"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, ShieldCheck, Search } from "lucide-react";
import SidebarDrawer from "./SidebarDrawer";
import SearchModal from "./SearchModal";

interface MainHeaderProps {
  allAnimeIds?: string[];
}

export default function MainHeader({ allAnimeIds = [] }: MainHeaderProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#06080d]/92 backdrop-blur-xl border-b border-white/8 px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/home" className="flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
              KAI<span className="text-blue-500">ANIME</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold -ml-0.5">.SITE</span>
          </Link>
        </div>

        {/* Right: Actions (100% Ad-Free, Search) */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* 100% Ad-Free Status Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsTooltipOpen(!isTooltipOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-500/30 text-xs font-bold transition-colors"
              title="Skip Ads Status: 100% Ad-Free Active"
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">100% Ad-Free</span>
            </button>

            {isTooltipOpen && (
              <div className="absolute right-0 top-10 w-64 p-3 rounded-xl bg-[#0a0d14] border border-white/10 shadow-2xl z-50 text-xs text-slate-300">
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-white/5">
                  <span className="font-bold text-white">100% Ad-Free Verified</span>
                  <button onClick={() => setIsTooltipOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <p className="mt-1 leading-relaxed text-slate-300 text-[11px]">
                  KaiAnime is permanently 100% Ad-Free. No redirects, no popups, no malware scripts.
                </p>
              </div>
            )}
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Search Anime"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Slide-out Sidebar Drawer */}
      <SidebarDrawer isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
