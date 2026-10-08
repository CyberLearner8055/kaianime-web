import { NextResponse } from 'next/server';
import { loadAppShortenerConfig, updateAppShortenerConfig } from '@/lib/app-config';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const config = await loadAppShortenerConfig(true);
    return NextResponse.json(config, {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to load app config' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: Request) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please login to App Admin.' },
        { status: 401, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const updated = await updateAppShortenerConfig(body);

    return NextResponse.json(
      { success: true, message: 'App Shortener settings updated successfully', config: updated },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to update app config' },
      { status: 500, headers: corsHeaders }
    );
  }
}
