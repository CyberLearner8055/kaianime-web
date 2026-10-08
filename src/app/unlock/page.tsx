import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import {
  loadAppShortenerConfig,
  getActiveShorteners,
  buildShortenerUrl,
} from '@/lib/app-config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    tier?: string;
    step?: string;
    fromStep?: string;
  }>;
}

export default async function UnlockPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tier = params.tier === 'vvip' ? 'vvip' : 'stream';
  const fromStepNum = parseInt(params.fromStep || params.step || '1') || 1;

  const config = await loadAppShortenerConfig(true);

  // If system is disabled globally, auto-unlock in app
  if (!config.enabled) {
    redirect(`animedrive://unlock?tier=${tier}&code=free`);
  }

  const streamReq = config.streamShortenersRequired;
  const vvipReq = config.vvipShortenersRequired;

  // If requirement is 0, instant free unlock
  if (tier === 'stream' && streamReq <= 0) {
    redirect(`animedrive://unlock?tier=stream&code=free`);
  }
  if (tier === 'vvip' && vvipReq <= 0) {
    redirect(`animedrive://unlock?tier=vvip&code=free`);
  }

  const totalSteps = tier === 'vvip' ? vvipReq : streamReq;
  const currentStep = Math.min(Math.max(1, fromStepNum), totalSteps);

  const activeShorteners = getActiveShorteners(config);
  if (activeShorteners.length === 0) {
    // No active shorteners configured, grant direct access
    redirect(`animedrive://unlock?tier=${tier}&code=free`);
  }

  // Pick shortener based on step index (1-indexed)
  const shortenerIndex = (currentStep - 1) % activeShorteners.length;
  const selectedShortener = activeShorteners[shortenerIndex];

  // Resolve current web origin
  const reqHeaders = await headers();
  const host = reqHeaders.get('host') || 'kaianime-web.vercel.app';
  const proto = host.includes('localhost') ? 'http' : 'https';
  const origin = `${proto}://${host}`;

  // Destination callback after shortener completes
  const callbackUrl = `${origin}/unlock/callback?tier=${tier}&step=${currentStep}&total=${totalSteps}`;

  // Build quicklink URL
  const targetUrl = buildShortenerUrl(selectedShortener, callbackUrl);

  // Redirect user to shortener
  redirect(targetUrl);
}
