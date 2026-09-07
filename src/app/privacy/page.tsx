import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | KaiAnime.me",
  description: "Privacy policy and data protection practices at KaiAnime.me.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-slate-300 font-sans">
      <div className="p-6 sm:p-10 rounded-2xl bg-[#090c14] border border-white/8 shadow-2xl space-y-6">
        <h1 className="text-2xl sm:text-3xl font-black text-white border-l-4 border-blue-600 pl-4">
          Privacy Policy
        </h1>

        <p className="text-sm leading-relaxed">
          At <strong className="text-white font-bold">KaiAnime.me</strong>, your privacy is of utmost importance. This Privacy Policy document outlines the types of information that is collected and recorded by KaiAnime and how we utilize it.
        </p>

        <h2 className="text-lg font-bold text-white pt-2">1. Information We Collect</h2>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
          KaiAnime is a 100% account-free streaming portal. We do not require registration, passwords, credit cards, or personal identification. Watch progress and user preferences (such as audio selection) are stored strictly on your own device using local storage.
        </p>

        <h2 className="text-lg font-bold text-white pt-2">2. Log Files & Analytics</h2>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
          Like many web sites, KaiAnime makes use of standard server log files. The information inside the log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and number of clicks to analyze trends and administer the site.
        </p>

        <h2 className="text-lg font-bold text-white pt-2">3. Zero Harmful Ads Guarantee</h2>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
          KaiAnime is 100% Ad-Free. We do not inject malicious scripts, cryptocurrency miners, or third-party trackers.
        </p>

        <h2 className="text-lg font-bold text-white pt-2">4. Contact Information</h2>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
          If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at{" "}
          <a href="mailto:kaianime@outlook.in" className="text-blue-400 font-bold hover:underline">
            kaianime@outlook.in
          </a>.
        </p>
      </div>
    </div>
  );
}
