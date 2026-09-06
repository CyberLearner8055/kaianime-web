"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import TopProgressBar from "@/components/TopProgressBar";
import WatchlistToast from "@/components/WatchlistToast";

interface AppLayoutWrapperProps {
  children: React.ReactNode;
}

export default function AppLayoutWrapper({ children }: AppLayoutWrapperProps) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isAdminPage = pathname.startsWith("/ad-admin");

  return (
    <>
      <Suspense fallback={null}>
        <TopProgressBar />
      </Suspense>
      <WatchlistToast />
      {isLandingPage || isAdminPage ? (
        children
      ) : (
        <div className="min-h-screen bg-[#050608] text-white flex flex-col font-sans">
          <MainHeader />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </div>
      )}
    </>
  );
}
