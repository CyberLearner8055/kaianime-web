import React from "react";
import { Metadata } from "next";
import LandingClient from "./LandingClient";
import { getAllAnime, toSlimAnime } from "@/lib/data";

export const metadata: Metadata = {
  title: "KaiAnime - Watch & Download Hindi Dubbed Anime For Free",
  description:
    "Explore the largest library of high-quality Anime, Movies in Hindi Dub, Tamil, Telugu & Regional Audio with 100% Ad-Free streaming.",
  alternates: {
    canonical: "https://kaianime.site/",
  },
};

export default async function LandingPage() {
  const allAnime = await getAllAnime();
  const slimList = allAnime.map(toSlimAnime);

  return <LandingClient animeList={slimList} />;
}
