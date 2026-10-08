'use client';

import React, { useEffect, useState } from 'react';
import {
  Crown,
  Play,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Zap,
} from 'lucide-react';

interface Props {
  tier: 'stream' | 'vvip';
  step: number;
  total: number;
  todayCode: string;
}

export default function UnlockCallbackClient({ tier, step, total, todayCode }: Props) {
  const isFinalStep = step >= total;
  const nextStep = step + 1;
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(isFinalStep ? 2 : 3);

  const deepLink = `animedrive://unlock?tier=${tier}&code=${todayCode}&step=${step}`;

  useEffect(() => {
    // If it's the final step, auto launch the app deep link
    if (isFinalStep) {
      const timer = setTimeout(() => {
        window.location.href = deepLink;
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      // If intermediate step, auto navigate to next step
      const interval = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(interval);
            window.location.href = `/unlock?tier=${tier}&step=${nextStep}`;
            return 0;
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isFinalStep, nextStep, tier, deepLink]);

  const copyCode = () => {
    navigator.clipboard.writeText(todayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4 relative overflow-hidden text-white">
      {/* Background radial glow */}
      <div
        className={`absolute w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          tier === 'vvip' ? 'bg-amber-500/15' : 'bg-blue-600/15'
        }`}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#0f131d]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/80 text-center">
          {isFinalStep ? (
            /* FINAL SUCCESS STATE */
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xl shadow-emerald-500/25 animate-bounce">
                {tier === 'vvip' ? <Crown className="w-10 h-10" /> : <Play className="w-10 h-10" />}
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> 24-Hour Access Activated
                </div>
                <h1 className="text-2xl font-extrabold text-white">
                  {tier === 'vvip' ? 'VVIP Access Unlocked!' : 'Stream Access Unlocked!'}
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  {tier === 'vvip'
                    ? '24 ghante ke liye Unlimited Anime Downloads & Streaming activate ho chuka hai!'
                    : '24 ghante ke liye Unlimited Anime Streaming activate ho chuka hai!'}
                </p>
              </div>

              {/* Action Button: Launch Deep Link */}
              <div className="space-y-3 pt-2">
                <a
                  href={deepLink}
                  className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 hover:from-emerald-400 to-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 text-base transition-all transform active:scale-95"
                >
                  <ExternalLink className="w-5 h-5" /> Open Anime Drive App
                </a>
                <p className="text-xs text-gray-500">
                  App automatically open ho raha hai ({countdown}s)...
                </p>
              </div>

              {/* Fallback 4-Digit Code Box */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400 mb-2">
                  Agar app automatically open na ho to ye code app me dalein:
                </p>
                <div className="bg-[#151a27] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                      Activation Code
                    </span>
                    <span className="text-2xl font-black font-mono tracking-widest text-emerald-400">
                      {todayCode}
                    </span>
                  </div>
                  <button
                    onClick={copyCode}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* INTERMEDIATE STEP STATE */
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/25">
                <Zap className="w-8 h-8" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Step {step} of {total} Done
                </div>
                <h1 className="text-xl font-bold text-white">
                  Step {step} Completed!
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Sirf <span className="text-amber-400 font-bold">{total - step} aur shortener</span> baki hai VVIP Unlock karne ke liye!
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((step / total) * 100)}%` }}
                />
              </div>

              {/* Next Step CTA */}
              <div className="pt-2">
                <a
                  href={`/unlock?tier=${tier}&step=${nextStep}`}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 hover:from-blue-500 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 text-sm transition-all transform active:scale-95"
                >
                  Proceed to Step {nextStep} <ArrowRight className="w-4 h-4" />
                </a>
                <p className="text-xs text-gray-500 mt-2">
                  Next shortener redirecting in {countdown}s...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
