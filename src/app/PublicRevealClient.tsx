'use client';

import { useEffect, useState } from 'react';
import { Photo, Settings } from '@/lib/types';
import LockScreen from '@/components/LockScreen';
import IntroScreen from '@/components/IntroScreen';
import PhotoCard from '@/components/PhotoCard';
import ClosingScreen from '@/components/ClosingScreen';
import styles from './page.module.css';

interface PublicRevealClientProps {
  photos: Photo[];
  settings: Settings;
}

export default function PublicRevealClient({ photos, settings }: PublicRevealClientProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/verify-pin');
      const data = await res.json();
      if (data.verified) {
        setIsUnlocked(true);
      }
    } catch {
    } finally {
      setCheckingAuth(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  if (!isUnlocked) {
    return <LockScreen onUnlock={() => setIsUnlocked(true)} />;
  }

  const displayPhotos = photos.length > 0 ? photos : PLACEHOLDER_PHOTOS;

  return (
    <main className={styles.main}>
      <IntroScreen
        recipientLabel={settings.recipient_label}
        introMessage={settings.intro_message}
      />

      <div className={styles.photoRoll}>
        <div className={styles.spine} />
        {displayPhotos.map((photo, index) => (
          <PhotoCard
            key={photo.id || index}
            imageUrl={photo.image_url}
            caption={photo.caption}
            photoDate={photo.photo_date}
            side={index % 2 === 0 ? 'left' : 'right'}
            index={index}
          />
        ))}
      </div>

      <ClosingScreen message={settings.closing_message} />
    </main>
  );
}

const PLACEHOLDER_PHOTOS: Photo[] = [
  {
    id: '1',
    storage_path: '',
    image_url: 'https://picsum.photos/400/400?random=1',
    context_note: null,
    caption: 'A moment captured in time.',
    photo_date: '2024-01-15',
    order_index: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    storage_path: '',
    image_url: 'https://picsum.photos/400/400?random=2',
    context_note: null,
    caption: 'Something worth remembering.',
    photo_date: '2024-02-20',
    order_index: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    storage_path: '',
    image_url: 'https://picsum.photos/400/400?random=3',
    context_note: null,
    caption: 'The view from a quiet afternoon.',
    photo_date: '2024-03-10',
    order_index: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    storage_path: '',
    image_url: 'https://picsum.photos/400/400?random=4',
    context_note: null,
    caption: 'Caption goes here',
    photo_date: '2024-04-05',
    order_index: 3,
    created_at: new Date().toISOString(),
  },
];
