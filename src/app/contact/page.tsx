import React from "react";
import { Metadata } from "next";
import { Mail, Send, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | KaiAnime.site",
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
              <p className="text-xs text-slate-400">Email Support</p>
              <p className="text-sm font-bold text-white">support@kaianime.site</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0088cc]/20 text-[#0088cc] flex items-center justify-center flex-shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Telegram Community</p>
              <a href="https://t.me/animedrive" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-white hover:text-blue-400 transition-colors">
                @animedrive
              </a>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-blue-400 flex-shrink-0" />
          <p className="text-xs text-blue-200">
            For copyright or content removal requests, please specify exact URLs and proof of ownership.
          </p>
        </div>
      </div>
    </div>
  );
}
