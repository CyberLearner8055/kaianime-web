import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Star,
  Play,
  Calendar,
  Layers,
  ArrowLeft,
  Share2,
  Mic,
  ShieldCheck,
  Building,
  Sparkles,
  Download,
  Tv,
  CheckCircle2,
  Info,
} from "lucide-react";
import { getAnimeByIdOrSlug, fetchAllAnime } from "@/lib/data";
import { fetchAniListMetadata } from "@/lib/anilist";
import ContentRail from "@/components/ContentRail";
import EpisodeSelector from "./EpisodeSelector";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const anime = await getAnimeByIdOrSlug(slug);

  if (!anime) {
    return {
      title: "Anime Not Found | KaiAnime.site",
    };
  }

  const title = `Watch ${anime.title} Online Free (${
    anime.isHindiDubbed ? "Hindi Dubbed & English Sub" : "English Sub"
  }) in Full HD`;
  const desc = `Stream ${anime.title} full episodes in 1080p Ultra HD with ${
    anime.isHindiDubbed ? "Hindi Dubbed Audio and English Subtitles" : "Original Japanese Audio and English Subtitles"
  }. 100% free streaming with 0 ads, 0 popups, and high-speed servers on KaiAnime.site.`;

  return {
    title,
    description: desc,
    keywords: [
      anime.title,
      `${anime.title} watch online`,
      `${anime.title} hindi dub`,
      `${anime.title} episodes free`,
      `${anime.title} stream full hd`,
      `${anime.title} free anime stream`,
      "kaianime",
      "anime drive",
    ],
    alternates: {
      canonical: `https://kaianime.site/anime/${anime.id}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://kaianime.site/anime/${anime.id}`,
      images: [{ url: anime.banner || anime.poster, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [anime.banner || anime.poster],
    },
  };
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const anime = await getAnimeByIdOrSlug(slug);

  if (!anime) {
    notFound();
  }

  // Fetch AniList metadata enrichment in parallel
  const [enriched, allAnime] = await Promise.all([
    fetchAniListMetadata(anime.title),
    fetchAllAnime(),
  ]);

  // Related anime by genre match
  const related = allAnime
    .filter(
      (a) =>
        a.id !== anime.id &&
        a.genres.some((g) => anime.genres.includes(g))
    )
    .slice(0, 10);

  const firstEpisode = anime.episodes && anime.episodes.length > 0 ? anime.episodes[0].number : 1;

  // Schema.org BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://kaianime.site",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Anime Catalog",
        item: "https://kaianime.site/search",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: anime.title,
        item: `https://kaianime.site/anime/${anime.id}`,
      },
    ],
  };

  // Schema.org TVSeries / Movie JSON-LD
  const seriesSchema = {
    "@context": "https://schema.org",
    "@type": anime.type === "Movie" ? "Movie" : "TVSeries",
    name: anime.title,
    alternateName: [enriched?.romajiTitle, enriched?.englishTitle, enriched?.nativeTitle, anime.japaneseTitle].filter(Boolean),
    description: anime.synopsis,
    image: anime.poster,
    genre: anime.genres,
    numberOfEpisodes: anime.episodesCount,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: anime.rating.toFixed(1),
      bestRating: "10",
      ratingCount: "2540",
    },
  };

  // Schema.org FAQPage for High-Ranking Google Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Where can I watch ${anime.title} online for free without ads?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `You can stream all episodes of ${anime.title} in Ultra HD on KaiAnime.site with 0 ads, 0 popups, and high-speed streaming servers.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${anime.title} available in Hindi Dubbed audio?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: anime.isHindiDubbed
            ? `Yes! ${anime.title} is available to stream with high-quality Hindi Dubbed audio right here on KaiAnime.`
            : `Currently, ${anime.title} is available in original Japanese voice audio with English subtitles on KaiAnime.`,
        },
      },
      {
        "@type": "Question",
        name: `How many episodes and seasons are there in ${anime.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${anime.title} features ${anime.episodesCount} episodes across ${anime.seasons.length} season(s), available to stream online on KaiAnime.site.`,
        },
      },
      {
        "@type": "Question",
        name: `Can I download ${anime.title} full episodes for offline viewing?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, high-speed batch downloads and Google Drive/Mega direct links for ${anime.title} are available on our companion site animedrive.me.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seriesSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Backdrop Header */}
      <div className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] overflow-hidden bg-[#08090D]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={anime.banner || anime.poster}
          alt={anime.title}
          className="w-full h-full object-cover object-center filter brightness-[0.45] scale-105"
        />
        {/* Deep Obsidian Gradient Transitions */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-[#08090D]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090D] via-[#08090D]/50 to-transparent w-full md:w-3/4" />
      </div>

      {/* Main Details Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-56 sm:-mt-72 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left Column: Poster & Quick Action */}
          <div className="w-full md:w-[280px] lg:w-[320px] flex-shrink-0 flex flex-col items-center md:items-start">
            {/* Poster Card */}
            <div className="w-[220px] sm:w-[260px] md:w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative bg-slate-900 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={anime.poster}
                alt={anime.title}
                className="w-full h-full object-cover"
              />

              {/* Floating Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                {anime.isHindiDubbed ? (
                  <span className="px-2.5 py-1 bg-emerald-500 text-black font-extrabold text-[11px] uppercase tracking-wider rounded-lg shadow-lg">
                    Hindi Dub
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-blue-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-lg shadow-lg">
                    Multi Audio
                  </span>
                )}
                <span className="px-2 py-0.5 text-xs font-bold bg-black/75 text-amber-300 border border-amber-500/20 rounded-lg backdrop-blur-sm flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {anime.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="w-full mt-5 space-y-3">
              <Link
                href={`/watch/${anime.id}/${firstEpisode}`}
                className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm text-center flex items-center justify-center gap-2.5 shadow-xl shadow-blue-600/30 transition-all duration-200 active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Watch Episode 1 Now</span>
              </Link>

              <a
                href="https://animedrive.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-xs text-center flex items-center justify-center gap-2 border border-white/10 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>Batch Download on animedrive.me</span>
              </a>
            </div>

            {/* Quick Metadata Box */}
            <div className="w-full mt-6 p-5 rounded-2xl glass-panel space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="text-slate-400">Status</span>
                {(() => {
                  const displayStatus = enriched?.status
                    ? enriched.status === "RELEASING"
                      ? "Ongoing"
                      : "Completed"
                    : anime.status;
                  const isOngoing = displayStatus === "Ongoing";
                  return (
                    <span className={`font-bold flex items-center gap-1.5 ${isOngoing ? "text-amber-400" : "text-emerald-400"}`}>
                      {isOngoing ? (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      {displayStatus}
                    </span>
                  );
                })()}
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="text-slate-400">Episodes</span>
                <span className="font-bold text-white">{anime.episodesCount} Episodes</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="text-slate-400">Seasons</span>
                <span className="font-bold text-white">{anime.seasons.length} Season(s)</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="text-slate-400">Quality</span>
                <span className="font-bold text-blue-400">{anime.quality || "1080p FHD"}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="text-slate-400">Audio</span>
                <span className="font-bold text-slate-200">
                  {anime.langs || (anime.isHindiDubbed ? "Hindi, Japanese" : "Hindi, English, Japanese")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Studio</span>
                <span className="font-bold text-white truncate max-w-[150px]">
                  {enriched?.studio || "Animation Studio"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Details, Synopsis, Episodes, FAQs */}
          <div className="flex-1 min-w-0 space-y-8">
            <div>
              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <span>/</span>
                <Link href="/search" className="hover:text-white transition-colors">
                  Anime
                </Link>
                <span>/</span>
                <span className="text-blue-400 font-medium truncate max-w-[240px]">{anime.title}</span>
              </div>

              {/* Title & Japanese Titles */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {anime.title}
              </h1>

              {(enriched?.romajiTitle || enriched?.nativeTitle || anime.japaneseTitle) && (
                <p className="text-sm text-slate-400 mt-1 font-medium">
                  {[enriched?.romajiTitle, enriched?.nativeTitle || anime.japaneseTitle].filter(Boolean).join(" • ")}
                </p>
              )}

              {/* High-Contrast Tags */}
              <div className="flex flex-wrap items-center gap-2.5 mt-4">
                <span className="flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-400 font-extrabold text-xs rounded-xl border border-blue-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Ad-Free
                </span>

                <span className="flex items-center gap-1 px-3 py-1 bg-amber-500/15 text-amber-300 font-extrabold text-xs rounded-xl border border-amber-500/30">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {anime.rating.toFixed(1)} Rating
                </span>

                <span className="px-3 py-1 bg-white/5 text-slate-300 font-semibold text-xs rounded-xl border border-white/10">
                  {anime.type || "Series"}
                </span>

                <span className="px-3 py-1 bg-white/5 text-slate-300 font-semibold text-xs rounded-xl border border-white/10">
                  {anime.year}
                </span>

                {anime.isHindiDubbed && (
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-black text-xs rounded-xl border border-emerald-500/40">
                    Hindi Dubbed
                  </span>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mt-4">
                {anime.genres.map((g) => (
                  <Link
                    key={g}
                    href={`/search?genre=${encodeURIComponent(g)}`}
                    className="px-3 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/30 rounded-xl transition-colors"
                  >
                    {g}
                  </Link>
                ))}
              </div>
            </div>

            {/* Synopsis Section */}
            <div className="glass-panel p-6 sm:p-7 rounded-2xl">
              <h2 className="text-base font-bold text-white mb-2.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Synopsis & Storyline</span>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-normal">
                {anime.synopsis}
              </p>
            </div>

            {/* Multi-Season Episode Selector */}
            <div className="glass-panel p-6 rounded-2xl">
              <EpisodeSelector
                animeId={anime.id}
                episodes={anime.episodes}
                seasons={anime.seasons}
                isHindiDubbed={anime.isHindiDubbed}
              />
            </div>

            {/* Characters & Voice Cast (if enriched by AniList) */}
            {enriched?.characters && enriched.characters.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-3">Main Characters & Voice Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {enriched.characters.slice(0, 8).map((char, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10"
                    >
                      {char.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={char.image}
                          alt={char.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-800 flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{char.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {char.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Programmatic SEO FAQ Section */}
            <div className="glass-panel p-6 sm:p-7 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                <span>Streaming Guide & Frequently Asked Questions</span>
              </h2>
              <div className="space-y-4 text-xs">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="font-bold text-white text-sm">Where can I watch {anime.title} online for free without ads?</h3>
                  <p className="text-slate-300 mt-1 leading-relaxed">
                    You can stream {anime.title} in Full HD 1080p directly on KaiAnime.site. We eliminate all popups, redirects, and banner ads so you can enjoy pure anime streaming.
                  </p>
                </div>
                <div className="border-b border-white/5 pb-3">
                  <h3 className="font-bold text-white text-sm">Is {anime.title} available in Hindi Dubbed audio?</h3>
                  <p className="text-slate-300 mt-1 leading-relaxed">
                    {anime.isHindiDubbed
                      ? `Yes! All episodes of ${anime.title} are available in Hindi Dubbed audio right here on KaiAnime.`
                      : `Currently, ${anime.title} is available in Japanese voice audio with English subtitles on KaiAnime.`}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">How do I download {anime.title} full episodes for offline viewing?</h3>
                  <p className="text-slate-300 mt-1 leading-relaxed">
                    For high-speed batch downloads, Google Drive, and Mega cloud links, visit our companion portal <a href="https://animedrive.me" className="text-blue-400 hover:underline font-bold">animedrive.me</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related / Recommended Rail */}
        {related.length > 0 && (
          <div className="mt-16">
            <ContentRail
              title="You May Also Like"
              subtitle="More popular anime series sharing similar genres"
              items={related}
            />
          </div>
        )}
      </div>
    </div>
  );
}
