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
        {/* Scene 1: Logo + Core Features */}
        <div className="ad-scene ad-scene-1">
          <div className="ad-logo-box">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="KaiAnime - AnimeDrive Network"
              onError={(e: any) => {
                e.currentTarget.src = "https://animedrive.me/wp-content/uploads/2024/09/cropped-anime-drive-logo.png";
              }}
            />
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
            Connecting to <span>Anime Drive</span> Stream...
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