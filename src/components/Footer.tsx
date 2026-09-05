import React from "react";
import Link from "next/link";
import BrowseByLetter from "./BrowseByLetter";

export default function Footer() {
  return (
    <footer className="w-full bg-[#050608] border-t border-white/8 pt-10 pb-12 mt-16 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Browse by Letter A-Z */}
        <BrowseByLetter />

        {/* Key Category Hub Links for Internal SEO Flow */}
        <nav className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-4 text-blue-400 font-bold text-xs">
          <Link href="/hindi-dubbed-anime" className="hover:text-blue-300 transition-colors">
            Hindi Dubbed Anime
          </Link>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <Link href="/trending-anime-india" className="hover:text-blue-300 transition-colors">
            Trending Anime in India
          </Link>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <Link href="/anime-movies-in-hindi" className="hover:text-blue-300 transition-colors">
            Anime Movies in Hindi
          </Link>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <Link href="/search" className="hover:text-blue-300 transition-colors">
            All Anime Catalog
          </Link>
        </nav>

        {/* Footer Navigation Pages (NO CREDITS) */}
        <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-3 text-slate-300 font-semibold text-xs border-b border-white/5">
          <Link href="/contact" className="hover:text-blue-400 transition-colors">
            Contact Us
          </Link>
          <span className="text-slate-600">•</span>
          <Link href="/dmca" className="hover:text-blue-400 transition-colors">
            DMCA
          </Link>
          <span className="text-slate-600">•</span>
          <Link href="/privacy" className="hover:text-blue-400 transition-colors">
            Privacy Policy
          </Link>
        </nav>

        {/* Exact Disclaimer Requested by User */}
        <div className="my-8 max-w-3xl mx-auto text-center px-4 py-4 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 text-xs sm:text-sm leading-relaxed">
          <p>
            <strong className="text-white font-bold">KaiAnime</strong> does not store any files on own server.
            We only index links from internet which are hosted on third-party services.{" "}
            <strong className="text-white font-bold">We Index Links Just Like Google.</strong>
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center pt-2 text-slate-300 text-xs">
          <p>© 2026 <span className="text-white font-bold">KaiAnime</span>. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
