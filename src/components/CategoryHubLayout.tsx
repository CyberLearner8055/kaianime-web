import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles, HelpCircle, Film, Flame } from "lucide-react";
import { Anime } from "@/lib/types";
import AnimeCard from "@/components/AnimeCard";

export interface CategoryHubLayoutProps {
  title: string;
  subtitle: string;
  badge?: string;
  animeList: Anime[];
  currentPage: number;
  itemsPerPage?: number;
  basePath: string;
  faqs: Array<{ question: string; answer: string }>;
  seoContent: {
    heading: string;
    paragraphs: string[];
  };
  breadcrumbName: string;
}

export default function CategoryHubLayout({
  title,
  subtitle,
  badge = "India Anime Hub",
  animeList,
  currentPage,
  itemsPerPage = 24,
  basePath,
  faqs,
  seoContent,
  breadcrumbName,
}: CategoryHubLayoutProps) {
  const totalItems = animeList.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safePage - 1) * itemsPerPage;
  const currentAnime = animeList.slice(startIndex, startIndex + itemsPerPage);

  const getPageUrl = (p: number) => (p === 1 ? basePath : `${basePath}?page=${p}`);

  // Schema.org Structured Data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://kaianime.site",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: breadcrumbName,
        item: `https://kaianime.site${basePath}`,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description: subtitle,
    url: `https://kaianime.site${basePath}`,
    numberOfItems: totalItems,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen pb-20 pt-4 sm:pt-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-blue-400 font-semibold">{breadcrumbName}</span>
          {safePage > 1 && (
            <>
              <span>/</span>
              <span className="text-slate-400">Page {safePage}</span>
            </>
          )}
        </nav>

        {/* Hero Header with Single H1 */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1322] via-[#090e18] to-[#050608] border border-blue-500/20 p-6 sm:p-10 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {badge}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Ad-Free Streaming
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-blue-300">
                ⚡ 1080p Ultra HD
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-amber-300">
                🍿 {totalItems} Titles Available
              </span>
            </div>
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <p className="text-xs sm:text-sm text-slate-400">
            Showing <span className="text-white font-bold">{startIndex + 1}</span>–
            <span className="text-white font-bold">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{" "}
            <span className="text-white font-bold">{totalItems}</span> titles
          </p>
          <div className="text-xs text-slate-400">
            Page <span className="text-blue-400 font-bold">{safePage}</span> of {totalPages}
          </div>
        </div>

        {/* Anime Cards Grid */}
        {currentAnime.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {currentAnime.map((anime, idx) => (
              <AnimeCard key={anime.id} anime={anime} priority={idx < 6} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400">
            <p className="text-base font-semibold">No anime found in this category.</p>
          </div>
        )}

        {/* Server-Side Pagination Bar */}
        {totalPages > 1 && (
          <div className="pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
            <div className="text-xs text-slate-400">
              Page <span className="text-white font-bold">{safePage}</span> of{" "}
              <span className="text-white font-bold">{totalPages}</span> ({totalItems} titles)
            </div>

            <nav aria-label="Pagination" className="flex items-center gap-1.5">
              {safePage > 1 ? (
                <Link
                  href={getPageUrl(safePage - 1)}
                  rel="prev"
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all border border-white/10 flex items-center gap-1 hover:border-blue-500/50"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </Link>
              ) : (
                <span className="px-3.5 py-2 rounded-xl bg-white/5 text-slate-600 text-xs font-bold border border-white/5 cursor-not-allowed flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" /> Prev
                </span>
              )}

              {/* Number buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 2)
                .map((p, idx, arr) => {
                  const prevP = arr[idx - 1];
                  const showEllipsis = prevP && p - prevP > 1;

                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && <span className="px-1 text-slate-600">…</span>}
                      <Link
                        href={getPageUrl(p)}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-extrabold transition-all border ${
                          p === safePage
                            ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30 scale-105"
                            : "bg-white/5 text-slate-300 hover:bg-white/10 border-white/10 hover:text-white"
                        }`}
                      >
                        {p}
                      </Link>
                    </React.Fragment>
                  );
                })}

              {safePage < totalPages ? (
                <Link
                  href={getPageUrl(safePage + 1)}
                  rel="next"
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all border border-white/10 flex items-center gap-1 hover:border-blue-500/50"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="px-3.5 py-2 rounded-xl bg-white/5 text-slate-600 text-xs font-bold border border-white/5 cursor-not-allowed flex items-center gap-1">
                  Next <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </nav>
          </div>
        )}

        {/* Rich SEO Content Section */}
        <section className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#080d17]/80 border border-white/5 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Film className="w-5 h-5 text-blue-400" />
            {seoContent.heading}
          </h2>
          <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
            {seoContent.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* FAQs Section (High Click-Through Rate & Google Snippets) */}
        {faqs.length > 0 && (
          <section className="mt-8 p-6 sm:p-8 rounded-3xl bg-[#0a0f1c]/80 border border-white/5 space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Frequently Asked Questions (FAQs)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all space-y-2"
                >
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
