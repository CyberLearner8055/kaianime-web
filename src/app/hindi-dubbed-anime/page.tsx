import React from "react";
import type { Metadata } from "next";
import { fetchAllAnime, toSlimAnime } from "@/lib/data";
import CategoryHubLayout from "@/components/CategoryHubLayout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Watch Hindi Dubbed Anime Online Free in Full HD (1080p) | KaiAnime",
  description:
    "Stream 700+ Hindi dubbed anime series & movies online for free in 1080p Full HD with zero ads. Daily latest episodes in Hindi audio, fast streaming, and download on KaiAnime.me.",
  keywords: [
    "hindi dubbed anime",
    "watch hindi dubbed anime online free",
    "anime in hindi",
    "hindi dubbed anime download",
    "free anime in hindi",
    "hindi dub anime site",
    "anime hindi 1080p",
    "kaianime hindi",
    "kaianime.me",
  ],
  alternates: {
    canonical: "https://kaianime.me/hindi-dubbed-anime",
  },
  openGraph: {
    title: "Watch Hindi Dubbed Anime Online Free in Full HD | KaiAnime",
    description:
      "Stream 700+ Hindi dubbed anime series & movies online for free in 1080p Full HD with zero ads.",
    url: "https://kaianime.me/hindi-dubbed-anime",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Watch Hindi Dubbed Anime Online Free in Full HD | KaiAnime",
    description: "Stream 700+ Hindi dubbed anime series & movies online for free with zero ads.",
  },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HindiDubbedAnimePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pageNum = parseInt(params.page || "1", 10);
  const currentPage = isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;

  const allAnime = await fetchAllAnime();
  const hindiAnime = allAnime.filter((a) => a.isHindiDubbed).map(toSlimAnime);

  const faqs = [
    {
      question: "Where can I watch Hindi dubbed anime online for free?",
      answer:
        "You can stream over 700+ Hindi dubbed anime series and movies completely free on KaiAnime.me with zero ads, zero interruptions, and ultra-fast high-speed streaming servers.",
    },
    {
      question: "Are all episodes available in Full HD 1080p quality?",
      answer:
        "Yes! All anime on KaiAnime are available in crisp Full HD 1080p and 720p resolution with clear Hindi dubbed audio and English subtitles.",
    },
    {
      question: "How frequently are new Hindi dubbed anime episodes added?",
      answer:
        "New episodes and newly released Hindi dubbed anime series are added daily as soon as official and fan dubs are released.",
    },
    {
      question: "Can I download Hindi dubbed anime episodes for offline watching?",
      answer:
        "Yes! You can download episodes in 720p and 1080p with high-speed Google Drive and cloud links directly through our network platform.",
    },
  ];

  const seoContent = {
    heading: "Watch 700+ Hindi Dubbed Anime Series Online Free in India",
    paragraphs: [
      "Welcome to KaiAnime's dedicated Hindi Dubbed Anime hub! Indian anime fans no longer need to suffer through low-quality audio, intrusive pop-up advertisements, or broken video players. Our mission is to deliver the smoothest, fastest, and highest-fidelity anime streaming experience in India.",
      "Explore our hand-picked collection of iconic series like Naruto Shippuden, Dragon Ball Super, Jujutsu Kaisen, Solo Leveling, Demon Slayer, Attack on Titan, and Death Note—all featuring authentic Hindi voice dubbing and crystal-clear sound.",
      "Whether you are streaming on mobile (Jio/Airtel 4G/5G) or desktop broadband, our adaptive HLS video player ensures zero buffering and instant playback at 1080p Ultra HD.",
    ],
  };

  return (
    <CategoryHubLayout
      title="Watch Hindi Dubbed Anime Online Free in Full HD"
      subtitle="Stream over 700+ Hindi dubbed anime series and movies with zero ads, ultra-fast servers, and studio audio."
      badge="100% Free Hindi Dubbed"
      animeList={hindiAnime}
      currentPage={currentPage}
      itemsPerPage={24}
      basePath="/hindi-dubbed-anime"
      faqs={faqs}
      seoContent={seoContent}
      breadcrumbName="Hindi Dubbed Anime"
    />
  );
}
