'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink, ShieldCheck, Sparkles, Crown, Loader2, ArrowRight } from 'lucide-react';

interface Props {
  targetUrl: string;
  tier: 'stream' | 'vvip';
  step: number;
  totalSteps: number;
  shortenerName: string;
}

export default function UnlockRedirectClient({
  targetUrl,
  tier,
  step,
  totalSteps,
  shortenerName,
}: Props) {
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          window.location.href = targetUrl;
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetUrl]);

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4 relative overflow-hidden text-white font-sans">
      {/* Background glow effects */}
      <div
        className={`absolute w-96 h-96 rounded-full blur-3xl pointer-events-none -top-10 -left-10 ${
          tier === 'vvip' ? 'bg-amber-500/10' : 'bg-blue-600/10'
        }`}
      />
      <div
        className={`absolute w-96 h-96 rounded-full blur-3xl pointer-events-none -bottom-10 -right-10 ${
          tier === 'vvip' ? 'bg-amber-600/10' : 'bg-indigo-600/10'
        }`}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#0f131d]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/80 text-center">
          {/* Header Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 mb-6 relative">
            {tier === 'vvip' ? (
              <Crown className="w-10 h-10 text-amber-300" />
            ) : (
              <ShieldCheck className="w-10 h-10 text-blue-300" />
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0f131d] flex items-center justify-center">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            </div>
          </div>

          {/* Tier Badge */}
          <div className="mb-3">
            {tier === 'vvip' ? (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide">
                <Crown className="w-3.5 h-3.5" /> VVIP Download Pass • Step {step} of {totalSteps}
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" /> 24-Hour VIP Stream Pass
              </div>
            )}
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">
            Connecting to Shortener...
          </h1>

          <p className="text-sm text-gray-400 mt-2 leading-relaxed">
            Sponsor link complete hone ke baad aapko aapka <span className="text-white font-medium">exclusive 4-digit activation code</span> milega jo Anime Drive App ko activate karega.
          </p>

          {/* Shortener Info Card */}
          <div className="my-6 p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-left flex items-center justify-between">
            <div>
              <span className="text-[11px] text-gray-500 uppercase tracking-wider block font-semibold">
                Sponsor Server
              </span>
              <span className="text-sm font-bold text-gray-200">
                {shortenerName || 'Fast Secure Link'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-gray-500 uppercase tracking-wider block font-semibold">
                Redirecting In
              </span>
              <span className="text-sm font-bold text-emerald-400">
                {countdown}s
              </span>
            </div>
          </div>

          {/* Manual Proceed Button */}
          <a
            href={targetUrl}
            className={`w-full py-4 px-6 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base transition-all transform active:scale-95 ${
              tier === 'vvip'
                ? 'bg-gradient-to-r from-amber-500 hover:from-amber-400 to-orange-500 shadow-amber-500/25'
                : 'bg-gradient-to-r from-blue-600 hover:from-blue-500 to-indigo-600 shadow-blue-500/25'
            }`}
          >
            Proceed to Shortener <ArrowRight className="w-5 h-5" />
          </a>

          <p className="text-xs text-gray-500 mt-4">
            Agar automatic redirect na ho, to upar diye button par click karein.
          </p>
        </div>
      </div>
    </div>
  );
}
