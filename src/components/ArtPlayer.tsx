"use client";

import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import { SubtitleTrack } from "@/lib/types";

interface ArtPlayerProps {
  url: string;
  subtitles?: SubtitleTrack[];
  poster?: string;
  title?: string;
  initialTime?: number;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  className?: string;
}

export default function ArtPlayer({
  url,
  subtitles = [],
  poster,
  title,
  initialTime,
  onTimeUpdate,
  onEnded,
  className = "",
}: ArtPlayerProps) {
  const artContainerRef = useRef<HTMLDivElement>(null);
  const artInstanceRef = useRef<any>(null);
  const hlsInstanceRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!artContainerRef.current || !url) return;

    let art: any = null;
    let isDestroyed = false;
    let currentAspectRatio: "fit" | "fill" | "16:9" | "stretch" = "fit";
    let activeSubLabel: string = "Off";

    // 1. Aspect Ratio Control Handler
    const setAspectRatio = (artRef: any, mode: "fit" | "fill" | "16:9" | "stretch") => {
      currentAspectRatio = mode || "fit";
      const video = artRef && artRef.template ? artRef.template.$video : null;
      let text = "Fit to Screen";
      let shortLabel = "FIT";

      if (currentAspectRatio === "fill") {
        if (video) {
          video.style.objectFit = "cover";
          video.style.width = "100%";
          video.style.height = "100%";
        }
        if (artRef) artRef.aspectRatio = "default";
        text = "Zoom to Fill (No Bars)";
        shortLabel = "FILL";
      } else if (currentAspectRatio === "16:9") {
        if (video) {
          video.style.objectFit = "contain";
        }
        if (artRef) artRef.aspectRatio = "16:9";
        text = "16:9 Widescreen";
        shortLabel = "16:9";
      } else if (currentAspectRatio === "stretch") {
        if (video) {
          video.style.objectFit = "fill";
          video.style.width = "100%";
          video.style.height = "100%";
        }
        if (artRef) artRef.aspectRatio = "default";
        text = "Stretch to Screen";
        shortLabel = "STRETCH";
      } else {
        currentAspectRatio = "fit";
        if (video) {
          video.style.objectFit = "contain";
          video.style.width = "100%";
          video.style.height = "100%";
        }
        if (artRef) artRef.aspectRatio = "default";
        text = "Fit to Screen";
        shortLabel = "FIT";
      }

      // Update control button in bottom bar
      updateAspectControlBtn(artRef, shortLabel);

      // Update setting panel tooltip
      try {
        artRef.setting.update({
          name: "aspect-ratio-setting",
          tooltip: shortLabel,
        });
      } catch (_) {}

      artRef.notice.show = `Aspect: ${text}`;
    };

    const updateAspectControlBtn = (artRef: any, label: string) => {
      if (!artRef || !artRef.controls) return;
      try {
        artRef.controls.update({
          name: "aspect-ratio-btn",
          position: "right",
          index: 12,
          html: `<span style="font-weight:800;font-size:10px;letter-spacing:0.4px;padding:2px 5px;border:1.4px solid currentColor;border-radius:4px;display:inline-block;line-height:1.1;">${label}</span>`,
          tooltip: `Aspect: ${label}`,
          click: function () {
            let nextMode: "fit" | "fill" | "16:9" | "stretch" = "fit";
            if (currentAspectRatio === "fit") nextMode = "fill";
            else if (currentAspectRatio === "fill") nextMode = "16:9";
            else if (currentAspectRatio === "16:9") nextMode = "stretch";
            else nextMode = "fit";
            setAspectRatio(artRef, nextMode);
          },
        });
      } catch (_) {}
    };

    // 2. Audio Control & Auto Hindi Selector (Anime Drive App player parity)
    const setupAudioSetting = (artRef: any, hls: Hls) => {
      const tracks = hls.audioTracks;
      if (!tracks || tracks.length === 0) return;

      let selectedIdx = hls.audioTrack;

      // Auto-select Hindi audio track on initial load
      if (selectedIdx === -1 || selectedIdx === 0) {
        const targetIdx = tracks.findIndex((t: any) => {
          const label = ((t.name || "") + " " + (t.lang || "")).toLowerCase();
          return label.includes("hin") || label.includes("hindi");
        });
        if (targetIdx !== -1) {
          hls.audioTrack = targetIdx;
          selectedIdx = targetIdx;
          artRef.notice.show = "Audio: Hindi Dub (Auto-Selected)";
        }
      }

      const selectorItems = tracks.map((track: any, index: number) => {
        const rawName = track.name || track.lang || `Track ${index + 1}`;
        const isHin =
          rawName.toLowerCase().includes("hin") ||
          (track.lang && track.lang.toLowerCase().includes("hin"));
        const displayName = isHin ? "🇮🇳 Hindi Dub" : rawName;
        return {
          default: index === selectedIdx,
          html: displayName,
          value: index,
        };
      });

      const currentTrack = tracks[selectedIdx];
      const currentRawName = currentTrack
        ? currentTrack.name || currentTrack.lang || "Audio"
        : "Audio";
      const isCurrentHin =
        currentRawName.toLowerCase().includes("hin") ||
        (currentTrack &&
          currentTrack.lang &&
          currentTrack.lang.toLowerCase().includes("hin"));
      const currentLabel = isCurrentHin ? "Hindi Dub" : currentRawName;

      // Add to Gear / Settings Panel
      try {
        artRef.setting.update({
          name: "audio-tracks",
          width: 200,
          html: "Audio Track",
          tooltip: currentLabel,
          selector: selectorItems,
          onSelect: function (item: any) {
            hls.audioTrack = item.value;
            artRef.setting.update({
              name: "audio-tracks",
              tooltip: item.html,
            });
            updateAudioControlBtn(artRef, hls);
            artRef.notice.show = `Audio: ${item.html}`;
            return item.html;
          },
        });
      } catch (_) {}

      // Add / Update 1-tap Button on Bottom Control Bar
      updateAudioControlBtn(artRef, hls);
    };

    const updateAudioControlBtn = (artRef: any, hls: Hls) => {
      if (!artRef || !hls || !hls.audioTracks || hls.audioTracks.length === 0) return;
      const tracks = hls.audioTracks;
      const currentIdx = hls.audioTrack >= 0 ? hls.audioTrack : 0;
      const currentTrack = tracks[currentIdx];
      const rawName = currentTrack
        ? currentTrack.name || currentTrack.lang || "Audio"
        : "Audio";
      const isHin =
        rawName.toLowerCase().includes("hin") ||
        (currentTrack &&
          currentTrack.lang &&
          currentTrack.lang.toLowerCase().includes("hin"));
      const badgeLabel = isHin ? "HIN" : "AUDIO";

      const btnHtml = `<span style="font-weight:800;font-size:10px;letter-spacing:0.5px;padding:2px 6px;border:1.4px solid currentColor;border-radius:4px;display:inline-block;line-height:1.1;${
        isHin ? "color:#2563eb;border-color:#2563eb;" : ""
      }">${badgeLabel}</span>`;

      try {
        artRef.controls.update({
          name: "audio-track-btn",
          position: "right",
          index: 11,
          html: btnHtml,
          tooltip: `Audio: ${isHin ? "Hindi Dub" : rawName}`,
          click: function () {
            if (tracks.length <= 1) {
              artRef.notice.show = "Single audio stream";
              return;
            }
            const nextIdx = (hls.audioTrack + 1) % tracks.length;
            hls.audioTrack = nextIdx;
            const nextTrack = tracks[nextIdx];
            const nextRawName = nextTrack
              ? nextTrack.name || nextTrack.lang || `Track ${nextIdx + 1}`
              : `Track ${nextIdx + 1}`;
            const nextIsHin =
              nextRawName.toLowerCase().includes("hin") ||
              (nextTrack &&
                nextTrack.lang &&
                nextTrack.lang.toLowerCase().includes("hin"));
            const nextLabel = nextIsHin ? "Hindi Dub" : nextRawName;

            artRef.setting.update({
              name: "audio-tracks",
              tooltip: nextLabel,
            });
            updateAudioControlBtn(artRef, hls);
            artRef.notice.show = `Audio: ${nextLabel}`;
          },
        });
      } catch (_) {}
    };

    // 3. Quality Selector (Anime Drive App player parity)
    const setupQualitySetting = (artRef: any, hls: Hls) => {
      const levels = hls.levels;
      if (!levels || levels.length === 0) return;

      const selectorItems: any[] = [
        {
          default: hls.currentLevel === -1,
          html: "Auto",
          value: -1,
        },
      ];

      levels.forEach((level: any, index: number) => {
        const res = level.height
          ? `${level.height}p`
          : level.name || `Level ${index + 1}`;
        selectorItems.push({
          default: hls.currentLevel === index,
          html: res,
          value: index,
        });
      });

      const activeLevel =
        hls.currentLevel === -1 ? null : levels[hls.currentLevel];
      const activeLabel = activeLevel
        ? activeLevel.height
          ? `${activeLevel.height}p`
          : activeLevel.name || "Custom"
        : "Auto";

      try {
        artRef.setting.update({
          name: "video-quality",
          width: 160,
          html: "Quality",
          tooltip: activeLabel,
          selector: selectorItems,
          onSelect: function (item: any) {
            hls.currentLevel = item.value;
            artRef.setting.update({
              name: "video-quality",
              tooltip: item.html,
            });
            artRef.notice.show = `Quality: ${item.html}`;
            return item.html;
          },
        });
      } catch (_) {}
    };

    // 4. Subtitle Selector & 1-tap [CC] Toggle Button (Anime Drive App player parity)
    const setupSubtitleSetting = (
      artRef: any,
      hls: Hls,
      extSubtitles: SubtitleTrack[]
    ) => {
      const hlsTracks = hls && hls.subtitleTracks ? hls.subtitleTracks : [];

      const defaultSub =
        extSubtitles.find(
          (s) => s.default || s.label.toLowerCase().includes("eng")
        ) || extSubtitles[0];

      activeSubLabel = defaultSub ? defaultSub.label : "Off";

      const selectorItems: any[] = [
        {
          default: activeSubLabel === "Off",
          html: "Off",
          value: -1,
          isExternal: false,
        },
      ];

      if (extSubtitles && extSubtitles.length > 0) {
        extSubtitles.forEach((track, index) => {
          const label = track.label || `Subtitle ${index + 1}`;
          selectorItems.push({
            default: activeSubLabel === label,
            html: label,
            value: index,
            isExternal: true,
            file: track.file,
          });
        });
      }

      if (hlsTracks && hlsTracks.length > 0) {
        hlsTracks.forEach((track: any, index: number) => {
          const trackName = track.name || track.lang || `HLS Sub ${index + 1}`;
          selectorItems.push({
            default: activeSubLabel === trackName,
            html: trackName,
            value: index,
            isExternal: false,
          });
        });
      }

      // Add to Settings Panel
      try {
        artRef.setting.update({
          name: "subtitle-tracks",
          width: 200,
          html: "Subtitles (CC)",
          tooltip: activeSubLabel,
          selector: selectorItems,
          onSelect: function (item: any) {
            if (item.value === -1) {
              if (artRef.subtitle) artRef.subtitle.show = false;
              activeSubLabel = "Off";
              artRef.notice.show = "Subtitles: Off";
            } else if (item.isExternal && item.file) {
              if (artRef.subtitle) {
                artRef.subtitle.show = true;
                artRef.subtitle.switch(item.file, { name: item.html });
              }
              activeSubLabel = item.html;
              artRef.notice.show = `Subtitles: ${item.html}`;
            } else if (hls && hls.subtitleTracks) {
              hls.subtitleTrack = item.value;
              activeSubLabel = item.html;
              artRef.notice.show = `Subtitles: ${item.html}`;
            }
            artRef.setting.update({
              name: "subtitle-tracks",
              tooltip: activeSubLabel,
            });
            updateSubtitleControlBtn(artRef, activeSubLabel, extSubtitles);
            return item.html;
          },
        });
      } catch (_) {}

      // Add / Update 1-tap [CC] Button on Bottom Control Bar
      updateSubtitleControlBtn(artRef, activeSubLabel, extSubtitles);

      // Auto-enable first subtitle if available
      if (defaultSub && defaultSub.file && artRef.subtitle) {
        artRef.subtitle.show = true;
        artRef.subtitle.switch(defaultSub.file, { name: defaultSub.label });
      }
    };

    const updateSubtitleControlBtn = (
      artRef: any,
      label: string,
      extSubtitles: SubtitleTrack[]
    ) => {
      if (!artRef || !artRef.controls) return;
      const hasSubActive = label !== "Off";
      const ccHtml = `<span style="font-weight:800;font-size:10px;letter-spacing:0.5px;padding:2px 6px;border:1.4px solid currentColor;border-radius:4px;display:inline-block;line-height:1.1;${
        hasSubActive ? "color:#2563eb;border-color:#2563eb;" : ""
      }">CC</span>`;

      try {
        artRef.controls.update({
          name: "subtitle-cc-btn",
          position: "right",
          index: 10,
          html: ccHtml,
          tooltip: `Subtitles: ${label}`,
          click: function () {
            if (hasSubActive) {
              if (artRef.subtitle) artRef.subtitle.show = false;
              activeSubLabel = "Off";
              artRef.notice.show = "Subtitles: Off";
            } else if (extSubtitles && extSubtitles.length > 0) {
              const first = extSubtitles[0];
              if (artRef.subtitle) {
                artRef.subtitle.show = true;
                artRef.subtitle.switch(first.file, { name: first.label });
              }
              activeSubLabel = first.label;
              artRef.notice.show = `Subtitles: ${first.label}`;
            } else if (artRef.setting) {
              artRef.setting.show = true;
              return;
            }
            artRef.setting.update({
              name: "subtitle-tracks",
              tooltip: activeSubLabel,
            });
            updateSubtitleControlBtn(artRef, activeSubLabel, extSubtitles);
          },
        });
      } catch (_) {}
    };

    // Dynamically import Artplayer for 100% clean SSR
    import("artplayer").then(({ default: Artplayer }) => {
      if (isDestroyed || !artContainerRef.current) return;

      const defaultSub =
        subtitles.find(
          (s) => s.default || s.label.toLowerCase().includes("eng")
        ) || subtitles[0];

      const artOptions: any = {
        container: artContainerRef.current,
        url: url,
        type: "m3u8",
        poster: poster || "",
        title: title || "",
        volume: 0.95,
        isLive: false,
        muted: false,
        autoplay: false,
        pip: true,
        autoSize: false,
        autoMini: false,
        screenshot: true,
        setting: true,
        loop: false,
        flip: true,
        playbackRate: true,
        aspectRatio: false, // Controlled via in-player button & setting
        fullscreen: true,
        fullscreenWeb: false,
        miniProgressBar: true,
        mutex: true,
        backdrop: true,
        playsInline: true,
        autoPlayback: true,
        airplay: true,
        theme: "#2563eb",
        lang: "en",
        hotkey: true,
        moreVideoAttr: {
          crossOrigin: "anonymous",
          playsInline: "true",
          "webkit-playsinline": "true",
        },
        customType: {
          m3u8: function (video: HTMLVideoElement, streamUrl: string, artRef: any) {
            if (Hls.isSupported()) {
              if (artRef.hls) {
                try {
                  artRef.hls.destroy();
                } catch (_) {}
              }
              const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
                backBufferLength: 90,
                maxBufferLength: 30,
              });

              hls.loadSource(streamUrl);
              hls.attachMedia(video);
              hlsInstanceRef.current = hls;

              const syncAllTracks = () => {
                setupAudioSetting(artRef, hls);
                setupQualitySetting(artRef, hls);
                setupSubtitleSetting(artRef, hls, subtitles);
              };

              hls.on(Hls.Events.MANIFEST_PARSED, function () {
                artRef.notice.show = "Stream Ready • 0-Ads M3U8";
                syncAllTracks();
              });

              hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, function () {
                setupAudioSetting(artRef, hls);
              });

              hls.on(Hls.Events.LEVELS_UPDATED, function () {
                setupQualitySetting(artRef, hls);
              });

              hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, function () {
                setupSubtitleSetting(artRef, hls, subtitles);
              });

              hls.on(Hls.Events.ERROR, function (event: any, data: any) {
                if (data.fatal) {
                  switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                      hls.startLoad();
                      break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                      hls.recoverMediaError();
                      break;
                    default:
                      try {
                        hls.destroy();
                      } catch (_) {}
                      artRef.notice.show = "Playback error, please switch server";
                      break;
                  }
                }
              });

              artRef.hls = hls;
              artRef.on("destroy", () => {
                try {
                  hls.destroy();
                } catch (_) {}
              });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
              video.src = streamUrl;
            }
          },
        },
        controls: [
          // Rewind 10s
          {
            name: "rewind-10",
            position: "left",
            index: 10,
            html: `<button class="p-1 hover:text-blue-400 transition-colors" title="Rewind 10s">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg>
            </button>`,
            click: function (artRef: any) {
              artRef.currentTime = Math.max(0, artRef.currentTime - 10);
              artRef.notice.show = "−10s";
            },
          },
          // Forward 10s
          {
            name: "forward-10",
            position: "left",
            index: 11,
            html: `<button class="p-1 hover:text-blue-400 transition-colors" title="Forward 10s">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>
            </button>`,
            click: function (artRef: any) {
              artRef.currentTime = Math.min(
                artRef.duration || 0,
                artRef.currentTime + 10
              );
              artRef.notice.show = "+10s";
            },
          },
          // Dedicated Fullscreen Button (Guaranteed on Mobile & Desktop)
          {
            name: "fullscreen-toggle",
            position: "right",
            index: 99,
            html: `<button class="p-1.5 hover:text-blue-400 transition-colors flex items-center justify-center text-white" title="Fullscreen" aria-label="Fullscreen">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            </button>`,
            click: function (artRef: any) {
              const video = artRef.template?.$video;
              if (artRef.fullscreen) {
                artRef.fullscreen = false;
              } else {
                if (
                  video &&
                  video.webkitEnterFullscreen &&
                  typeof video.webkitEnterFullscreen === "function" &&
                  !document.fullscreenEnabled
                ) {
                  video.webkitEnterFullscreen();
                } else {
                  artRef.fullscreen = true;
                }
              }
            },
          },
        ],
      };

      // Set initial subtitle only if url is non-empty (schema validator safety)
      if (defaultSub && defaultSub.file) {
        artOptions.subtitle = {
          url: defaultSub.file,
          type: "vtt",
          encoding: "utf-8",
          escape: false,
          style: {
            color: "#ffffff",
            fontSize: "20px",
          },
        };
      }

      art = new Artplayer(artOptions);

      // Aspect Ratio Settings Panel item
      art.setting.add({
        name: "aspect-ratio-setting",
        width: 190,
        html: "Aspect Ratio",
        tooltip: "FIT",
        selector: [
          { default: true, html: "Fit (Original)", value: "fit" },
          { default: false, html: "Zoom to Fill (No Bars)", value: "fill" },
          { default: false, html: "16:9 Widescreen", value: "16:9" },
          { default: false, html: "Stretch", value: "stretch" },
        ],
        onSelect: function (item: any) {
          setAspectRatio(art, item.value);
          return item.html;
        },
      });

      // Aspect Ratio 1-tap Button on Bottom Control Bar
      updateAspectControlBtn(art, "FIT");

      // Auto-Resume playback from saved position
      if (initialTime && initialTime > 5) {
        let hasResumed = false;
        const triggerResume = () => {
          if (hasResumed) return;
          try {
            if (art.currentTime < 5) {
              art.currentTime = initialTime;
              hasResumed = true;
              const mins = Math.floor(initialTime / 60);
              const secs = Math.floor(initialTime % 60);
              art.notice.show = `Resumed from ${mins}:${secs < 10 ? "0" : ""}${secs}`;
            }
          } catch (_) {}
        };
        art.on("ready", triggerResume);
        art.on("video:canplay", triggerResume);
      }

      // Track playback progress
      let lastProgressReport = 0;
      art.on("video:timeupdate", () => {
        const now = Date.now();
        if (now - lastProgressReport > 3000) {
          lastProgressReport = now;
          if (onTimeUpdate && art.duration > 0 && art.currentTime > 2) {
            onTimeUpdate(art.currentTime, art.duration);
          }
        }
      });

      // Handle video ended
      art.on("video:ended", () => {
        if (onEnded) onEnded();
      });

      // Desktop Double-Click / Touch Seek Gestures
      let lastTapTime = 0;
      let lastTapX = 0;

      const handleTouchEnd = (e: TouchEvent) => {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.closest(".art-bottom") ||
            target.closest(".art-setting") ||
            target.closest(".art-layer-top"))
        ) {
          return;
        }
        const touch = e.changedTouches && e.changedTouches[0];
        if (!touch) return;
        const now = Date.now();
        const delta = now - lastTapTime;
        const x = touch.clientX;
        const rect = artContainerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const relX = x - rect.left;
        const width = rect.width;

        if (delta > 50 && delta < 350 && Math.abs(x - lastTapX) < 80) {
          if (relX < width * 0.4) {
            art.currentTime = Math.max(0, art.currentTime - 10);
            art.notice.show = "−10s";
            e.preventDefault();
          } else if (relX > width * 0.6) {
            art.currentTime = Math.min(art.duration || 0, art.currentTime + 10);
            art.notice.show = "+10s";
            e.preventDefault();
          }
          lastTapTime = 0;
        } else {
          lastTapTime = now;
          lastTapX = x;
        }
      };

      const container = artContainerRef.current;
      container.addEventListener("touchend", handleTouchEnd, { passive: false });

      art.on("destroy", () => {
        container.removeEventListener("touchend", handleTouchEnd);
      });

      artInstanceRef.current = art;
    });

    return () => {
      isDestroyed = true;
      if (artInstanceRef.current) {
        try {
          artInstanceRef.current.destroy(false);
        } catch (_) {}
        artInstanceRef.current = null;
      }
    };
  }, [url]);

  return (
    <div className={`w-full h-full ${className}`}>
      <div ref={artContainerRef} className="w-full h-full" />
    </div>
  );
}
