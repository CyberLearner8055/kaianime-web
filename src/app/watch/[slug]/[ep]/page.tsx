import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAnimeByIdOrSlug } from "@/lib/data";
import WatchClient from "./WatchClient";

interface PageProps {
  params: Promise<{ slug: string; ep: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug, ep } = await params;
  const search = searchParams ? await searchParams : undefined;
  const rawSeason = typeof search?.season === "string" ? search.season : Array.isArray(search?.season) ? search.season[0] : undefined;
  const querySeason = rawSeason ? parseInt(rawSeason, 10) : undefined;

  const anime = await getAnimeByIdOrSlug(slug);

  if (!anime) {
    return {
      title: "Episode Not Found | KaiAnime.me",
    };
  }

  let epNum = 1;
  let seasonNum = querySeason;

  const sMatch = ep.match(/^s(\d+)[-_]?(?:ep|e)?(\d+)$/i);
  if (sMatch) {
    seasonNum = parseInt(sMatch[1], 10);
    epNum = parseInt(sMatch[2], 10);
  } else {
    epNum = parseInt(ep, 10) || 1;
  }

  const episode = seasonNum
    ? anime.episodes.find((e) => (e.season || 1) === seasonNum && e.number === epNum)
    : anime.episodes.find((e) => e.number === epNum);

  const effectiveSeason = episode?.season || seasonNum || 1;
  const seasonText = effectiveSeason > 1 ? ` Season ${effectiveSeason}` : "";
  const seasonQuery = effectiveSeason > 1 ? `?season=${effectiveSeason}` : "";

  const title = `Watch ${anime.title}${seasonText} Episode ${epNum} Online Free (${
    anime.isHindiDubbed ? "Hindi Dub" : "English Sub"
  })`;
  const desc = `Stream ${anime.title}${seasonText} Episode ${epNum} in Full HD 1080p with zero ads and zero redirects. Multi-audio options available on KaiAnime.me.`;

  return {
    title,
    description: desc,
    keywords: [
      `watch ${anime.title}${seasonText} episode ${epNum} hindi dub`,
      `download ${anime.title}${seasonText} ep ${epNum} hindi dubbed 720p 1080p`,
      `${anime.title}${seasonText} episode ${epNum} free stream online`,
      `${anime.title}${seasonText} ep ${epNum} full hd 0 ads`,
      `${anime.title}${seasonText} ep ${epNum} multi audio`,
      `${anime.title}${seasonText} ep ${epNum} english sub`,
      "watch anime hindi dub free",
      "kaianime",
      "kaianime.me",
      "anime drive",
    ],
    alternates: {
      canonical: `https://kaianime.me/watch/${anime.id}/${epNum}${seasonQuery}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://kaianime.me/watch/${anime.id}/${epNum}${seasonQuery}`,
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

export default async function WatchPage({ params, searchParams }: PageProps) {
  const { slug, ep } = await params;
  const search = searchParams ? await searchParams : undefined;
  const rawSeason = typeof search?.season === "string" ? search.season : Array.isArray(search?.season) ? search.season[0] : undefined;
  const querySeason = rawSeason ? parseInt(rawSeason, 10) : undefined;

  const anime = await getAnimeByIdOrSlug(slug);

  if (!anime) {
    notFound();
  }

  let epNum = 1;
  let seasonNum = querySeason;

  const sMatch = ep.match(/^s(\d+)[-_]?(?:ep|e)?(\d+)$/i);
  if (sMatch) {
    seasonNum = parseInt(sMatch[1], 10);
    epNum = parseInt(sMatch[2], 10);
  } else {
    epNum = parseInt(ep, 10) || 1;
  }

  let episode = seasonNum
    ? anime.episodes.find((e) => (e.season || 1) === seasonNum && e.number === epNum)
    : null;

  if (!episode) {
    episode =
      anime.episodes.find((e) => e.number === epNum) ||
      anime.episodes[0] || {
        id: `${anime.id}-ep${epNum}`,
        number: epNum,
        title: `Episode ${epNum}`,
        servers: {},
      };
  }

  const effectiveSeason = episode.season || seasonNum || 1;
  const seasonText = effectiveSeason > 1 ? ` Season ${effectiveSeason}` : "";
  const seasonQuery = effectiveSeason > 1 ? `?season=${effectiveSeason}` : "";

  // Deterministic stable upload date to prevent Google Rich Snippets strip
  const safeYear = anime.year ? String(anime.year).replace(/\D/g, "") : "2024";
  const releaseYear = safeYear.length === 4 ? safeYear : "2024";
  const stableUploadDate = `${releaseYear}-01-01T00:00:00.000Z`;

  // VideoObject Schema.org for Google Search Rich Video snippets
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `Watch ${anime.title}${seasonText} Episode ${epNum} Hindi Dubbed Online Free - KaiAnime`,
    description: `Stream and download ${anime.title}${seasonText} Episode ${epNum} in Full HD 1080p with Hindi Dubbed audio and English subtitles. 100% ad-free on KaiAnime.me.`,
    thumbnailUrl: [anime.banner || anime.poster],
    uploadDate: stableUploadDate,
    duration: "PT24M",
    inLanguage: ["hi", "en", "ja"],
    contentUrl: `https://kaianime.me/watch/${anime.id}/${epNum}${seasonQuery}`,
    embedUrl: `https://kaianime.me/watch/${anime.id}/${epNum}${seasonQuery}`,
  };

  // BreadcrumbList Schema.org for Google Search Rich Navigation Snippets
  const breadcrumbList = [
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
  ];

  if (effectiveSeason > 1) {
    breadcrumbList.push({
      "@type": "ListItem",
      position: 3,
      name: `Season ${effectiveSeason}`,
      item: `https://kaianime.me/anime/${anime.id}?season=${effectiveSeason}`,
    });
    breadcrumbList.push({
      "@type": "ListItem",
      position: 4,
      name: `Episode ${epNum}`,
      item: `https://kaianime.me/watch/${anime.id}/${epNum}${seasonQuery}`,
    });
  } else {
    breadcrumbList.push({
      "@type": "ListItem",
      position: 3,
      name: `Episode ${epNum}`,
      item: `https://kaianime.me/watch/${anime.id}/${epNum}`,
    });
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbList,
  };

  // TVEpisode / Movie Schema for Structured Knowledge Graph
  const episodeSchema = {
    "@context": "https://schema.org",
    "@type": anime.type?.toLowerCase() === "movie" ? "Movie" : "TVEpisode",
    name: `${anime.title}${seasonText} Episode ${epNum} Hindi Dubbed`,
    episodeNumber: epNum,
    description: `Watch ${anime.title}${seasonText} Episode ${epNum} Hindi Dubbed in 1080p Full HD on KaiAnime.`,
    partOfSeries: {
      "@type": "TVSeries",
      name: anime.title,
      url: `https://kaianime.me/anime/${anime.id}`,
    },
    ...(effectiveSeason > 1
      ? {
          partOfSeason: {
            "@type": "TVSeason",
            seasonNumber: effectiveSeason,
          },
        }
      : {}),
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
      <WatchClient
        key={`${anime.id}-s${effectiveSeason}-e${epNum}`}
        anime={anime}
        episode={episode}
        epNumber={epNum}
      />
    </div>
  );
}
