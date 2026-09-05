"use client";

import React from "react";
import { usePathname } from "next/navigation";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";

interface AppLayoutWrapperProps {
  children: React.ReactNode;
}

export default function AppLayoutWrapper({ children }: AppLayoutWrapperProps) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#050608] text-white flex flex-col font-sans">
      <MainHeader />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
