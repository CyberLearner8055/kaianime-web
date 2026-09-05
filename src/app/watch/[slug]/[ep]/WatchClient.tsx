"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Server,
  Download,
  AlertCircle,
  Layers,
  Info,
  Film,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { Anime, Episode } from "@/lib/types";
import ArtPlayer from "@/components/ArtPlayer";

interface WatchClientProps {
  anime: Anime;
  episode?: Episode;
  epNumber: number;
}

export default function WatchClient({ anime, episode, epNumber }: WatchClientProps) {
  const router = useRouter();

  // Find current episode
  const currentEp =
    episode || anime.episodes.find((e) => e.number === epNumber) || anime.episodes[0];
  const [selectedServerIdx, setSelectedServerIdx] = useState(0);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [subtitles, setSubtitles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  const [activeSeason, setActiveSeason] = useState(currentEp?.season || 1);
  const [initialSeekTime, setInitialSeekTime] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const availableServers: { name: string; url: string }[] = (() => {
    if (!currentEp || !currentEp.servers) return [];
    if (Array.isArray(currentEp.servers)) {
      return (currentEp.servers as any[]).map((s: any, idx: number) => ({
        name: s.name || `Server ${idx + 1}`,
        url: typeof s === "string" ? s : (s.url || ""),
      }));
    }
    if (typeof currentEp.servers === "object") {
      return Object.entries(currentEp.servers).map(([name, url]) => ({
        name,
        url: String(url),
      }));
    }
    return [];
  })();

  const serverList =
    availableServers.length > 0
      ? availableServers
      : [
          {
            name: "Anime Drive HLS Server 1",
            url: "https://animedrive.me/stream/sample",
          },
        ];

  const currentServer = serverList[selectedServerIdx] || serverList[0];
  const rawServerUrl = currentServer?.url || "";

  // Extract M3U8 Stream
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setUseIframeFallback(false);

    async function extract() {
      if (!rawServerUrl) {
        if (isMounted) setLoading(false);
        return;
      }

      if (rawServerUrl.includes(".m3u8")) {
        if (isMounted) {
          setStreamUrl(rawServerUrl);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: rawServerUrl }),
        });

        if (!isMounted) return;

        if (!res.ok) {
          throw new Error(`Extraction failed: ${res.status}`);
        }

        const data = await res.json();
        const extractedM3u8 = data.m3u8 || data.streamUrl || data.url;
        if (extractedM3u8) {
          setStreamUrl(extractedM3u8);
          if (data.subtitles && Array.isArray(data.subtitles)) {
            setSubtitles(data.subtitles);
          }
          setUseIframeFallback(false);
        } else {
          setUseIframeFallback(true);
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.warn("[WatchClient] Extraction error:", err);
        setUseIframeFallback(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    extract();

    return () => {
      isMounted = false;
    };
  }, [rawServerUrl]);

  // Set current window share URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  // Retrieve saved playback position to resume
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kaianime_history");
      if (saved) {
        const list = JSON.parse(saved);
        const found = list.find(
          (x: any) => x.id === anime.id && x.episodeNumber === epNumber
        );
        if (found && found.currentTime && found.currentTime > 5) {
          if (!found.duration || found.currentTime / found.duration < 0.95) {
            setInitialSeekTime(found.currentTime);
          }
        }
      }
    } catch (_) {}
  }, [anime.id, epNumber]);

  // Track playback position & update history in real time
  const handleTimeUpdate = (currentTime: number, duration: number) => {
    try {
      const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
      const historyItem = {
        id: anime.id,
        title: anime.title,
        poster: anime.poster,
        episodeNumber: epNumber,
        currentTime: Math.round(currentTime),
        duration: Math.round(duration),
        progressPercent: Math.round(progressPercent),
        timestamp: Date.now(),
      };
      const existing = localStorage.getItem("kaianime_history");
      let list = existing ? JSON.parse(existing) : [];
      list = [historyItem, ...list.filter((x: any) => x.id !== anime.id)].slice(0, 15);
      localStorage.setItem("kaianime_history", JSON.stringify(list));
    } catch (_) {}
  };

  // Save to Watch History on episode mount (preserving prior progress if exists)
  useEffect(() => {
    try {
      const existing = localStorage.getItem("kaianime_history");
      let list = existing ? JSON.parse(existing) : [];
      const found = list.find(
        (x: any) => x.id === anime.id && x.episodeNumber === epNumber
      );
      const historyItem = {
        id: anime.id,
        title: anime.title,
        poster: anime.poster,
        episodeNumber: epNumber,
        currentTime: found?.currentTime || 0,
        duration: found?.duration || 0,
        progressPercent: found?.progressPercent || 0,
        timestamp: Date.now(),
      };
      list = [historyItem, ...list.filter((x: any) => x.id !== anime.id)].slice(0, 15);
      localStorage.setItem("kaianime_history", JSON.stringify(list));
    } catch (_) {}
  }, [anime.id, anime.title, anime.poster, epNumber]);

  const handleCopyLink = async () => {
    try {
      const urlToCopy = shareUrl || (typeof window !== "undefined" ? window.location.href : "");
      if (urlToCopy) {
        await navigator.clipboard.writeText(urlToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (_) {}
  };

  // Navigate to adjacent episodes
  const prevEp = anime.episodes.find((e) => e.number === epNumber - 1);
  const nextEp = anime.episodes.find((e) => e.number === epNumber + 1);

  const handleVideoEnded = () => {
    if (nextEp) {
      router.push(`/watch/${anime.id}/${nextEp.number}`);
    }
  };

  const seasonEpisodes = anime.episodes.filter(
    (e) => (e.season || 1) === activeSeason
  );

  return (
    <div className="max-w-5xl mx-auto px-0 sm:px-4 md:px-6 py-2 sm:py-6">
      {/* Top Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-3 sm:px-0 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Link href="/home" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href={`/anime/${anime.id}`} className="hover:text-white transition-colors font-medium truncate max-w-[180px] sm:max-w-xs">
            {anime.title}
          </Link>
          <span>/</span>
          <span className="text-blue-400 font-bold">EP {epNumber}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/anime/${anime.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Details</span>
          </Link>

          <a
            href="https://animedrive.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* Primary Page H1 with rich target keywords */}
      <div className="mb-3 px-3 sm:px-0">
        <h1 className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight leading-snug">
          Watch <span className="text-blue-500">{anime.title}</span> Episode {epNumber} Hindi Dubbed Online Free
        </h1>
        <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-medium">
          Full HD 1080p &bull; 100% Ad-Free &bull; Multi-Audio (Hindi Dub, English Sub, Japanese)
        </p>
      </div>

      {/* Video Player Canvas Container (Mobile Full-Bleed, Desktop max-w-5xl Clean Fit) */}
      <div className="relative w-full aspect-video bg-black sm:rounded-2xl overflow-hidden border-y sm:border border-white/10 shadow-2xl shadow-blue-950/20">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#07080c] text-slate-300 gap-3 p-6 text-center">
            <div className="relative">
              <div className="w-10 h-10 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <Play className="w-3.5 h-3.5 text-blue-400 fill-current absolute inset-0 m-auto" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-white">
              Connecting Direct 100% Ad-Free Stream...
            </p>
          </div>
        ) : useIframeFallback ? (
          <div className="w-full h-full relative bg-black">
            <iframe
              src={rawServerUrl}
              className="w-full h-full border-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        ) : streamUrl ? (
          <ArtPlayer
            key={streamUrl}
            url={streamUrl}
            subtitles={subtitles}
            poster={anime.banner || anime.poster}
            title={`${anime.title} - EP ${epNumber}`}
            initialTime={initialSeekTime}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#07080c] text-slate-400 gap-3 p-6 text-center">
            <AlertCircle className="w-8 h-8 text-amber-400" />
            <p className="text-xs sm:text-sm font-bold text-white">Direct extraction taking longer</p>
            <button
              onClick={() => setUseIframeFallback(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
            >
              Load Web Player Fallback
            </button>
          </div>
        )}
      </div>

      {/* Prev / Next EP Controls & Server Selection */}
      <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0a0d14] border border-white/8 flex flex-wrap items-center justify-between gap-3 mx-3 sm:mx-0">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          {prevEp ? (
            <Link
              href={`/watch/${anime.id}/${prevEp.number}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev EP</span>
            </Link>
          ) : (
            <span className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-600 text-xs font-semibold cursor-not-allowed">
              Prev EP
            </span>
          )}

          <span className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold">
            EP {epNumber}
          </span>

          {nextEp ? (
            <Link
              href={`/watch/${anime.id}/${nextEp.number}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all"
            >
              <span>Next EP</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-600 text-xs font-semibold cursor-not-allowed">
              Next EP
            </span>
          )}
        </div>

        {/* Server Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Server className="w-3.5 h-3.5 text-blue-400 hidden sm:inline" />
          <span className="text-xs text-slate-400 font-semibold hidden sm:inline mr-1">Server:</span>
          {serverList.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedServerIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                idx === selectedServerIdx
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/8"
              }`}
            >
              Server {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* 1-Tap Social Share Bar */}
      <div className="mt-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#0a0d14] border border-white/8 flex flex-wrap items-center justify-between gap-3 mx-3 sm:mx-0">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Share2 className="w-4 h-4 text-blue-400" />
          <span>Share this Episode:</span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* WhatsApp 1-Tap Button */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `Watch ${anime.title} Episode ${epNumber} Hindi Dubbed Free in Full HD:\n${shareUrl || "https://kaianime.site"}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all active:scale-95 shadow-sm"
            title="Share on WhatsApp"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3z"/>
            </svg>
            <span>WhatsApp</span>
          </a>

          {/* Telegram 1-Tap Button */}
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl || "https://kaianime.site")}&text=${encodeURIComponent(
              `Watch ${anime.title} Episode ${epNumber} Hindi Dubbed Free in Full HD on KaiAnime!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 hover:text-sky-300 border border-sky-400/30 text-xs font-bold transition-all active:scale-95 shadow-sm"
            title="Share on Telegram"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            <span>Telegram</span>
          </a>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-all active:scale-95"
            title="Copy Link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Episode Selection Grid */}
      <div className="mt-4 sm:mt-6 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#0a0d14] border border-white/8 mx-3 sm:mx-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 pb-2.5 border-b border-white/8">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 shrink-0">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Episodes ({anime.episodesCount})</span>
          </h3>

          {/* Season Selector if multiple seasons */}
          {anime.seasons && anime.seasons.length > 1 && (
            <div className="flex items-center gap-2 max-w-full overflow-hidden">
              {anime.seasons.length > 5 ? (
                /* Compact Clean Dropdown when seasons > 5 */
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Season:</span>
                  <div className="relative">
                    <select
                      value={activeSeason}
                      onChange={(e) => setActiveSeason(Number(e.target.value))}
                      className="bg-[#101420] text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-500/40 focus:outline-none focus:border-blue-400 cursor-pointer appearance-none pr-8 shadow-md"
                    >
                      {anime.seasons.map((s) => (
                        <option key={s} value={s} className="bg-[#0a0d14] text-white">
                          Season {s}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
                      ▼
                    </div>
                  </div>
                </div>
              ) : (
                /* Horizontal Scrollable Pill Buttons when <= 5 seasons */
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full py-0.5">
                  {anime.seasons.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSeason(s)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                        activeSeason === s
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
                      }`}
                    >
                      Season {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-60 overflow-y-auto pr-1">
          {seasonEpisodes.map((ep) => (
            <Link
              key={ep.number}
              href={`/watch/${anime.id}/${ep.number}`}
              className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
                ep.number === epNumber
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-102"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5"
              }`}
            >
              EP {ep.number}
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Info & Download Synopsis Block */}
      <div className="mt-4 sm:mt-6 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#0a0d14] border border-white/8 mx-3 sm:mx-0 text-xs text-slate-300 space-y-2">
        <h2 className="font-bold text-sm text-white flex items-center gap-2">
          <Film className="w-4 h-4 text-blue-400" />
          <span>About {anime.title} Episode {epNumber} Streaming &amp; Download</span>
        </h2>
        <p className="text-slate-400 leading-relaxed text-xs">
          Watch and download <strong>{anime.title} Episode {epNumber}</strong> online in Full HD with Hindi Dubbed audio and multi-language subtitles. Enjoy uninterrupted anime streaming completely free with 0 ads, 0 popups, and high-speed cloud servers on KaiAnime.site.
        </p>
      </div>
    </div>
  );
}
