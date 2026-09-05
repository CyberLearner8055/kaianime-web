import React from "react";
import { Metadata } from "next";
import { getSiteConfig } from "@/lib/config";
import DownloadClient from "./DownloadClient";

export const metadata: Metadata = {
  title: "Download Anime Drive App APK v2.1 (Official) - 100% Ad-Free Streaming",
  description:
    "Download official Anime Drive Android APK v2.1. Enjoy 100% zero-ad anime streaming in Hindi, Tamil, Telugu and English with high-speed CDN playback and offline downloads.",
  alternates: {
    canonical: "https://kaianime.site/download",
  },
  openGraph: {
    title: "Download Anime Drive App APK v2.1 - 100% Ad-Free Anime",
    description:
      "Official Android APK for Anime Drive. Watch Hindi Dubbed anime with zero ads, multi-audio tracks, and 1080p Full HD.",
    images: ["/logo.png"],
  },
};

export default function DownloadPage() {
  const siteConfig = getSiteConfig();

  const apkUrl =
    siteConfig.links?.apkDownloadUrl ||
    "https://github.com/CyberLearner8055/animedrive-config/releases/download/V2.1/Anime.Drive.2.1.apk";
  const animedriveUrl = siteConfig.links?.animedriveUrl || "https://animedrive.me";
  const telegramUrl = siteConfig.links?.telegramUrl || "https://t.me/animedrive";
  const whatsappUrl = siteConfig.links?.whatsappUrl || "https://whatsapp.com/channel/animedrive";
  const discordUrl = siteConfig.links?.discordUrl || "https://discord.gg/animedrive";

  return (
    <DownloadClient
      apkUrl={apkUrl}
      animedriveUrl={animedriveUrl}
      telegramUrl={telegramUrl}
      whatsappUrl={whatsappUrl}
      discordUrl={discordUrl}
    />
  );
}
