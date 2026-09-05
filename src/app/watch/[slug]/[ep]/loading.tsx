import React from "react";

export default function WatchLoading() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 animate-pulse">
      {/* Top navigation row */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="h-5 w-32 rounded bg-white/10" />
        <div className="h-5 w-48 rounded bg-white/5" />
      </div>

      {/* Video Player Skeleton (16:9) */}
      <div className="w-full aspect-video rounded-2xl bg-white/[0.04] border border-white/5 relative overflow-hidden mb-4 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center" />
      </div>

      {/* Player controls / episode switcher skeleton */}
      <div className="flex items-center justify-between gap-3 mb-6 p-3 rounded-xl bg-white/[0.02] border border-white/5">
        <div className="h-9 w-28 rounded-lg bg-white/10" />
        <div className="h-6 w-36 rounded bg-white/10" />
        <div className="h-9 w-28 rounded-lg bg-blue-600/30" />
      </div>

      {/* Episode buttons skeleton */}
      <div className="h-5 w-32 rounded bg-white/10 mb-3" />
      <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-1.5 mb-8">
        {[...Array(24)].map((_, i) => (
          <div key={i} className="h-9 rounded-lg bg-white/[0.04] border border-white/5" />
        ))}
      </div>
    </div>
  );
}
