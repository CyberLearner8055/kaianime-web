import React, { Suspense } from "react";
import type { Metadata } from "next";
import WatchlistClient from "./WatchlistClient";

export const metadata: Metadata = {
  title: "My Watchlist | KaiAnime.site",
  description:
    "View and manage your saved anime watchlist on KaiAnime.site. Stream your favorite series and movies anytime in Full HD with 0 ads.",
  alternates: {
    canonical: "https://kaianime.site/watchlist",
  },
};

export const dynamic = "force-dynamic";

export default function WatchlistPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-9 h-9 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <WatchlistClient />
    </Suspense>
  );
}
