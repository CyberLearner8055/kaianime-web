import React from 'react';
import { Metadata } from 'next';
import { isAdminAuthenticated } from '@/lib/auth';
import { loadAppShortenerConfig } from '@/lib/app-config';
import AppAdminLogin from './AppAdminLogin';
import AppAdminClient from './AppAdminClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Anime Drive App Admin - KaiAnime',
  description: 'Control center for Anime Drive App Shorteners & Monetization Quota.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AppAdminPage() {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    return <AppAdminLogin />;
  }

  const config = await loadAppShortenerConfig(true);

  return <AppAdminClient initialConfig={config} />;
}
