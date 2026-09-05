import React from "react";
import { Metadata } from "next";
import { isAdminAuthenticated } from "@/lib/auth";
import { loadSiteConfig } from "@/lib/config";
import { fetchAllAnime } from "@/lib/data";
import AdminLogin from "./AdminLogin";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin Dashboard - KaiAnime",
  description: "Administrative control center for KaiAnime streaming platform.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    return <AdminLogin />;
  }

  const config = await loadSiteConfig(true);
  const allAnime = await fetchAllAnime();

  // Create lightweight summary to avoid transmitting huge episode payloads
  const slimList = allAnime.map((a) => ({
    id: a.id,
    originalId: a.originalId,
    title: a.title,
    poster: a.poster,
    status: a.status,
    rating: a.rating,
    genres: a.genres || [],
  }));

  return <AdminClient initialConfig={config} allAnime={slimList} />;
}
