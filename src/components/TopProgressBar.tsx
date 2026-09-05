"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlKey = `${pathname}?${searchParams?.toString() || ""}`;
  const prevUrlRef = useRef(urlKey);

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  // Store active timer IDs to prevent race conditions
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  const done = useCallback(() => {
    clearAllTimers();
    setIsFinishing(true);
    setProgress(100);

    // After reaching 100%, fade out and reset to idle
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setProgress(0);
      setIsFinishing(false);
    }, 300);

    timersRef.current.push(hideTimer);
  }, [clearAllTimers]);

  const start = useCallback(() => {
    clearAllTimers();
    setIsFinishing(false);
    setVisible(true);
    setProgress(25);

    // Smooth incremental crawl
    const t1 = setTimeout(() => setProgress(55), 120);
    const t2 = setTimeout(() => setProgress(75), 300);
    const t3 = setTimeout(() => setProgress(88), 600);

    // Bulletproof safety timeout: if navigation is already done or URL didn't change, auto-finish!
    const tSafety = setTimeout(() => {
      done();
    }, 2000);

    timersRef.current.push(t1, t2, t3, tSafety);
  }, [clearAllTimers, done]);

  // When pathname or searchParams change, finish immediately!
  useEffect(() => {
    if (prevUrlRef.current !== urlKey) {
      prevUrlRef.current = urlKey;
      done();
    }
  }, [urlKey, done]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => done();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [done]);

  // Intercept internal link clicks for 0ms instant feedback
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");

      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("//") &&
        targetAttr !== "_blank" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        const currentPath = window.location.pathname;
        const currentFull = currentPath + window.location.search;

        // Skip if clicking the same page
        if (href === currentFull || href === currentPath) {
          return;
        }

        start();
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
    };
  }, [start]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[3px] bg-transparent overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 shadow-[0_0_12px_#38bdf8,0_0_6px_#3b82f6]"
        style={{
          width: `${progress}%`,
          opacity: isFinishing ? 0 : 1,
          transition: isFinishing
            ? "width 200ms ease-out, opacity 300ms ease-out"
            : "width 250ms ease-out, opacity 150ms ease-in",
        }}
      />
    </div>
  );
}
