"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Mic, Layers, Smartphone } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Search",
      href: "/search",
      icon: Search,
      isActive: pathname === "/search",
    },
    {
      label: "Hindi Dub",
      href: "/search?filter=hindi",
      icon: Mic,
      isActive: pathname === "/search" && typeof window !== "undefined" && window.location.search.includes("hindi"),
    },
    {
      label: "Catalog",
      href: "/#all-anime",
      icon: Layers,
      isActive: false,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10 px-2 py-2 safe-area-bottom shadow-2xl">
      <div className="grid grid-cols-4 items-center justify-items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 w-full transition-colors active:scale-95 ${
                item.isActive ? "text-blue-500 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight leading-tight font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
