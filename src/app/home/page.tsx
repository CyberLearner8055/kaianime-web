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
  getSpotlightAnime,
  getRunningAnime,
  getActionAnime,
  getIsekaiAnime,
  getRomanceAnime,
  toSlimAnime,
} from "@/lib/data";
import { getSiteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "KaiAnime - Stream Anime Online in Ultra HD (100% Ad-Free)",
  description:
    "Stream your favorite anime in Hindi, Tamil, Telugu & English with multi-audio, high-speed servers, and 100% ad-free experience.",
  alternates: {
    canonical: "https://kaianime.site/home",
  },
};

export default async function HomePage() {
  const siteConfig = getSiteConfig();

  const [allAnime, spotlights, running, action, isekai, romance] = await Promise.all([
    getAllAnime(),
    getSpotlightAnime(),
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

  // Filter and sort active sections according to Admin Dashboard config
  const activeSections = [...siteConfig.sectionsOrder]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const announcement = siteConfig.announcement;

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-3">
      {/* Primary SEO H1 for Home Page */}
      <div className="pt-1 pb-2.5 px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/5 mb-3">
        <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
          Watch Latest <span className="text-blue-500">Hindi Dubbed Anime</span> Online Free in Full HD
        </h1>
        <span className="text-[11px] text-slate-400 font-semibold">
          100% Ad-Free Streaming &bull; Multi-Audio
        </span>
      </div>

      {/* Global Announcement Notice Bar (Controlled from Admin Dashboard) */}
      {announcement?.enabled && announcement.text && (
        <div
          className={`mb-4 p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            announcement.theme === "emerald"
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
              : announcement.theme === "amber"
              ? "bg-amber-950/40 border-amber-500/30 text-amber-200"
              : announcement.theme === "rose"
              ? "bg-rose-950/40 border-rose-500/30 text-rose-200"
              : "bg-blue-950/40 border-blue-500/30 text-blue-200"
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            <span className="px-2 py-0.5 rounded-md bg-white/10 font-bold uppercase text-[10px]">
              {announcement.badge || "NOTICE"}
            </span>
            <span>{announcement.text}</span>
          </div>

          {announcement.link && (
            <a
              href={announcement.link}
              className="font-bold underline underline-offset-2 shrink-0 hover:text-white transition-colors"
            >
              Check Now &rarr;
            </a>
          )}
        </div>
      )}

      {/* Dynamic Sections Rendered in Admin-Configured Order */}
      {activeSections.map((section) => {
        switch (section.id) {
          case "spotlight":
            return (
              <SpotlightSwiper
                key="spotlight"
                spotlights={slimSpotlights.slice(0, section.limit || 8)}
              />
            );

          case "running":
            return (
              <div key="running" className="my-6">
                <ContentRail
                  id="running"
                  title={section.title || "⚡ Airing Now (Running Anime)"}
                  subtitle={section.subtitle}
                  animeList={slimRunning.slice(0, section.limit || 18)}
                  viewAllHref="/search?filter=running"
                />
              </div>
            );

          case "continue_watching":
            return <ContinueWatchingSection key="continue_watching" />;

          case "action":
            return (
              <ContentRail
                key="action"
                id="action"
                title={section.title || "⚔️ Action Anime"}
                subtitle={section.subtitle}
                animeList={slimAction.slice(0, section.limit || 18)}
                viewAllHref="/search?genre=Action"
              />
            );

          case "isekai":
            return (
              <ContentRail
                key="isekai"
                id="isekai"
                title={section.title || "🌀 Isekai & Fantasy Anime"}
                subtitle={section.subtitle}
                animeList={slimIsekai.slice(0, section.limit || 18)}
                viewAllHref="/search?genre=Fantasy"
              />
            );

          case "romance":
            return (
              <ContentRail
                key="romance"
                id="romance"
                title={section.title || "💖 Romance Anime"}
                subtitle={section.subtitle}
                animeList={slimRomance.slice(0, section.limit || 18)}
                viewAllHref="/search?genre=Romance"
              />
            );

          case "latest_episodes":
            return <LatestAnimesSection key="latest_episodes" allAnime={slimAll} />;

          case "top_10":
            return (
              <TopAnimesWidget
                key="top_10"
                topAnime={slimSpotlights.slice(0, section.limit || 10)}
              />
            );

          case "app_promo":
            return <FloatingAppPromo key="app_promo" />;

          default:
            return null;
        }
      })}
    </div>
  );
}
