import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase';
import { Photo, Settings } from '@/lib/types';
import { PIN_COOKIE_NAME } from '@/lib/constants';
import PublicRevealClient from './PublicRevealClient';

const DEFAULT_SETTINGS: Settings = {
  id: 1,
  recipient_label: 'For You',
  intro_message: 'A collection of moments, waiting to be seen.',
  closing_message: 'The end.',
  updated_at: new Date().toISOString(),
};

async function getData() {
  const supabase = createServerClient();

  const [photosResult, settingsResult] = await Promise.all([
    supabase.from('photos').select('*').order('order_index', { ascending: true }),
    supabase.from('settings').select('*').eq('id', 1).single(),
  ]);

  return {
    photos: photosResult.data || [],
    settings: settingsResult.data || DEFAULT_SETTINGS,
  };
}

export default async function PublicReveal() {
  const cookieStore = await cookies();
  cookieStore.delete(PIN_COOKIE_NAME);
  const isVerified = cookieStore.get(PIN_COOKIE_NAME)?.value === 'verified';

  if (!isVerified) {
    return (
      <PublicRevealClient photos={[]} settings={DEFAULT_SETTINGS} isVerified={false} />
    );
  }

  const { photos, settings } = await getData();
  return <PublicRevealClient photos={photos} settings={settings} isVerified={true} />;
}
