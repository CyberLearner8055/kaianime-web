import React from 'react';
import { Metadata } from 'next';
import { getTodayAppCode } from '@/lib/app-config';
import UnlockCallbackClient from '../../callback/UnlockCallbackClient';

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
  params: Promise<{
    slug: string;
  }>;
}

export default async function UnlockSlugPage({ params }: PageProps) {
  const { slug } = await params;

  // Format: {tier}_{step}_{total}_{uid}
  // e.g. "stream_1_1_AD839201" or "vvip_2_3_AD839201"
  const parts = (slug || '').split('_');
  const tier = parts[0]?.toLowerCase() === 'vvip' ? 'vvip' : 'stream';
  const step = parseInt(parts[1] || '1') || 1;
  const total = parseInt(parts[2] || (tier === 'vvip' ? '3' : '1')) || 1;
  const uid = parts.slice(3).join('_') || 'default';
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
