import React from "react";

export default function AnimeDetailLoading() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 animate-pulse">
      {/* Back button skeleton */}
      <div className="h-5 w-28 rounded bg-white/10 mb-6" />

      {/* Main detail card */}
      <div className="flex flex-col md:flex-row gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5 mb-8">
        <div className="w-full md:w-64 aspect-[2/3] rounded-2xl bg-white/[0.06] shrink-0" />
        <div className="flex-1 space-y-4 py-2">
          <div className="h-8 w-3/4 rounded bg-white/10" />
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded bg-blue-600/30" />
            <div className="h-6 w-16 rounded bg-white/10" />
            <div className="h-6 w-24 rounded bg-white/10" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3.5 w-full rounded bg-white/5" />
            <div className="h-3.5 w-5/6 rounded bg-white/5" />
            <div className="h-3.5 w-4/6 rounded bg-white/5" />
          </div>
          <div className="flex gap-3 pt-4">
            <div className="h-12 w-44 rounded-xl bg-blue-600/40" />
            <div className="h-12 w-36 rounded-xl bg-white/10" />
          </div>
        </div>
      </div>

      {/* Episodes grid skeleton */}
      <div className="h-6 w-36 rounded bg-white/10 mb-4" />
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="h-10 rounded-xl bg-white/[0.04] border border-white/5" />
        ))}
      </div>
    </div>
  );
}
