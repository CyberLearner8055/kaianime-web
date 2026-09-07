import React from "react";
import { Metadata } from "next";
import { Mail, Send, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | KaiAnime.me",
  description: "Get in touch with the KaiAnime and Anime Drive Network team.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-slate-300 font-sans">
      <div className="p-6 sm:p-10 rounded-2xl bg-[#090c14] border border-white/8 shadow-2xl space-y-6">
        <h1 className="text-2xl sm:text-3xl font-black text-white border-l-4 border-blue-600 pl-4">
          Contact Us
        </h1>

        <p className="text-sm leading-relaxed">
          Have questions, suggestions, feedback, or DMCA inquiries? Feel free to reach out to the KaiAnime support team. We respond to all valid messages within 24–48 hours.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white/5 border border-white/8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">KaiAnime Email Support</p>
              <a href="mailto:kaianime@outlook.in" className="text-sm font-bold text-white hover:text-blue-400 transition-colors">
                kaianime@outlook.in
              </a>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Anime Drive Network Email</p>
              <a href="mailto:animedrive@outlook.in" className="text-sm font-bold text-white hover:text-emerald-400 transition-colors">
                animedrive@outlook.in
              </a>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0088cc]/20 text-[#0088cc] flex items-center justify-center flex-shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Telegram Community</p>
              <a href="https://t.me/animeedrive" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-white hover:text-blue-400 transition-colors">
                @animeedrive
              </a>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-400">Official Instagram</p>
              <a href="https://instagram.com/kaianime.me" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-white hover:text-rose-400 transition-colors">
                @kaianime.me
              </a>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <p className="text-xs text-blue-200">
              For copyright or content removal requests, please specify exact URLs and proof of ownership.
            </p>
          </div>
          <a
            href="/anime-drive-network"
            className="text-xs font-bold text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            About Anime Drive Network →
          </a>
        </div>
      </div>
    </div>
  );
}
