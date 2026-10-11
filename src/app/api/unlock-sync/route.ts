import { NextResponse } from 'next/server';
import { recordUserUnlock, getUserUnlock } from '@/lib/unlock-store';

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid') || '';

    if (!uid) {
      return NextResponse.json(
        { success: false, message: 'Missing uid' },
        { status: 400, headers: corsHeaders }
      );
    }

    const unlock = getUserUnlock(uid);
    if (!unlock) {
      return NextResponse.json(
        { success: true, hasUnlock: false },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        hasUnlock: true,
        tier: unlock.tier,
        step: unlock.step,
        total: unlock.total,
        code: unlock.code,
        time: unlock.time,
      },
      {
        headers: {
          ...corsHeaders,
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, tier, step, total, code } = body;

    if (!uid) {
      return NextResponse.json(
        { success: false, message: 'Missing uid' },
        { status: 400, headers: corsHeaders }
      );
    }

    recordUserUnlock(
      uid,
      tier === 'vvip' ? 'vvip' : 'stream',
      parseInt(step) || 1,
      parseInt(total) || 1,
      code || ''
    );

    return NextResponse.json(
      { success: true, message: 'Recorded successfully' },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
