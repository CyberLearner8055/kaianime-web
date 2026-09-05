import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { isAdminAuthenticated } from '@/lib/auth';
import { purgeAnimeDataCache, fetchAllAnime } from '@/lib/data';
import { getSiteConfig } from '@/lib/config';

export async function POST() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Flush memory caches & edge data cache tags
    purgeAnimeDataCache();
    try {
      revalidateTag('anime-catalog');
      revalidateTag('app-trending');
      revalidateTag('running-anime');
      revalidateTag('site-config');
      revalidatePath('/', 'layout');
    } catch (e) {
      console.warn('revalidateTag warning:', e);
    }

    // 2. Immediate fresh fetch from GitHub Raw URL
    const freshData = await fetchAllAnime();
    const config = getSiteConfig();

    return NextResponse.json({
      success: true,
      message: "Cache purged successfully! Reloaded " + freshData.length + " anime titles from data source.",
      count: freshData.length,
      dataUrl: config.dataUrl,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to reload data: " + (err?.message || "Unknown error"),
      },
      { status: 500 }
    );
  }
}
