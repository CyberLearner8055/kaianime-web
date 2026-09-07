import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  Download,
  Play,
  Mail,
  Send,
  Heart,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Anime Drive Network - Official Streaming & Download Ecosystem | KaiAnime",
  description:
    "Discover the Anime Drive Network ecosystem. KaiAnime is the official 100% ad-free streaming platform, and Anime Drive (animedrive.me) is India's premier Hindi dub anime download site.",
  keywords: [
    "anime drive network",
    "anime drive",
    "animedrive.me",
    "kaianime",
    "kaianime.me",
    "anime drive hindi dub",
    "anime download site india",
    "free anime streaming no ads",
  ],
  alternates: {
    canonical: "https://kaianime.me/anime-drive-network",
  },
  openGraph: {
    title: "Anime Drive Network & KaiAnime - Streaming & Download Hub",
    description:
      "KaiAnime is Anime Drive's dedicated ad-free streaming site, and Anime Drive is India's leading Hindi Dubbed anime downloading platform.",
    url: "https://kaianime.me/anime-drive-network",
    images: [{ url: "/logo.png", width: 526, height: 103, alt: "Anime Drive Network" }],
  },
};

export default function AnimeDriveNetworkPage() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Anime Drive Network",
    url: "https://animedrive.me",
    logo: "https://kaianime.me/logo.png",
    sameAs: [
      "https://instagram.com/animedrive_me",
      "https://instagram.com/kaianime.me",
      "https://t.me/animeedrive",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "kaianime@outlook.in",
        contactType: "customer service",
      },
      {
        "@type": "ContactPoint",
        email: "animedrive@outlook.in",
        contactType: "technical support",
      },
    ],
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* Top Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <Link href="/home" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-blue-400 font-bold">Anime Drive Network</span>
      </div>

      {/* Glowing Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1222] via-[#080b14] to-[#04060a] border border-blue-500/25 p-6 sm:p-12 shadow-2xl shadow-blue-950/30 text-center mb-10">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-wider shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Ecosystem &amp; Community Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Welcome to the <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">Anime Drive Network</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            India&apos;s ultimate anime destination. Combining <strong>100% Ad-Free High-Speed Streaming</strong> on KaiAnime with India&apos;s most reliable <strong>Hindi Dubbed Anime Downloading</strong> on Anime Drive.
          </p>
        </div>
      </div>

      {/* Two Pillars Section: KaiAnime (Streaming) vs Anime Drive (Downloading) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Pillar 1: KaiAnime */}
        <div className="rounded-2xl bg-[#090d16] border border-blue-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-xl hover:border-blue-500/50 transition-all group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30 group-hover:scale-105 transition-transform">
                <Play className="w-6 h-6 fill-current" />
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[11px] font-extrabold uppercase">
                Streaming Platform
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">KaiAnime.me</h2>
              <p className="text-xs text-slate-400 mt-1">Official Web Streaming Platform of Anime Drive</p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong>KaiAnime</strong> ko khas taur par smooth, lightning-fast aur <strong>100% Ad-Free</strong> anime streaming ke liye banaya gaya hai. Yahan aapko zero popups, zero redirects aur instant cloud playback milta hai.
            </p>

            <ul className="space-y-2 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Ad-Free — No Popups &bull; No Redirects</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-Audio: Hindi Dub, English Sub &amp; Japanese</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full HD 1080p Adaptive Cloud HLS Stream</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Watch History &amp; Watchlist Local Sync</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Support Email:</span>
              <a href="mailto:kaianime@outlook.in" className="text-blue-400 hover:underline font-semibold">
                kaianime@outlook.in
              </a>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Instagram:</span>
              <a href="https://instagram.com/kaianime.me" target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:underline font-semibold">
                @kaianime.me
              </a>
            </div>
            <Link
              href="/home"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95 mt-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Streaming on KaiAnime</span>
            </Link>
          </div>
        </div>

        {/* Pillar 2: Anime Drive */}
        <div className="rounded-2xl bg-[#090d16] border border-emerald-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-xl hover:border-emerald-500/50 transition-all group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-105 transition-transform">
                <Download className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-extrabold uppercase">
                Download Hub
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">Anime Drive</h2>
              <p className="text-xs text-slate-400 mt-1">India&apos;s #1 Hindi Dubbed Anime Downloading Site</p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong>Anime Drive (animedrive.me)</strong> India me Hindi Dubbed anime download karne ka sabse fast aur trusted platform hai. Yahan ka <strong>Downloading Process bohot hi smooth, clean aur aasan hai</strong>, bina kisi confusing ads ya broken links ke.
            </p>

            <ul className="space-y-2 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Super Fast &amp; Smooth Download Process</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Complete Season Zip / Batch Downloads</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>High-Speed Direct Cloud Storage Links</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Anime Drive Official Android APK App</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Network Email:</span>
              <a href="mailto:animedrive@outlook.in" className="text-emerald-400 hover:underline font-semibold">
                animedrive@outlook.in
              </a>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Instagram:</span>
              <a href="https://instagram.com/animedrive_me" target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:underline font-semibold">
                @animedrive_me
              </a>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Telegram:</span>
              <a href="https://t.me/animeedrive" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline font-semibold">
                @animeedrive
              </a>
            </div>
            <a
              href="https://animedrive.me"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 mt-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visit animedrive.me</span>
            </a>
          </div>
        </div>
      </div>

      {/* Official Community & Contact Channels */}
      <div className="rounded-2xl bg-[#090c14] border border-white/10 p-6 sm:p-8 mb-10 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <Layers className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg sm:text-xl font-bold text-white">Official Network Channels &amp; Contacts</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Channel 1: Anime Drive Website */}
          <a
            href="https://animedrive.me"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-emerald-500/40 transition-all flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-xs text-slate-400">Anime Drive Main Site</p>
              <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">animedrive.me</p>
            </div>
          </a>

          {/* Channel 2: Anime Drive Telegram */}
          <a
            href="https://t.me/animeedrive"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-sky-500/40 transition-all flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Send className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-xs text-slate-400">Anime Drive Telegram</p>
              <p className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">@animeedrive</p>
            </div>
          </a>

          {/* Channel 3: Anime Drive Instagram */}
          <a
            href="https://instagram.com/animedrive_me"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-rose-500/40 transition-all flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div className="truncate">
              <p className="text-xs text-slate-400">Anime Drive Instagram</p>
              <p className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">@animedrive_me</p>
            </div>
          </a>

          {/* Channel 4: KaiAnime Instagram */}
          <a
            href="https://instagram.com/kaianime.me"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-pink-500/40 transition-all flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-indigo-500/20 text-pink-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div className="truncate">
              <p className="text-xs text-slate-400">KaiAnime Instagram</p>
              <p className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">@kaianime.me</p>
            </div>
          </a>

          {/* Channel 5: KaiAnime Support Email */}
          <a
            href="mailto:kaianime@outlook.in"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-blue-500/40 transition-all flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-xs text-slate-400">KaiAnime Support Email</p>
              <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">kaianime@outlook.in</p>
            </div>
          </a>

          {/* Channel 6: Anime Drive Network Email */}
          <a
            href="mailto:animedrive@outlook.in"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-emerald-500/40 transition-all flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-xs text-slate-400">Anime Drive Network Email</p>
              <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">animedrive@outlook.in</p>
            </div>
          </a>
        </div>
      </div>

      {/* Heartfelt Community Note — Thanks For Your Support */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-emerald-900/30 border border-white/15 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-lg shadow-rose-950/40">
            <Heart className="w-7 h-7 fill-rose-500 text-rose-500" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Thanks For Your Support! ❤️
          </h3>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Aap sabhi anime fans aur community members ke bina ye safar sambhav nahi tha. Aapke continuous pyaar aur support ki wajah se hi <strong>Anime Drive</strong> aur <strong>KaiAnime</strong> lagatar grow kar rahe hain. Hum aage bhi aapke liye sabse fast servers, latest Hindi Dubbed anime aur clean ad-free experience deliver karte rahenge!
          </p>

          <p className="text-xs text-slate-400 pt-2 font-medium">
            — With ❤️ from the <strong className="text-white">Anime Drive Network Team</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
