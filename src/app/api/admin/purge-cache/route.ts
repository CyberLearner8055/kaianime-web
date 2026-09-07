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
      revalidateTag('github-commit');
      revalidateTag('app-trending');
      revalidateTag('running-anime');
      revalidateTag('site-config');
      revalidatePath('/', 'layout');
      revalidatePath('/home', 'page');
      revalidatePath('/anime/[slug]', 'page');
      revalidatePath('/watch/[slug]/[ep]', 'page');
    } catch (e) {
      console.warn('revalidateTag warning:', e);
    }

    // 2. Immediate fresh fetch from GitHub Raw URL using newest commit SHA
    const freshData = await fetchAllAnime(true);
    const config = getSiteConfig();

    return NextResponse.json(
      {
        success: true,
        message: "Cache purged successfully! Reloaded " + freshData.length + " anime titles and cleared browser cache.",
        count: freshData.length,
        dataUrl: config.dataUrl,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Clear-Site-Data": '"cache"',
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
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
