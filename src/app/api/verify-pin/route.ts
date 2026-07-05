import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PIN_COOKIE_NAME } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();
    const correctPin = process.env.REVEAL_PIN;

    if (!pin || !correctPin) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (pin !== correctPin) {
      return NextResponse.json({ error: 'Incorrect PIN' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set(PIN_COOKIE_NAME, 'verified', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 3,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const isVerified = cookieStore.get(PIN_COOKIE_NAME)?.value === 'verified';
  return NextResponse.json({ verified: isVerified });
}
