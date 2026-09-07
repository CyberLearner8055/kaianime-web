import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAnimeByIdOrSlug } from "@/lib/data";
import WatchClient from "./WatchClient";

interface PageProps {
  params: Promise<{ slug: string; ep: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, ep } = await params;
  const anime = await getAnimeByIdOrSlug(slug);

  if (!anime) {
    return {
      title: "Episode Not Found | KaiAnime.me",
    };
  }

  const epNum = parseInt(ep, 10) || 1;
  const title = `Watch ${anime.title} Episode ${epNum} Online Free (${
    anime.isHindiDubbed ? "Hindi Dub" : "English Sub"
  })`;
  const desc = `Stream ${anime.title} Episode ${epNum} in Full HD 1080p with zero ads and zero redirects. Multi-audio options available on KaiAnime.me.`;

  return {
    title,
    description: desc,
    keywords: [
      `watch ${anime.title} episode ${epNum} hindi dub`,
      `download ${anime.title} ep ${epNum} hindi dubbed 720p 1080p`,
      `${anime.title} episode ${epNum} free stream online`,
      `${anime.title} ep ${epNum} full hd 0 ads`,
      `${anime.title} ep ${epNum} multi audio`,
      `${anime.title} ep ${epNum} english sub`,
      "watch anime hindi dub free",
      "kaianime",
      "kaianime.me",
      "anime drive",
    ],
    alternates: {
      canonical: `https://kaianime.me/watch/${anime.id}/${epNum}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://kaianime.me/watch/${anime.id}/${epNum}`,
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

export default async function WatchPage({ params }: PageProps) {
  const { slug, ep } = await params;
  const anime = await getAnimeByIdOrSlug(slug);

  if (!anime) {
    notFound();
  }

  const epNum = parseInt(ep, 10) || 1;
  const episode =
    anime.episodes.find((e) => e.number === epNum) ||
    anime.episodes[0] || {
      id: `${anime.id}-ep${epNum}`,
      number: epNum,
      title: `Episode ${epNum}`,
      servers: {},
    };

  // Deterministic stable upload date to prevent Google Rich Snippets strip
  const safeYear = anime.year ? String(anime.year).replace(/\D/g, "") : "2024";
  const releaseYear = safeYear.length === 4 ? safeYear : "2024";
  const stableUploadDate = `${releaseYear}-01-01T00:00:00.000Z`;

  // VideoObject Schema.org for Google Search Rich Video snippets
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `Watch ${anime.title} Episode ${epNum} Hindi Dubbed Online Free - KaiAnime`,
    description: `Stream and download ${anime.title} Episode ${epNum} in Full HD 1080p with Hindi Dubbed audio and English subtitles. 100% ad-free on KaiAnime.me.`,
    thumbnailUrl: [anime.banner || anime.poster],
    uploadDate: stableUploadDate,
    duration: "PT24M",
    inLanguage: ["hi", "en", "ja"],
    contentUrl: `https://kaianime.me/watch/${anime.id}/${epNum}`,
    embedUrl: `https://kaianime.me/watch/${anime.id}/${epNum}`,
  };

  // BreadcrumbList Schema.org for Google Search Rich Navigation Snippets
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://kaianime.me",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: anime.title,
        item: `https://kaianime.me/anime/${anime.id}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Episode ${epNum}`,
        item: `https://kaianime.me/watch/${anime.id}/${epNum}`,
      },
    ],
  };

  // TVEpisode / Movie Schema for Structured Knowledge Graph
  const episodeSchema = {
    "@context": "https://schema.org",
    "@type": anime.type?.toLowerCase() === "movie" ? "Movie" : "TVEpisode",
    name: `${anime.title} Episode ${epNum} Hindi Dubbed`,
    episodeNumber: epNum,
    description: `Watch ${anime.title} Episode ${epNum} Hindi Dubbed in 1080p Full HD on KaiAnime.`,
    partOfSeries: {
      "@type": "TVSeries",
      name: anime.title,
      url: `https://kaianime.me/anime/${anime.id}`,
    },
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(episodeSchema) }}
      />
      <WatchClient anime={anime} episode={episode} epNumber={epNum} />
    </div>
  );
}
