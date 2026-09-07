"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Search,
} from "lucide-react";
import { Anime, Episode } from "@/lib/types";
import ArtPlayer from "@/components/ArtPlayer";
import AnimeDrivePlayerLoading from "@/components/AnimeDrivePlayerLoading";
import WatchlistButton from "@/components/WatchlistButton";

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

  // Extract M3U8 Stream with fast failover and auto-fallback
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setSubtitles([]);
    setUseIframeFallback(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 6500);

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
          body: JSON.stringify({
            url: rawServerUrl,
            title: anime.title,
            season: activeSeason,
            ep: epNumber,
          }),
          signal: controller.signal,
        });

        if (!isMounted) return;

        if (!res.ok) {
          throw new Error(`Extraction failed: ${res.status}`);
        }

        const data = await res.json();
        const extractedM3u8 = data.m3u8 || data.streamUrl || data.url;
        if (extractedM3u8) {
          setStreamUrl(extractedM3u8);
          setSubtitles(Array.isArray(data.subtitles) ? data.subtitles : []);
          setUseIframeFallback(false);
        } else {
          // If this server returned no direct stream, try the next server if available
          if (selectedServerIdx < serverList.length - 1) {
            console.log(`[WatchClient] Empty stream on Server ${selectedServerIdx + 1}, switching to Server ${selectedServerIdx + 2}`);
            setSelectedServerIdx((prev) => prev + 1);
            return;
          }
          setUseIframeFallback(true);
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.warn("[WatchClient] Extraction error / timeout:", err);
        // Automatic server failover: if this server times out or fails, try the next server
        if (selectedServerIdx < serverList.length - 1) {
          console.log(`[WatchClient] Auto-switching to Server ${selectedServerIdx + 2}...`);
          setSelectedServerIdx((prev) => prev + 1);
          return;
        }
        // If all servers exhausted, fallback to web iframe player immediately so video plays
        setUseIframeFallback(true);
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) setLoading(false);
      }
    }

    extract();

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
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

  const [epSearch, setEpSearch] = useState("");
  const CHUNK_SIZE = 50;

  const seasonEpisodes = useMemo(() => {
    return anime.episodes.filter((e) => (e.season || 1) === activeSeason);
  }, [anime.episodes, activeSeason]);

  // Episode range chunking for long anime (Naruto, One Piece, etc.)
  const episodeRanges = useMemo(() => {
    if (seasonEpisodes.length <= CHUNK_SIZE) return [];
    const ranges = [];
    for (let i = 0; i < seasonEpisodes.length; i += CHUNK_SIZE) {
      const slice = seasonEpisodes.slice(i, i + CHUNK_SIZE);
      const start = slice[0].number;
      const end = slice[slice.length - 1].number;
      ranges.push({ label: `${start} - ${end}`, start, end, startIndex: i });
    }
    return ranges;
  }, [seasonEpisodes]);

  const [selectedRangeIdx, setSelectedRangeIdx] = useState(0);

  // Auto-select range containing current epNumber
  useEffect(() => {
    if (episodeRanges.length > 0) {
      const idx = episodeRanges.findIndex(
        (r) => epNumber >= r.start && epNumber <= r.end
      );
      if (idx !== -1) {
        setSelectedRangeIdx(idx);
      }
    }
  }, [epNumber, episodeRanges]);

  const filteredEpisodes = useMemo(() => {
    if (epSearch.trim()) {
      const term = epSearch.trim();
      return seasonEpisodes.filter((ep) => String(ep.number).includes(term));
    }
    if (episodeRanges.length > 0) {
      const range = episodeRanges[selectedRangeIdx];
      if (range) {
        return seasonEpisodes.slice(range.startIndex, range.startIndex + CHUNK_SIZE);
      }
    }
    return seasonEpisodes;
  }, [seasonEpisodes, epSearch, episodeRanges, selectedRangeIdx]);

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
          <WatchlistButton anime={anime} variant="pill" />
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
          <AnimeDrivePlayerLoading />
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
            key={`${streamUrl}-${subtitles.length}`}
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

      {/* Prominent Quick Prev / Next Episode Bar (Right Under Video Player) */}
      <div className="mt-3 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#0a0d14] border border-blue-500/20 shadow-lg shadow-blue-950/20 flex items-center justify-between gap-2 mx-3 sm:mx-0">
        {prevEp ? (
          <Link
            href={`/watch/${anime.id}/${prevEp.number}`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-bold border border-white/10 transition-all active:scale-95 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 text-blue-400" />
            <span>Prev Ep</span>
          </Link>
        ) : (
          <button
            disabled
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 text-slate-600 text-xs sm:text-sm font-semibold border border-white/5 cursor-not-allowed opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev Ep</span>
          </button>
        )}

        {/* Current Episode Highlight Badge */}
        <div className="flex flex-col items-center justify-center px-2 py-0.5">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Now Playing</span>
          <span className="text-xs sm:text-sm font-extrabold text-blue-400">
            Episode {epNumber} <span className="text-slate-500 font-normal">/ {anime.episodesCount}</span>
          </span>
        </div>

        {nextEp ? (
          <Link
            href={`/watch/${anime.id}/${nextEp.number}`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/40 transition-all active:scale-95"
          >
            <span>Next Ep</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            disabled
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 text-slate-600 text-xs sm:text-sm font-semibold border border-white/5 cursor-not-allowed opacity-50"
          >
            <span>Next Ep</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Stream Server Selection */}
      <div className="mt-2.5 p-3 rounded-xl sm:rounded-2xl bg-[#0a0d14] border border-white/8 flex flex-wrap items-center justify-between gap-3 mx-3 sm:mx-0">
        <div className="flex items-center gap-2">
          <Server className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs text-slate-300 font-bold">Stream Server:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
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
              `Watch ${anime.title} Episode ${epNumber} Hindi Dubbed Free in Full HD:\n${shareUrl || "https://kaianime.me"}`
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
            href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl || "https://kaianime.me")}&text=${encodeURIComponent(
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

      {/* Standard Anime Compact Episode Grid */}
      <div className="mt-4 sm:mt-6 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#0a0d14] border border-white/8 mx-3 sm:mx-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-white/8">
          <div className="flex items-center gap-2 shrink-0">
            <Layers className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm text-white">
              Episodes ({seasonEpisodes.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick jump to episode search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={epSearch}
                onChange={(e) => setEpSearch(e.target.value)}
                placeholder="Jump to Ep..."
                className="w-28 sm:w-32 bg-white/5 hover:bg-white/10 focus:bg-[#101420] text-white text-xs pl-7 pr-2 py-1.5 rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-500 font-semibold"
              />
            </div>

            {/* Season Selector if multiple seasons */}
            {anime.seasons && anime.seasons.length > 1 && (
              <div className="flex items-center gap-1.5">
                <select
                  value={activeSeason}
                  onChange={(e) => {
                    setActiveSeason(Number(e.target.value));
                    setSelectedRangeIdx(0);
                    setEpSearch("");
                  }}
                  className="bg-[#101420] text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-500/40 focus:outline-none focus:border-blue-400 cursor-pointer shadow-md"
                >
                  {anime.seasons.map((s) => (
                    <option key={s} value={s} className="bg-[#0a0d14] text-white">
                      Season {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Long Anime Episode Range Tabs (e.g. 1-50, 51-100, 101-150...) */}
        {!epSearch && episodeRanges.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2.5 mb-2.5 border-b border-white/5">
            {episodeRanges.map((r, idx) => (
              <button
                key={r.label}
                onClick={() => setSelectedRangeIdx(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  selectedRangeIdx === idx
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}

        {/* Standard Anime Compact Grid Buttons: [1] [2] [3] ... [25] */}
        {filteredEpisodes.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No episode found matching &quot;{epSearch}&quot;
          </div>
        ) : (
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5 max-h-64 overflow-y-auto pr-1">
            {filteredEpisodes.map((ep) => {
              const isActive = ep.number === epNumber;
              return (
                <Link
                  key={ep.number}
                  href={`/watch/${anime.id}/${ep.number}`}
                  className={`h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50 ring-2 ring-blue-400 scale-102 z-10"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 active:scale-95"
                  }`}
                  title={`Episode ${ep.number}`}
                >
                  {ep.number}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* SEO Info & Download Synopsis Block */}
      <div className="mt-4 sm:mt-6 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#0a0d14] border border-white/8 mx-3 sm:mx-0 text-xs text-slate-300 space-y-2">
        <h2 className="font-bold text-sm text-white flex items-center gap-2">
          <Film className="w-4 h-4 text-blue-400" />
          <span>About {anime.title} Episode {epNumber} Streaming &amp; Download</span>
        </h2>
        <p className="text-slate-400 leading-relaxed text-xs">
          Watch and download <strong>{anime.title} Episode {epNumber}</strong> online in Full HD with Hindi Dubbed audio and multi-language subtitles. Enjoy uninterrupted anime streaming completely free with 0 ads, 0 popups, and high-speed cloud servers on KaiAnime.me.
        </p>
      </div>
    </div>
  );
}
