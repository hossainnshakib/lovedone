import { createServerClient } from '@/lib/supabase';
import { Photo, Settings } from '@/lib/types';
import PublicRevealClient from './PublicRevealClient';

async function getData(): Promise<{ photos: Photo[]; settings: Settings }> {
  const supabase = createServerClient();

  const [photosResult, settingsResult] = await Promise.all([
    supabase.from('photos').select('*').order('order_index', { ascending: true }),
    supabase.from('settings').select('*').eq('id', 1).single(),
  ]);

  const photos = photosResult.data || [];
  const settings = settingsResult.data || {
    id: 1,
    recipient_label: 'For You',
    intro_message: 'A collection of moments, waiting to be seen.',
    closing_message: 'The end.',
    updated_at: new Date().toISOString(),
  };

  return { photos, settings };
}

export default async function PublicReveal() {
  const { photos, settings } = await getData();

  return <PublicRevealClient photos={photos} settings={settings} />;
}
