import React from 'react';
import { Metadata } from 'next';
import { getTodayAppCode } from '@/lib/app-config';
import UnlockCallbackClient from './UnlockCallbackClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Activation Complete - Anime Drive',
  description: 'Your Anime Drive access pass has been verified.',
  robots: {
    index: false,
    follow: false,
  },
};

interface PageProps {
  searchParams: Promise<{
    tier?: string;
    step?: string;
    total?: string;
    uid?: string;
  }>;
}

export default async function UnlockCallbackPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tier = params.tier === 'vvip' ? 'vvip' : 'stream';
  const step = parseInt(params.step || '1') || 1;
  const total = parseInt(params.total || (tier === 'vvip' ? '3' : '1')) || 1;
  const uid = (params.uid || 'default').trim();
  const todayCode = getTodayAppCode(uid);

  return (
    <UnlockCallbackClient
      tier={tier}
      step={step}
      total={total}
      todayCode={todayCode}
      uid={uid}
    />
  );
}
