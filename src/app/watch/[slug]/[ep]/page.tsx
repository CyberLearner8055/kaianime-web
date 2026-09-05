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
      title: "Episode Not Found | KaiAnime.site",
    };
  }

  const epNum = parseInt(ep, 10) || 1;
  const title = `Watch ${anime.title} Episode ${epNum} Online Free (${
    anime.isHindiDubbed ? "Hindi Dub" : "English Sub"
  })`;
  const desc = `Stream ${anime.title} Episode ${epNum} in Full HD 1080p with zero ads and zero redirects. Multi-audio options available on KaiAnime.site.`;

  return {
    title,
    description: desc,
    keywords: [
      `${anime.title} episode ${epNum}`,
      `watch ${anime.title} ep ${epNum}`,
      `${anime.title} ep ${epNum} hindi dub`,
      `${anime.title} ep ${epNum} english sub`,
      "kaianime",
      "free anime streaming",
    ],
    openGraph: {
      title,
      description: desc,
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

  // VideoObject Schema.org for Google Search Rich Video snippets
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${anime.title} Episode ${epNum}`,
    description: `Watch ${anime.title} Episode ${epNum} in HD with zero ads on KaiAnime.`,
    thumbnailUrl: [anime.banner || anime.poster],
    uploadDate: new Date().toISOString(),
    contentUrl: `https://kaianime.site/watch/${anime.id}/${epNum}`,
    embedUrl: `https://kaianime.site/watch/${anime.id}/${epNum}`,
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <WatchClient anime={anime} episode={episode} epNumber={epNum} />
    </div>
  );
}
