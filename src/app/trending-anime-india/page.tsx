import React from "react";
import type { Metadata } from "next";
import { fetchAllAnime, toSlimAnime } from "@/lib/data";
import CategoryHubLayout from "@/components/CategoryHubLayout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trending Anime in India - Top Watched Hindi Dubbed Series & Movies | KaiAnime",
  description:
    "Discover the top trending anime series and movies in India right now. Watch viral anime in Hindi Dubbed & English Subtitles with zero ads on KaiAnime.",
  keywords: [
    "trending anime in india",
    "top anime in india",
    "popular anime hindi",
    "most watched anime in india",
    "best anime series india",
    "top hindi dubbed anime",
    "trending hindi anime",
    "kaianime trending",
  ],
  alternates: {
    canonical: "https://kaianime.site/trending-anime-india",
  },
  openGraph: {
    title: "Trending Anime in India - Top Watched Hindi Dubbed Series & Movies",
    description: "Discover the top trending anime series and movies in India right now. Watch with zero ads on KaiAnime.",
    url: "https://kaianime.site/trending-anime-india",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trending Anime in India | KaiAnime",
    description: "Top trending anime series and movies in India. Stream in Hindi dubbed with zero ads.",
  },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function TrendingAnimeIndiaPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pageNum = parseInt(params.page || "1", 10);
  const currentPage = isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;

  const allAnime = await fetchAllAnime();

  // Filter & sort for trending in India:
  // Prefer highly rated titles, recent releases, and prominent trending anime
  const trendingAnime = [...allAnime]
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.episodesCount - a.episodesCount;
    })
    .map(toSlimAnime);

  const faqs = [
    {
      question: "Which anime is currently the most popular in India?",
      answer:
        "Jujutsu Kaisen, Solo Leveling, Demon Slayer, Naruto Shippuden, and One Piece are currently the top trending anime series across India.",
    },
    {
      question: "Can I watch trending anime with Hindi audio on KaiAnime?",
      answer:
        "Yes! The vast majority of trending titles on KaiAnime feature full Hindi Dubbed audio alongside English and Japanese multi-audio tracks.",
    },
    {
      question: "Is KaiAnime 100% free to stream trending anime in India?",
      answer:
        "Yes, KaiAnime is 100% free to watch without any subscription fees, registration requirements, or annoying popup ads.",
    },
    {
      question: "Are trending anime episodes updated weekly as they air?",
      answer:
        "Yes, new episodes of simulcast and trending weekly broadcast series are updated as soon as raw streams and dubs are finalized.",
    },
  ];

  const seoContent = {
    heading: "Explore What India Is Watching: Top Anime Series & Blockbuster Films",
    paragraphs: [
      "Anime culture in India is booming like never before. From shonen battle epics like Jujutsu Kaisen and Bleach: Thousand-Year Blood War to modern fantasy sensations like Solo Leveling and Frieren, millions of Indian fans are tuning in daily.",
      "KaiAnime curates the most actively searched and watched anime series across Delhi, Mumbai, Bengaluru, Hyderabad, Kolkata, and beyond. Every trending title includes verified HD streaming links and official multi-language tracks.",
      "Stay ahead of the curve and binge the hottest seasonal anime sensations with smooth adaptive 1080p video streaming optimized for Indian mobile networks.",
    ],
  };

  return (
    <CategoryHubLayout
      title="Trending Anime in India - Top Watched Series & Movies"
      subtitle="The most popular and highest rated anime series trending across India right now. 100% ad-free in Full HD."
      badge="🔥 India #1 Trending"
      animeList={trendingAnime}
      currentPage={currentPage}
      itemsPerPage={24}
      basePath="/trending-anime-india"
      faqs={faqs}
      seoContent={seoContent}
      breadcrumbName="Trending in India"
    />
  );
}
