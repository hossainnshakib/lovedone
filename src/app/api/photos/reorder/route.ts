import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { photos } = await request.json();

    if (!Array.isArray(photos)) {
      return NextResponse.json({ error: 'Photos array required' }, { status: 400 });
    }

    for (const photo of photos) {
      const { error } = await supabase
        .from('photos')
        .update({ order_index: photo.order_index })
        .eq('id', photo.id);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to reorder photos' }, { status: 500 });
  }
}
