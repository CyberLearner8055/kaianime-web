"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Share2, Copy, Check, ChevronRight } from "lucide-react";
import { Anime } from "@/lib/types";

interface LandingClientProps {
  animeList: Anime[];
}

const topSearches = [
  "Naruto Shippūden",
  "Solo Leveling",
  "One Piece",
  "Attack on Titan",
  "Demon Slayer",
  "Jujutsu Kaisen",
  "Tokyo Revengers",
  "Overflow (hindi)",
  "Bleach",
  "Chainsaw Man"
];

const languageCards = [
  {
    name: "Hindi",
    query: "hindi",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Tamil",
    query: "tamil",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Telugu",
    query: "telugu",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Bengali",
    query: "bengali",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Malayalam",
    query: "malayalam",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "English",
    query: "english",
    image: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=600&auto=format&fit=crop&q=80",
  },
];

export default function LandingClient({ animeList }: LandingClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase().trim();
    return animeList
      .filter((a) => a.title.toLowerCase().includes(q))
      .slice(0, 6);
  }, [searchQuery, animeList]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/home");
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="landing-body font-sans bg-[#050608] text-white min-h-screen">
      {/* Ambient Glowing Blobs (Cobalt Blue & Obsidian) */}
      <div className="glass-bg-wrapper">
        <div className="blob-1" />
        <div className="blob-2" />
      </div>

      <main className="landing-master-container max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        {/* Top Navigation Bar */}
        <nav className="landing-top-bar flex justify-end items-center gap-2 mb-8">
          <Link href="/app" className="glass-link">
            APP
          </Link>
          <Link href="/search?lang=hindi" className="glass-link">
            HINDI
          </Link>
          <Link href="/search?lang=tamil" className="glass-link">
            TAMIL
          </Link>
          <Link href="/search?lang=telugu" className="glass-link">
            TELUGU
          </Link>
        </nav>

        {/* Hero Section */}
        <header className="landing-hero text-center mb-6">
          <div className="mb-3 inline-flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              KAI<span className="text-blue-500">ANIME</span>
              <span className="text-xs text-slate-400 font-bold ml-1">.SITE</span>
            </span>
          </div>

          <h1 className="landing-title text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight max-w-3xl mx-auto">
            Watch <span className="text-blue-500">Hindi Dubbed Anime</span> Online Free in Full HD - KaiAnime
          </h1>
          <p className="landing-desc text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2.5 leading-relaxed">
            Explore the largest library of high-quality Anime, Movies in Hindi Dub, Tamil, Telugu & Multi-Audio 100% Ad-Free.
          </p>
        </header>

        {/* Search Area with Live Suggestions */}
        <section className="relative my-6 max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="search-input-wrap-pro flex items-center bg-[#0d1017] border border-white/12 rounded-2xl px-4 py-1.5 focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-600/20 transition-all">
            <Search className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your favorite anime..."
              autoComplete="off"
              className="w-full bg-transparent border-0 outline-none text-white px-3 py-2 text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs text-slate-400 hover:text-white px-2 py-1"
              >
                Clear
              </button>
            )}
          </form>

          {/* Live Search Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-14 z-50 rounded-2xl bg-[#090c14]/95 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden divide-y divide-white/5">
              {searchResults.map((anime) => (
                <Link
                  key={anime.id}
                  href={`/anime/${anime.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors group"
                >
                  <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900 border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={anime.poster}
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors truncate">
                      {anime.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {anime.genres.slice(0, 3).join(", ") || "Anime"} • {anime.type || "Series"}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </Link>
              ))}
              <div className="p-2.5 bg-black/40 text-center">
                <button
                  onClick={handleSearchSubmit}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View all results for &quot;{searchQuery}&quot; →
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Top Searches Tag Cloud */}
        <div className="top-searches-wrap flex flex-wrap items-center justify-center gap-2 my-4">
          <span className="label text-xs font-bold text-slate-400">TOP SEARCHES:</span>
          {topSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
              className="top-search-tag px-3 py-1 rounded-lg bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/40 text-xs text-slate-300 hover:text-white transition-all"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Enter CTA Button (Cobalt Blue) */}
        <div className="text-center my-8">
          <Link href="/home" className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm tracking-wide shadow-xl shadow-blue-600/30 transition-all hover:scale-102">
            <span>VIEW FULL SITE</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>

        {/* Social Share Section */}
        <section className="my-10 p-5 sm:p-6 rounded-2xl bg-[#090c14] border border-white/8 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-6 rounded-full bg-blue-600" />
            <div>
              <h3 className="font-black text-base text-white">Share KaiAnime</h3>
              <p className="text-xs text-slate-400">Help your friends find the ultimate 100% ad-free anime experience</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://api.whatsapp.com/send?text=Watch+or+Download+Anime+100%25+Ad-Free+on+KaiAnime.site+%F0%9F%94%A5%20https%3A%2F%2Fkaianime.site"
              target="_blank"
              rel="noopener noreferrer"
              className="share-icon-btn wa w-10 h-10 rounded-xl bg-white/5 hover:bg-[#25d366] flex items-center justify-center border border-white/10 transition-colors text-white"
              title="Share on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </a>

            <a
              href="https://t.me/share/url?url=https%3A%2F%2Fkaianime.site&text=Watch+Anime+Free+with+Hindi+Dub+100%25+Ad-Free%21"
              target="_blank"
              rel="noopener noreferrer"
              className="share-icon-btn tg w-10 h-10 rounded-xl bg-white/5 hover:bg-[#0088cc] flex items-center justify-center border border-white/10 transition-colors text-white"
              title="Share on Telegram"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.891 8.11l-1.92 9.06c-.145.648-.529.81-.145.648l-3.028-2.23-1.461 1.408c-.162.162-.298.298-.612.298l.217-3.09 5.625-5.08c.245-.218-.054-.338-.378-.124l-6.95 4.37-2.99-.93c-.65-.204-.66-.65.135-.96l11.68-4.5c.54-.2 1.012.12 1.012.12s-.176.66-.312.93z" />
              </svg>
            </a>

            <button
              onClick={handleCopyLink}
              className="glass-link flex items-center gap-2 text-xs py-2 px-4 cursor-pointer"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? "LINK COPIED!" : "COPY LINK"}</span>
            </button>
          </div>
        </section>

        {/* Watch Anime in Your Language Section */}
        <section className="my-10">
          <h4 className="text-lg sm:text-xl font-black text-white mb-4">
            Watch Anime in <span className="text-blue-500">Your Language</span>
          </h4>

          <div className="lang-grid-pro grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {languageCards.map((card) => (
              <Link
                key={card.name}
                href={`/search?lang=${card.query}`}
                className="lang-card-pro relative aspect-[16/10] rounded-xl overflow-hidden border border-white/10 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.image} alt={card.name} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300" />
                <div className="card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end justify-between p-2.5">
                  <span className="font-extrabold text-xs text-white">{card.name}</span>
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Editorial / FAQ Section */}
        <article className="my-12 text-slate-400 text-xs sm:text-sm leading-relaxed space-y-5 border-t border-white/8 pt-8">
          <h2 className="text-xl sm:text-2xl font-black text-white leading-snug border-l-4 border-blue-600 pl-4">
            KaiAnime — The Ultimate Platform to Watch Anime in <span className="text-blue-500">Hindi, Telugu, Tamil, Malayalam, Bengali & English</span> Online 100% Ad-Free.
          </h2>

          <p>
            KaiAnime is dedicated to providing an exceptional anime watching experience for anime fans worldwide. Free from intrusive redirects, sketchy popups, and click-jackers, you enjoy uninterrupted entertainment in high resolution.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-6">
            <div className="p-4 rounded-xl bg-blue-600/5 border-l-2 border-blue-600">
              <strong className="text-white block mb-1 text-sm">01. 100% Ad-Free Streaming</strong>
              <span className="text-xs text-slate-400">
                Direct high-speed M3U8 video servers without any third-party ads or redirects.
              </span>
            </div>

            <div className="p-4 rounded-xl bg-blue-600/5 border-l-2 border-blue-600">
              <strong className="text-white block mb-1 text-sm">02. Multi-Audio (Hindi Dub Guaranteed)</strong>
              <span className="text-xs text-slate-400">
                All titles feature Hindi Dub, English, and Japanese multi-audio tracks with in-player audio switching.
              </span>
            </div>

            <div className="p-4 rounded-xl bg-blue-600/5 border-l-2 border-blue-600">
              <strong className="text-white block mb-1 text-sm">03. High Performance Player</strong>
              <span className="text-xs text-slate-400">
                Adaptive HLS quality selector (360p to 1080p Ultra HD), auto next episode, and dual audio support.
              </span>
            </div>

            <div className="p-4 rounded-xl bg-blue-600/5 border-l-2 border-blue-600">
              <strong className="text-white block mb-1 text-sm">04. Mobile & Desktop Optimized</strong>
              <span className="text-xs text-slate-400">
                Responsive UI designed for thumb-friendly mobile navigation and balanced desktop cinematic viewing.
              </span>
            </div>
          </div>
        </article>

        {/* Landing Footer */}
        <footer className="pt-8 border-t border-white/5 text-center text-xs text-slate-500">
          <p className="font-extrabold tracking-widest text-white uppercase mb-1">
            © 2026 <span className="text-blue-500">KaiAnime</span>
          </p>
          <p className="text-[10px] uppercase tracking-wider text-slate-600">
            The Ultimate Anime Experience • 100% Ad-Free
          </p>
        </footer>
      </main>
    </div>
  );
}
