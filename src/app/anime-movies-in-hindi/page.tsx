import React from "react";
import type { Metadata } from "next";
import { fetchAllAnime, toSlimAnime } from "@/lib/data";
import CategoryHubLayout from "@/components/CategoryHubLayout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Watch Anime Movies in Hindi Dubbed Online Free in 1080p | KaiAnime",
  description:
    "Watch popular anime movies in Hindi Dubbed and Multi-Audio for free in 1080p Ultra HD. Stream Makoto Shinkai, Studio Ghibli, and blockbuster anime films on KaiAnime with zero ads.",
  keywords: [
    "anime movies in hindi",
    "watch anime movies hindi dubbed",
    "hindi dubbed anime movies download",
    "free anime movies hindi",
    "makoto shinkai hindi",
    "ghibli movies in hindi",
    "suzume hindi dub",
    "your name hindi dub",
  ],
  alternates: {
    canonical: "https://kaianime.site/anime-movies-in-hindi",
  },
  openGraph: {
    title: "Watch Anime Movies in Hindi Dubbed Online Free in 1080p | KaiAnime",
    description:
      "Watch popular anime movies in Hindi Dubbed and Multi-Audio for free in 1080p Ultra HD with zero ads.",
    url: "https://kaianime.site/anime-movies-in-hindi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anime Movies in Hindi Dubbed | KaiAnime",
    description: "Stream full anime movies in Hindi dubbed 1080p with zero ads.",
  },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AnimeMoviesInHindiPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pageNum = parseInt(params.page || "1", 10);
  const currentPage = isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;

  const allAnime = await fetchAllAnime();

  // Filter for movies or single-episode cinematic releases
  const movieAnime = allAnime
    .filter(
      (a) =>
        a.type?.toLowerCase() === "movie" ||
        a.episodesCount === 1 ||
        a.title.toLowerCase().includes("movie") ||
        a.genres.some((g) => g.toLowerCase() === "movie")
    )
    .map(toSlimAnime);

  const faqs = [
    {
      question: "Are anime movies on KaiAnime available in Hindi Dub?",
      answer:
        "Yes! Blockbuster cinematic releases including Jujutsu Kaisen 0, Demon Slayer Mugen Train, Your Name, Weathering With You, and Suzume are available in Hindi dubbed audio.",
    },
    {
      question: "Can I watch full anime films without paying any fee?",
      answer:
        "Yes, all anime movies are 100% free to stream in 1080p Ultra HD without requiring any subscription, credit card, or sign-up.",
    },
    {
      question: "Are movie subtitles available along with Hindi audio?",
      answer:
        "Yes, all movie streams feature clear English subtitles and multi-audio language switching options.",
    },
    {
      question: "Can I download full anime movies in 1080p?",
      answer:
        "Yes, high-speed single-file movie downloads in 720p and 1080p Blu-Ray quality are supported.",
    },
  ];

  const seoContent = {
    heading: "Stream Blockbuster Anime Movies in Hindi Dubbed Ultra HD",
    paragraphs: [
      "Experience cinematic anime masterworks right from your couch or smartphone. From Makoto Shinkai's breathtaking emotional masterpieces (Your Name, Weathering With You, Suzume) to legendary Studio Ghibli adventures (Spirited Away, Princess Mononoke) and blockbuster theatrical films from the Jujutsu Kaisen and Demon Slayer franchises.",
      "KaiAnime provides dedicated single-click playback with high-bitrate stereo and 5.1 surround sound in Hindi dubbed and Japanese original audio. Zero popups, zero buffering, and full-screen immersive mode on any device.",
      "Browse our full collection of feature-length anime films, bookmark your favorites, and enjoy movie night like never before.",
    ],
  };

  return (
    <CategoryHubLayout
      title="Watch Anime Movies in Hindi Dubbed Online Free"
      subtitle="Full-length cinematic anime movies in Hindi Dubbed and Multi-Audio in crystal clear 1080p Ultra HD."
      badge="🎬 Hindi Anime Movies"
      animeList={movieAnime}
      currentPage={currentPage}
      itemsPerPage={24}
      basePath="/anime-movies-in-hindi"
      faqs={faqs}
      seoContent={seoContent}
      breadcrumbName="Anime Movies in Hindi"
    />
  );
}
