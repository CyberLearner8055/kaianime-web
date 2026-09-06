"use client";

import { useState, useEffect } from "react";

export interface WatchlistItem {
  id: string;
  title: string;
  poster: string;
  rating?: number;
  episodesCount?: number;
  genres?: string[];
  type?: string;
  year?: string | number;
  addedAt: number;
}

const STORAGE_KEY = "kaianime_watchlist";
const EVENT_NAME = "kaianime_watchlist_updated";

export function getWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

export function isInWatchlist(id: string): boolean {
  if (!id) return false;
  const list = getWatchlist();
  return list.some((item) => item.id === id);
}

export function addToWatchlist(item: Omit<WatchlistItem, "addedAt">): void {
  if (typeof window === "undefined" || !item.id) return;
  try {
    const list = getWatchlist().filter((i) => i.id !== item.id);
    const newItem: WatchlistItem = {
      ...item,
      addedAt: Date.now(),
    };
    list.unshift(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (_) {}
}

export function removeFromWatchlist(id: string): void {
  if (typeof window === "undefined" || !id) return;
  try {
    const list = getWatchlist().filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (_) {}
}

export function toggleWatchlist(item: Omit<WatchlistItem, "addedAt">): boolean {
  if (isInWatchlist(item.id)) {
    removeFromWatchlist(item.id);
    return false;
  } else {
    addToWatchlist(item);
    return true;
  }
}

export function clearWatchlist(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (_) {}
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setWatchlist(getWatchlist());
    setIsLoaded(true);

    const handleUpdate = () => {
      setWatchlist(getWatchlist());
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    watchlist,
    isLoaded,
    count: watchlist.length,
    isInWatchlist: (id: string) => watchlist.some((i) => i.id === id),
    add: addToWatchlist,
    remove: removeFromWatchlist,
    toggle: toggleWatchlist,
    clear: clearWatchlist,
  };
}
