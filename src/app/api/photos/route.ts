import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { Photo } from '@/lib/types';

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const contextNote = formData.get('context_note') as string | null;
    const caption = formData.get('caption') as string | null;
    const photoDate = formData.get('photo_date') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const storagePath = `photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(storagePath, buffer, { contentType: file.type });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from('photos').getPublicUrl(storagePath);

    const { data: maxOrder } = await supabase
      .from('photos')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)
      .single();

    const newOrderIndex = (maxOrder?.order_index ?? -1) + 1;

    const { data, error } = await supabase
      .from('photos')
      .insert({
        storage_path: storagePath,
        image_url: urlData.publicUrl,
        context_note: contextNote || null,
        caption: caption || null,
        photo_date: photoDate || null,
        order_index: newOrderIndex,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Create photo error:', error);
    return NextResponse.json({ error: 'Failed to create photo' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { id, context_note, caption, photo_date, order_index } = await request.json();

    const updates: Partial<Photo> = {};
    if (context_note !== undefined) updates.context_note = context_note;
    if (caption !== undefined) updates.caption = caption;
    if (photo_date !== undefined) updates.photo_date = photo_date;
    if (order_index !== undefined) updates.order_index = order_index;

    const { data, error } = await supabase
      .from('photos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Photo ID required' }, { status: 400 });
    }

    const { error } = await supabase.from('photos').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
