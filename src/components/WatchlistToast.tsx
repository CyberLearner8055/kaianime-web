"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowRight, X } from "lucide-react";

export default function WatchlistToast() {
  const [toast, setToast] = useState<{
    visible: boolean;
    title: string;
    action: "added" | "removed";
  }>({
    visible: false,
    title: "",
    action: "added",
  });

  useEffect(() => {
    const handleWatchlistUpdate = (e: any) => {
      if (e.detail && e.detail.action) {
        const action = e.detail.action;
        const title = e.detail.item?.title || "Anime";

        setToast({
          visible: true,
          title,
          action,
        });
      }
    };

    window.addEventListener("kaianime_watchlist_updated", handleWatchlistUpdate as EventListener);
    return () => {
      window.removeEventListener("kaianime_watchlist_updated", handleWatchlistUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  if (!toast.visible) return null;

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 animate-bounce-in max-w-sm w-full">
      <div className="p-3.5 rounded-2xl glass-panel border border-white/15 shadow-2xl bg-[#0b0f19]/95 backdrop-blur-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              toast.action === "added"
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                : "bg-slate-800 text-slate-400 border border-white/10"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                toast.action === "added" ? "fill-rose-500 text-rose-500" : ""
              }`}
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white leading-snug">
              {toast.action === "added" ? "Added to Watchlist!" : "Removed from Watchlist"}
            </p>
            <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
              {toast.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {toast.action === "added" && (
            <Link
              href="/watchlist"
              onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-600/30 transition-all active:scale-95"
            >
              <span>View</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}

          <button
            onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
