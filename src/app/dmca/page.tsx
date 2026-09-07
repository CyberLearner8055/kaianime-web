import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA Disclaimer | KaiAnime.me",
  description: "DMCA copyright policy and takedown request procedures for KaiAnime.me.",
};

export default function DmcaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-slate-300 font-sans">
      <div className="p-6 sm:p-10 rounded-2xl bg-[#090c14] border border-white/8 shadow-2xl space-y-6">
        <h1 className="text-2xl sm:text-3xl font-black text-white border-l-4 border-blue-600 pl-4">
          DMCA Copyright Notice
        </h1>

        <p className="text-sm leading-relaxed">
          <strong className="text-white font-bold">KaiAnime.me</strong> is an online indexing platform and does not host or store any media files on its own servers. All content shown or linked is provided by non-affiliated third-party streaming services. We index links across the web in a manner similar to search engines such as Google and Bing.
        </p>

        <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 text-xs sm:text-sm text-blue-200 leading-relaxed">
          <p className="font-bold mb-1">Notice of Copyright Infringement</p>
          <p>
            If you are a copyright owner or an agent thereof and believe that any content linked on KaiAnime infringes upon your copyright, you may submit a formal notification pursuant to the Digital Millennium Copyright Act (DMCA).
          </p>
        </div>

        <h2 className="text-lg font-bold text-white pt-2">How to Submit a Takedown Request:</h2>
        <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-300">
          <li>Identify the copyrighted work claimed to have been infringed.</li>
          <li>Provide exact URLs on KaiAnime.me pointing to the disputed content.</li>
          <li>Provide sufficient contact information (name, address, telephone number, and email address).</li>
          <li>Include a statement of good faith belief that the disputed use is not authorized by the copyright owner.</li>
          <li>Include a statement made under penalty of perjury that the information in the notification is accurate.</li>
        </ul>

        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-slate-400">
            Send all DMCA inquiries to: <a href="mailto:kaianime@outlook.in" className="text-blue-400 font-bold hover:underline">kaianime@outlook.in</a> or via our <a href="/contact" className="text-blue-400 hover:underline">Contact Us</a> page. Valid requests will be addressed promptly.
          </p>
        </div>
      </div>
    </div>
  );
}
