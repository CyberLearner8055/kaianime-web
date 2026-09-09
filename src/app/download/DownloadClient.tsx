"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Download,
  ShieldCheck,
  Zap,
  Volume2,
  Film,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Globe,
  Send,
  Smartphone,
  Info,
  Settings,
  RefreshCw,
  Layers,
  HeartHandshake,
} from "lucide-react";

interface DownloadClientProps {
  apkUrl: string;
  animedriveUrl: string;
  telegramUrl: string;
  whatsappUrl: string;
  discordUrl: string;
}

export default function DownloadClient({
  apkUrl,
  animedriveUrl,
  telegramUrl,
  whatsappUrl,
  discordUrl,
}: DownloadClientProps) {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Auto download initiation after 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerDownload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const triggerDownload = () => {
    setDownloadStarted(true);
    const link = document.createElement("a");
    link.href = apkUrl;
    link.setAttribute("download", "Anime.Drive.2.1.1.apk");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* 1. Hero Download Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0f172a] via-[#090e1a] to-[#050811] border border-blue-500/25 p-6 sm:p-12 text-center shadow-2xl shadow-blue-950/40">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official Android Release • Version 2.1.1</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          Download{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
            Anime Drive
          </span>{" "}
          APK
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
          The ultimate Android app for anime fans. Stream thousands of episodes in Full HD with{" "}
          <strong className="text-white">100% zero video ads</strong>, high-speed CDN servers, and multi-language Hindi, Tamil, Telugu dubs.
        </p>

        {/* Download Trigger Status Box */}
        <div className="my-8 p-6 max-w-md mx-auto rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-xl">
          {countdown > 0 ? (
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                <span>Auto-starting in {countdown} seconds...</span>
              </div>
              <p className="text-xs text-slate-400">
                Your direct APK file download is preparing to start.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Direct Download Started!</span>
              </div>
              <p className="text-xs text-slate-400">
                Check your browser downloads or phone notification bar.
              </p>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="mt-5">
            <a
              href={apkUrl}
              download="Anime.Drive.2.1.1.apk"
              onClick={() => setDownloadStarted(true)}
              className="inline-flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-500 hover:to-sky-400 text-white font-black text-base shadow-xl shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Download className="w-5 h-5 animate-bounce" />
              <span>Click to Direct Download (54.7 MB)</span>
            </a>
          </div>

          <p className="text-[11px] text-slate-400 mt-3">
            If download doesn&apos;t start automatically, tap the button above.
          </p>
        </div>

        {/* Metadata Specs Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
          <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 font-semibold flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-blue-400" /> Android 7.0+
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 font-semibold">
            ⚡ Version 2.1.0
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 font-semibold">
            📦 54.5 MB
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Virus-Free &amp; Verified Safe
          </span>
        </div>

        {/* Official Website Link */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4">
          <span className="text-xs text-slate-400">Official Anime Drive Portal:</span>
          <a
            href={animedriveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-blue-400 hover:text-blue-300 text-xs font-bold transition-all"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Visit AnimeDrive.me</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>

      {/* 2. Step-by-Step Installation Instructions */}
      <div className="my-10 p-6 sm:p-10 rounded-3xl bg-[#090d18] border border-white/10 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white border-l-4 border-blue-500 pl-3">
              How to Install Anime Drive APK on Android
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 pl-4">
              Follow these 3 simple steps to install the official APK safely:
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Info className="w-3.5 h-3.5" />
            <span>Takes &lt; 1 minute</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 font-black text-base flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-white mb-2">Download the APK</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click the blue Download button above. The file <code className="text-blue-300 font-mono">Anime.Drive.2.1.1.apk</code> will be saved to your phone&apos;s Downloads folder.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-400 font-medium">
              💡 File size: 54.7 MB
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 font-black text-base flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-white mb-2">Allow Unknown Apps</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tap on the downloaded file. If your phone shows a security prompt, tap <strong className="text-white">Settings</strong> and toggle <strong className="text-white">&quot;Allow from this source&quot;</strong> to ON.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-400 font-medium">
              ⚙️ Android Settings &gt; Install Unknown Apps
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 font-black text-base flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-white mb-2">Install &amp; Enjoy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tap <strong className="text-white">&quot;Install&quot;</strong> on the prompt. Once done, tap <strong className="text-white">&quot;Open&quot;</strong> and enjoy unlimited ad-free anime with Hindi dubs!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-emerald-400 font-medium">
              ✨ 100% Free • No Login Required
            </div>
          </div>
        </div>

        {/* Play Protect Notice */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-200">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Note on Google Play Protect:</strong> Because Anime Drive is distributed directly outside the Play Store for 100% ad-free streaming, Play Protect might show an informational message. Tap <strong className="text-white">&quot;More details&quot;</strong> and then <strong className="text-white">&quot;Install anyway&quot;</strong>. The APK is completely safe and free from any malware.
          </p>
        </div>
      </div>

      {/* 3. Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-10">
        <div className="p-5 rounded-2xl bg-[#090d18] border border-white/8 hover:border-blue-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">100% Zero Video Ads</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No popup ads, no annoying redirection, no video ads before or during playback.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#090d18] border border-white/8 hover:border-blue-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3">
            <Volume2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Multi-Audio Selector</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Switch between Hindi, Tamil, Telugu, English and Japanese audio tracks in 1-tap.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#090d18] border border-white/8 hover:border-blue-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Ultra-Fast CDN Stream</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instant seek, zero buffer lags, and crystal clear 1080p Full HD resolution.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#090d18] border border-white/8 hover:border-blue-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3">
            <Film className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Offline Download Mode</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Download your favorite episodes to watch anywhere, anytime without internet.
          </p>
        </div>
      </div>

      {/* 4. Anime Drive Network Section */}
      <div className="my-12 p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0e1628] via-[#090e1a] to-[#060810] border border-blue-500/30 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Official Ecosystem</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Part of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">Anime Drive Network</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Anime Drive powers India&apos;s fastest growing ad-free anime network across web, mobile apps, and community platforms.
          </p>
        </div>

        {/* 3 Network Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Platform 1: Anime Drive */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3 font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Anime Drive</h3>
              <p className="text-xs text-blue-300 font-semibold mb-2">Main Hub &amp; Official Android App</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                The flagship Android application and central portal for high-speed anime downloads, episodes, and direct updates.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <a
                href={animedriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>Visit animedrive.me</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Platform 2: Kai Anime */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-blue-500/30 hover:border-blue-500/60 transition-all flex flex-col justify-between relative shadow-lg shadow-blue-950/40">
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
              Current Site
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3 font-bold shadow-md shadow-blue-600/30">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Kai Anime</h3>
              <p className="text-xs text-blue-300 font-semibold mb-2">Web Streaming Platform</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                The dedicated online web streaming destination with multi-audio selector, zero ads, and instant browser playback.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <Link
                href="/home"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>Browse KaiAnime Web</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Platform 3: All Free Hub */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3 font-bold">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">All Free Hub</h3>
              <p className="text-xs text-blue-300 font-semibold mb-2">Entertainment Directory</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Comprehensive directory for movies, anime series, multi-quality links, and free entertainment resources.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <span className="text-xs font-bold text-slate-400">Part of Network</span>
            </div>
          </div>
        </div>

        {/* Community Links */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
          <span className="text-slate-400">Join Our Official Community:</span>
          {telegramUrl && (
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-500/30 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram Channel</span>
            </a>
          )}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition-all"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>WhatsApp Updates</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
