import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://kaianime.site"),
  title: {
    default: "KaiAnime - Watch Anime Online in Ultra HD | 100% Ad-Free",
    template: "%s | KaiAnime.site",
  },
  description:
    "Stream your favorite anime series and movies online in Ultra HD with Hindi Dub and English Subtitles. 100% free with 100% ad-free streaming, zero popups, and direct high-speed video playback.",
  keywords: [
    "watch anime online",
    "anime hindi dub",
    "free anime streaming",
    "kaianime",
    "anime drive",
    "no ads anime",
    "anime hd subbed",
    "hindi dubbed anime stream",
    "watch solo leveling hindi",
    "watch jujutsu kaisen hindi",
  ],
  authors: [{ name: "Anime Drive Network", url: "https://animedrive.me" }],
  creator: "Anime Drive",
  publisher: "KaiAnime.site",
  openGraph: {
    title: "KaiAnime - Watch Anime Online in Ultra HD (100% Ad-Free)",
    description:
      "Watch latest anime episodes in Full HD with multi-audio Hindi dub and English subtitles. 100% ad-free, zero popups, lightning-fast streaming.",
    url: "https://kaianime.site",
    siteName: "KaiAnime.site",
    images: [
      {
        url: "https://animedrive.me/wp-content/uploads/2024/09/cropped-anime-drive-logo.png",
        width: 1200,
        height: 630,
        alt: "KaiAnime Streaming Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KaiAnime - Watch Anime Online in Ultra HD (100% Ad-Free)",
    description: "Stream anime in 1080p HD with Hindi Dub and English Subtitles. 100% Ad-Free.",
    images: ["https://animedrive.me/wp-content/uploads/2024/09/cropped-anime-drive-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#050608",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#050608] text-slate-100 antialiased selection:bg-blue-600 selection:text-white flex flex-col">
        <AppLayoutWrapper>{children}</AppLayoutWrapper>
      </body>
    </html>
  );
}
