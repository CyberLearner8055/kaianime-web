import React from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import {
  loadAppShortenerConfig,
  getActiveShorteners,
  buildShortenerUrl,
} from '@/lib/app-config';
import UnlockRedirectClient from './UnlockRedirectClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    tier?: string;
    step?: string;
    fromStep?: string;
    uid?: string;
  }>;
}

export default async function UnlockPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tier = params.tier === 'vvip' ? 'vvip' : 'stream';
  const fromStepNum = parseInt(params.fromStep || params.step || '1') || 1;
  const uid = (params.uid || 'default').trim();

  const config = await loadAppShortenerConfig(true);

  // If system is disabled globally, auto-unlock in app
  if (!config.enabled) {
    redirect(`animedrive://unlock?tier=${tier}&code=free&uid=${encodeURIComponent(uid)}`);
  }

  const streamReq = config.streamShortenersRequired;
  const vvipReq = config.vvipShortenersRequired;

  // If requirement is 0, instant free unlock
  if (tier === 'stream' && streamReq <= 0) {
    redirect(`animedrive://unlock?tier=stream&code=free&uid=${encodeURIComponent(uid)}`);
  }
  if (tier === 'vvip' && vvipReq <= 0) {
    redirect(`animedrive://unlock?tier=vvip&code=free&uid=${encodeURIComponent(uid)}`);
  }

  const totalSteps = tier === 'vvip' ? vvipReq : streamReq;
  const currentStep = Math.min(Math.max(1, fromStepNum), totalSteps);

  const activeShorteners = getActiveShorteners(config);
  if (activeShorteners.length === 0) {
    // No active shorteners configured, grant direct access
    redirect(`animedrive://unlock?tier=${tier}&code=free&uid=${encodeURIComponent(uid)}`);
  }

  // Pick shortener based on step index (1-indexed)
  const shortenerIndex = (currentStep - 1) % activeShorteners.length;
  const selectedShortener = activeShorteners[shortenerIndex];

  // Resolve current web origin (defaulting to kaianime.me)
  const reqHeaders = await headers();
  const host = reqHeaders.get('host') || 'kaianime.me';
  const proto = host.includes('localhost') ? 'http' : 'https';
  const origin = `${proto}://${host}`;

  // Destination callback after shortener completes
  const callbackUrl = `${origin}/unlock/callback?tier=${tier}&step=${currentStep}&total=${totalSteps}&uid=${encodeURIComponent(uid)}`;

  // Build quicklink URL
  const targetUrl = buildShortenerUrl(selectedShortener, callbackUrl);

  return (
    <UnlockRedirectClient
      targetUrl={targetUrl}
      tier={tier}
      step={currentStep}
      totalSteps={totalSteps}
      shortenerName={selectedShortener.name}
    />
  );
}
