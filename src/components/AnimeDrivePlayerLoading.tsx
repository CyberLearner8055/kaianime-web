"use client";

import React from "react";

interface AnimeDrivePlayerLoadingProps {
  className?: string;
}

export default function AnimeDrivePlayerLoading({ className = "" }: AnimeDrivePlayerLoadingProps) {
  return (
    <div className={`ad-loading-overlay ${className}`}>
      <div className="ad-ambient-glow" />
      <div className="ad-stage">
        {/* Scene 1: KaiAnime Logo X Anime Drive Logo + Core Features */}
        <div className="ad-scene ad-scene-1">
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-3.5 px-2">
            {/* KaiAnime Logo */}
            <div className="h-8 sm:h-10 flex items-center justify-center filter drop-shadow-[0_8px_20px_rgba(59,130,246,0.35)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="KaiAnime"
                className="h-full w-auto object-contain max-w-[110px] sm:max-w-[145px]"
              />
            </div>

            {/* Stylish "X" Partnership Divider */}
            <span className="text-blue-400/80 font-black text-xs sm:text-sm select-none">✕</span>

            {/* Anime Drive Logo */}
            <div className="h-8 sm:h-10 flex items-center justify-center filter drop-shadow-[0_8px_20px_rgba(59,130,246,0.35)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/animedrive-logo.png"
                alt="Anime Drive"
                onError={(e: any) => {
                  e.currentTarget.src = "https://animedrive.me/wp-content/uploads/2024/09/cropped-anime-drive-logo.png";
                }}
                className="h-full w-auto object-contain max-w-[110px] sm:max-w-[145px]"
              />
            </div>
          </div>

          <div className="ad-features">
            <span>Zero Ads</span>
            <span className="ad-dot">•</span>
            <span>1080p Ultra HD</span>
            <span className="ad-dot">•</span>
            <span>High-Speed</span>
          </div>
        </div>

        {/* Scene 2: Headline + Tagline */}
        <div className="ad-scene ad-scene-2">
          <div className="ad-headline">
            Connecting to <span>KaiAnime &times; Anime Drive</span> Stream...
          </div>
          <div className="ad-cta-button">
            <span>100% Ad-Free Network</span>
            <span className="ad-arrow">✦</span>
          </div>
        </div>

        {/* Timeline Indicator */}
        <div className="ad-timeline">
          <div className="ad-timeline-bar" />
        </div>
      </div>
    </div>
  );
}