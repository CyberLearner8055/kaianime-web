"use client";

import React from "react";
import Link from "next/link";
import { X, Smartphone, Film, Tv, Sparkles, ChevronDown, Info } from "lucide-react";

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const languages = [
  { name: "Hindi", href: "/search?lang=hindi" },
  { name: "Tamil", href: "/search?lang=tamil" },
  { name: "Telugu", href: "/search?lang=telugu" },
  { name: "Bengali", href: "/search?lang=bengali" },
  { name: "Malayalam", href: "/search?lang=malayalam" },
  { name: "English", href: "/search?lang=english" },
  { name: "Japanese", href: "/search?lang=japanese" },
  { name: "Kannada", href: "/search?lang=kannada" },
  { name: "Korean", href: "/search?lang=korean" },
  { name: "Chinese", href: "/search?lang=chinese" },
  { name: "Marathi", href: "/search?lang=marathi" },
];

const genres = [
  "Action", "Adventure", "Animation", "Comedy", "Drama", "Fantasy",
  "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports",
  "Supernatural", "Suspense", "Thriller"
];

export default function SidebarDrawer({ isOpen, onClose }: SidebarDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`ak-menu-backdrop ${isOpen ? "is-open" : ""}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`ak-sidebar-wrapper ${isOpen ? "is-open" : ""}`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <Link href="/home" onClick={onClose} className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-tight text-white">
              KAI<span className="text-blue-500">ANIME</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold -ml-0.5">.SITE</span>
          </Link>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center transition-colors"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Links */}
        <nav className="space-y-1">
          <Link href="/app" onClick={onClose} className="ak-single-link">
            <Smartphone className="w-5 h-5 text-blue-500" />
            <span>Get App</span>
          </Link>

          <Link href="/home#running" onClick={onClose} className="ak-single-link">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Running Anime</span>
          </Link>

          <Link href="/home#latest-updates" onClick={onClose} className="ak-single-link">
            <Tv className="w-5 h-5 text-blue-400" />
            <span>Series</span>
          </Link>

          <Link href="/home#latest-updates" onClick={onClose} className="ak-single-link">
            <Film className="w-5 h-5 text-sky-400" />
            <span>Movies</span>
          </Link>

          {/* Languages Accordion */}
          <details className="ak-native-drop" open>
            <summary className="ak-drop-trigger">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Languages</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </summary>
            <div className="ak-drop-content">
              {languages.map((l) => (
                <Link
                  key={l.name}
                  href={l.href}
                  onClick={onClose}
                  className="ak-sub-link"
                >
                  {l.name}
                </Link>
              ))}
            </div>
          </details>

          {/* Genres Accordion */}
          <details className="ak-native-drop" open>
            <summary className="ak-drop-trigger">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Genres</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </summary>
            <div className="ak-drop-content">
              {genres.map((g) => (
                <Link
                  key={g}
                  href={`/search?genre=${encodeURIComponent(g.toLowerCase())}`}
                  onClick={onClose}
                  className="ak-sub-link"
                >
                  {g}
                </Link>
              ))}
            </div>
          </details>

          {/* Important Pages (NO CREDITS) */}
          <details className="ak-native-drop">
            <summary className="ak-drop-trigger">
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-slate-400" />
                <span>Important Pages</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </summary>
            <div className="ak-drop-content">
              <Link href="/dmca" onClick={onClose} className="ak-sub-link">
                DMCA
              </Link>
              <Link href="/privacy" onClick={onClose} className="ak-sub-link">
                Privacy Policy
              </Link>
              <Link href="/contact" onClick={onClose} className="ak-sub-link">
                Contact Us
              </Link>
            </div>
          </details>
        </nav>
      </div>
    </>
  );
}
