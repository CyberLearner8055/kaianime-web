import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getSiteConfig, updateSiteConfig } from '@/lib/config';

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    config: getSiteConfig(),
  });
}

export async function POST(req: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateSiteConfig(body);
    return NextResponse.json({
      success: true,
      message: 'Site configuration updated successfully',
      config: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to update config' },
      { status: 500 }
    );
  }
}
