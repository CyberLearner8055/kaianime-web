"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Play, Smartphone, Globe, Sparkles, Heart } from "lucide-react";
import SearchModal from "./SearchModal";
import { useWatchlist } from "@/lib/watchlist";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useWatchlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Running", href: "/#running" },
    { name: "Action", href: "/#action" },
    { name: "Isekai", href: "/#isekai" },
    { name: "Romance", href: "/#romance" },
    { name: "Watchlist", href: "/watchlist" },
    { name: "Search", href: "/search" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass-nav py-3.5" : "bg-gradient-to-b from-black/90 to-transparent py-4 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="KaiAnime"
                className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 glass-panel px-3 py-1.5 rounded-full">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const isWatchlist = link.href === "/watchlist";
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {isWatchlist && (
                      <Heart
                        className={`w-3 h-3 ${
                          count > 0 ? "fill-rose-500 text-rose-500" : "text-slate-400"
                        }`}
                      />
                    )}
                    <span>{link.name}</span>
                    {isWatchlist && count > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] font-black bg-rose-600 text-white rounded-full leading-none">
                        {count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side: Search, Watchlist Quick & CTA */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card hover:border-blue-500/40 text-slate-400 hover:text-white text-xs transition-colors"
                title="Search Anime (Ctrl + K)"
              >
                <Search className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Search anime...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white/5 border border-white/10 rounded">
                  ⌘K
                </kbd>
              </button>

              {/* Watchlist Mobile/Desktop Quick Icon */}
              <Link
                href="/watchlist"
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card hover:border-rose-500/40 text-xs transition-colors ${
                  pathname === "/watchlist"
                    ? "border-rose-500/50 bg-rose-500/15 text-rose-400"
                    : "text-slate-300 hover:text-white"
                }`}
                title="My Watchlist"
              >
                <Heart
                  className={`w-3.5 h-3.5 transition-colors ${
                    count > 0 ? "fill-rose-500 text-rose-500" : "text-rose-400"
                  }`}
                />
                <span className="hidden xl:inline font-medium">Watchlist</span>
                {count > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-black bg-rose-600 text-white rounded-full leading-none">
                    {count}
                  </span>
                )}
              </Link>

              {/* Get Android App */}
              <Link
                href="/download"
                className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-glow shadow-blue-600/25 transition-all duration-200 hover:scale-105"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Get App</span>
              </Link>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl glass-card text-slate-300 hover:text-white"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel border-t border-white/10 px-4 pt-3 pb-6 mt-3 space-y-2 animate-fade-in">
            {navLinks.map((link) => {
              const isWatchlist = link.href === "/watchlist";
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-blue-600/20 hover:text-blue-400 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isWatchlist && (
                      <Heart
                        className={`w-4 h-4 ${
                          count > 0 ? "fill-rose-500 text-rose-500" : "text-rose-400"
                        }`}
                      />
                    )}
                    <span>{link.name}</span>
                  </div>
                  {isWatchlist && count > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-rose-600 text-white rounded-full">
                      {count} saved
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-white/10">
              <Link
                href="/download"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                <Smartphone className="w-4 h-4" />
                Download Anime Drive APK (v2.1)
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Instant Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
