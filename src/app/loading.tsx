import React from "react";

export default function GlobalLoading() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 animate-pulse">
      {/* Hero Spotlight Skeleton */}
      <div className="w-full h-[220px] sm:h-[260px] md:h-[290px] rounded-2xl bg-white/[0.03] border border-white/5 relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent skeleton-shimmer" />
        <div className="absolute bottom-6 left-6 max-w-md space-y-3">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-7 w-64 rounded bg-white/10" />
          <div className="h-3 w-80 rounded bg-white/5" />
          <div className="h-9 w-32 rounded-xl bg-blue-600/30" />
        </div>
      </div>

      {/* Rail 1 Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-white/10" />
          <div className="h-3 w-64 rounded bg-white/5" />
        </div>
        <div className="h-4 w-16 rounded bg-white/5" />
      </div>

      {/* Rail 1 Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden"
          >
            <div className="aspect-[2/3] w-full bg-white/[0.05]" />
            <div className="p-2.5 space-y-2">
              <div className="h-3.5 w-3/4 rounded bg-white/10" />
              <div className="h-2.5 w-1/2 rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>

      {/* Rail 2 Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-40 rounded bg-white/10" />
        <div className="h-4 w-16 rounded bg-white/5" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden"
          >
            <div className="aspect-[2/3] w-full bg-white/[0.05]" />
            <div className="p-2.5 space-y-2">
              <div className="h-3.5 w-3/4 rounded bg-white/10" />
              <div className="h-2.5 w-1/2 rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
