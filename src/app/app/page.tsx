import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  Smartphone,
  Download,
  ShieldCheck,
  Zap,
  Volume2,
  Film,
  Send,
  ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "Download Anime Drive App (APK) - 100% Ad-Free Streaming",
  description:
    "Download the official Anime Drive Android App. Enjoy 100% ad-free anime streaming in Hindi, Tamil, Telugu and English with ultra-fast servers and offline downloads.",
  alternates: {
    canonical: "https://kaianime.me/app",
  },
};

export default function AppPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0e1628] via-[#080b13] to-[#050608] border border-blue-500/20 p-6 sm:p-12 text-center shadow-2xl shadow-blue-950/30">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-wider mb-6">
          <Smartphone className="w-4 h-4" />
          <span>Official Android Release</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
          Experience Anime Like Never Before with <span className="text-blue-500">Anime Drive</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
          The ultimate Android app built by anime fans for anime fans. Stream thousands of episodes and movies in Full HD with <strong>100% zero ads</strong>, lightning-fast buffers, and full multi-language Hindi dubs.
        </p>

        {/* Action Download Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <a
            href="https://github.com/CyberLearner8055/animedrive-config/releases/download/V2.1/Anime.Drive.2.1.1.apk"
            download="Anime.Drive.2.1.1.apk"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-600/35 transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <Download className="w-5 h-5 animate-bounce" />
            <span>Download Official APK (v2.1.1 • 54.7 MB)</span>
          </a>

          <a
            href="https://t.me/animedrive"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/15 font-bold text-sm backdrop-blur-xl transition-all"
          >
            <Send className="w-4 h-4 text-sky-400" />
            <span>Join Telegram Community</span>
          </a>
        </div>

        <p className="text-xs text-slate-400 mt-4">
          Requires Android 7.0+ • Version 2.1.1 • 54.7 MB • 100% Free &amp; Safe
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-10">
        <div className="p-6 rounded-2xl bg-[#0a0d16] border border-white/8 hover:border-blue-500/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">100% Ad-Free</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Zero video popups, zero intrusive overlays, and zero interruptions. Pure cinematic streaming.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0a0d16] border border-white/8 hover:border-blue-500/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
            <Volume2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Multi-Audio Dubs</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hindi, Tamil, Telugu, English and Japanese audio tracks with 1-tap switching in the player.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0a0d16] border border-white/8 hover:border-blue-500/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Ultra-Fast Servers</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dedicated CDN routes delivering instant seek times and smooth 1080p Full HD playback.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0a0d16] border border-white/8 hover:border-blue-500/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Offline Downloads</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Save entire seasons with multiple audio choices and watch offline on the go.
          </p>
        </div>
      </div>

      {/* Installation Instructions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090c14] border border-white/8">
        <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-blue-600 pl-3">
          How to Install Anime Drive APK on Android
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-black text-sm flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Download the APK</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click the download button above to save the latest APK file directly to your phone.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-black text-sm flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Allow Unknown Sources</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                If prompted, go to Android Settings &gt; Security &gt; Enable &quot;Install from unknown sources&quot;.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-black text-sm flex items-center justify-center flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Open &amp; Enjoy</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tap the downloaded file to install, launch Anime Drive, and enjoy completely ad-free anime!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home CTA */}
      <div className="text-center mt-10">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>Or Continue Watching on Web Portal</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
