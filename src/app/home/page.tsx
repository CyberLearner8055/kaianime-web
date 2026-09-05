import React from "react";
import { Metadata } from "next";
import SpotlightSwiper from "@/components/SpotlightSwiper";
import ContinueWatchingSection from "@/components/ContinueWatchingSection";
import LatestAnimesSection from "@/components/LatestAnimesSection";
import TopAnimesWidget from "@/components/TopAnimesWidget";
import FloatingAppPromo from "@/components/FloatingAppPromo";
import ContentRail from "@/components/ContentRail";
import {
  getAllAnime,
  getAppTrendingAnime,
  getRunningAnime,
  getActionAnime,
  getIsekaiAnime,
  getRomanceAnime,
  toSlimAnime,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "KaiAnime - Stream Anime Online in Ultra HD (100% Ad-Free)",
  description:
    "Stream your favorite anime in Hindi, Tamil, Telugu & English with multi-audio, high-speed servers, and 100% ad-free experience.",
  alternates: {
    canonical: "https://kaianime.site/home",
  },
};

export default async function HomePage() {
  const [allAnime, spotlights, running, action, isekai, romance] = await Promise.all([
    getAllAnime(),
    getAppTrendingAnime(),
    getRunningAnime(),
    getActionAnime(),
    getIsekaiAnime(),
    getRomanceAnime(),
  ]);

  const slimAll = allAnime.map(toSlimAnime);
  const slimSpotlights = spotlights.map(toSlimAnime);
  const slimRunning = running.map(toSlimAnime);
  const slimAction = action.map(toSlimAnime);
  const slimIsekai = isekai.map(toSlimAnime);
  const slimRomance = romance.map(toSlimAnime);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-3">
      {/* 1. Upper Slider (App BannerSlider style with Featured & Promo) */}
      <SpotlightSwiper spotlights={slimSpotlights} />

      {/* 2. EXACTLY BELOW SLIDER: Running Anime (Matched with live App Ongoing API) */}
      <div className="my-6">
        <ContentRail
          id="running"
          title="⚡ Airing Now (Running Anime)"
          subtitle="Latest episodes updated daily directly from Anime Drive App"
          animeList={slimRunning}
          viewAllHref="/search?filter=running"
        />
      </div>

      {/* 3. Continue Watching Section (From localStorage) */}
      <ContinueWatchingSection />

      {/* 4. Action Anime Rail */}
      <ContentRail
        id="action"
        title="⚔️ Action Anime"
        animeList={slimAction}
        viewAllHref="/search?genre=Action"
      />

      {/* 5. Isekai & Fantasy Anime Rail */}
      <ContentRail
        id="isekai"
        title="🌀 Isekai & Fantasy Anime"
        animeList={slimIsekai}
        viewAllHref="/search?genre=Fantasy"
      />

      {/* 6. Romance Anime Rail */}
      <ContentRail
        id="romance"
        title="💖 Romance Anime"
        animeList={slimRomance}
        viewAllHref="/search?genre=Romance"
      />

      {/* 7. Latest Animes with Type Tabs: [All], [Series], [Movies] */}
      <LatestAnimesSection allAnime={slimAll} />

      {/* 8. Top Animes Widget (Direct Top 10 list without Day/Week/Month tabs) */}
      <TopAnimesWidget topAnime={slimSpotlights.slice(0, 10)} />

      {/* Floating Bottom App Promo */}
      <FloatingAppPromo />
    </div>
  );
}
