import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!password || !correctPassword) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (password !== correctPassword) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get(ADMIN_COOKIE_NAME)?.value === 'authenticated';
  return NextResponse.json({ authenticated: isAuthenticated });
}
