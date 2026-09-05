"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Smartphone } from "lucide-react";

export default function FloatingAppPromo() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("kaianime_app_dismissed");
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    sessionStorage.setItem("kaianime_app_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-40 max-w-sm">
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#090d16]/95 border border-blue-500/30 shadow-2xl backdrop-blur-xl">
        <Link href="/download" className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-blue-600/30">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-xs text-white truncate">
              Get Anime Drive App
            </p>
            <p className="text-[10px] text-blue-300 truncate">
              100% Ad-Free • Android Only
            </p>
          </div>
        </Link>
        <button
          onClick={handleDismiss}
          className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
          aria-label="Dismiss app promo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
