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
  Film
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

  // Save to Watch History
  useEffect(() => {
    try {
      const historyItem = {
        id: anime.id,
        title: anime.title,
        poster: anime.poster,
        episodeNumber: epNumber,
        timestamp: Date.now(),
      };
      const existing = localStorage.getItem("kaianime_history");
      let list = existing ? JSON.parse(existing) : [];
      list = [historyItem, ...list.filter((x: any) => x.id !== anime.id)].slice(0, 12);
      localStorage.setItem("kaianime_history", JSON.stringify(list));
    } catch (_) {}
  }, [anime.id, anime.title, anime.poster, epNumber]);

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

      {/* Episode Selection Grid */}
      <div className="mt-4 sm:mt-6 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#0a0d14] border border-white/8 mx-3 sm:mx-0">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/8">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Episodes ({anime.episodesCount})</span>
          </h3>

          {/* Season Selector if multiple seasons */}
          {anime.seasons && anime.seasons.length > 1 && (
            <div className="flex items-center gap-1.5">
              {anime.seasons.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSeason(s)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                    activeSeason === s
                      ? "bg-blue-600 text-white"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  Season {s}
                </button>
              ))}
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
    </div>
  );
}
