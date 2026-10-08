'use client';

import React, { useState } from 'react';
import {
  Crown,
  Play,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Zap,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  tier: 'stream' | 'vvip';
  step: number;
  total: number;
  todayCode: string;
  uid: string;
}

export default function UnlockCallbackClient({
  tier,
  step,
  total,
  todayCode,
  uid,
}: Props) {
  const isFinalStep = step >= total;
  const [copied, setCopied] = useState(false);
  const [launchingApp, setLaunchingApp] = useState(false);

  const customSchemeUri = `animedrive://unlock?tier=${tier}&code=${todayCode}&step=${step}&uid=${encodeURIComponent(
    uid
  )}`;
  const androidIntentUri = `intent://unlock?tier=${tier}&code=${todayCode}&step=${step}&uid=${encodeURIComponent(
    uid
  )}#Intent;scheme=animedrive;package=com.example.animedrive;end`;

  const copyCode = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(todayCode);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = todayCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (_) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleOpenApp = () => {
    setLaunchingApp(true);

    // 1. First attempt: Safe hidden iframe for custom scheme
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = customSchemeUri;
    document.body.appendChild(iframe);

    // 2. Second attempt: Android Intent URI on current window
    setTimeout(() => {
      try {
        document.body.removeChild(iframe);
      } catch (_) {}
      try {
        window.location.href = androidIntentUri;
      } catch (_) {}
      setLaunchingApp(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4 relative overflow-hidden text-white font-sans">
      {/* Background radial ambient glow */}
      <div
        className={`absolute w-96 h-96 rounded-full blur-3xl pointer-events-none -top-12 -left-12 ${
          tier === 'vvip' ? 'bg-amber-500/15' : 'bg-emerald-500/15'
        }`}
      />
      <div
        className={`absolute w-96 h-96 rounded-full blur-3xl pointer-events-none -bottom-12 -right-12 ${
          tier === 'vvip' ? 'bg-orange-600/15' : 'bg-teal-500/15'
        }`}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#0f131d]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 md:p-8 shadow-2xl shadow-black/90 text-center">
          {/* Header Icon */}
          <div className="mb-5 inline-block">
            {isFinalStep ? (
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl text-white shadow-xl ${
                  tier === 'vvip'
                    ? 'bg-gradient-to-tr from-amber-500 to-orange-400 shadow-amber-500/30'
                    : 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/30'
                }`}
              >
                {tier === 'vvip' ? (
                  <Crown className="w-10 h-10 text-white" />
                ) : (
                  <ShieldCheck className="w-10 h-10 text-white" />
                )}
              </div>
            ) : (
              <div className="inline-flex items-center justify-center w-18 h-18 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-xl shadow-blue-500/30 p-4">
                <Zap className="w-10 h-10 text-amber-300" />
              </div>
            )}
          </div>

          {/* Badges & Titles */}
          {isFinalStep ? (
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2.5">
                <Sparkles className="w-3.5 h-3.5" /> 24-Hour Access Verified
              </div>
              <h1 className="text-2xl font-black text-white">
                {tier === 'vvip' ? '👑 VVIP Access Unlocked!' : '🎬 Stream VIP Pass Ready!'}
              </h1>
              <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">
                {tier === 'vvip'
                  ? 'Aapka 24 Ghante ke liye Unlimited Anime Downloads & Streaming Pass ready ho gaya hai!'
                  : 'Aapka 24 Ghante ke liye High-Speed Anime Streaming Pass activate ho gaya hai!'}
              </p>
            </div>
          ) : (
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide mb-2.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Step {step} of {total} Done
              </div>
              <h1 className="text-2xl font-black text-white">
                Step {step} Verified!
              </h1>
              <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">
                Step {step} complete ho chuka hai! Anime streaming bhi start ho chuki hai. VVIP Downloads ke liye sirf <span className="text-amber-400 font-bold">{total - step} step baki</span> hai!
              </p>
            </div>
          )}

          {/* Glowing 4-Digit Code Box */}
          <div className="my-6 p-5 rounded-2xl bg-[#151a27] border border-white/10 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Your Activation Code
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono">
                Valid for this device
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 mt-1">
              <div className="text-left">
                <span className="text-3xl md:text-4xl font-black font-mono tracking-[0.25em] text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                  {todayCode}
                </span>
              </div>
              <button
                onClick={copyCode}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold flex items-center gap-1.5 transition-all border border-white/10"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Primary Action Button: Open App */}
          <div className="space-y-3">
            <button
              onClick={handleOpenApp}
              disabled={launchingApp}
              className={`w-full py-4 px-6 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2.5 text-base transition-all transform active:scale-95 ${
                tier === 'vvip' && isFinalStep
                  ? 'bg-gradient-to-r from-amber-500 hover:from-amber-400 to-orange-500 shadow-amber-500/30'
                  : 'bg-gradient-to-r from-emerald-500 hover:from-emerald-400 to-teal-500 shadow-emerald-500/30'
              }`}
            >
              <ExternalLink className="w-5 h-5" />
              {launchingApp
                ? 'Opening App...'
                : isFinalStep
                ? 'Open Anime Drive App'
                : `Apply Step ${step} in Anime Drive`}
            </button>

            <p className="text-xs text-gray-400 leading-relaxed px-2">
              Upar button dabakar app kholein, ya phir code copy karke Anime Drive App me paste karein.
            </p>
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <span className="text-[11px] text-gray-500">
              Anime Drive • Powered by KaiAnime Cloud
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
