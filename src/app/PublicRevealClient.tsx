'use client';

import { useRouter } from 'next/navigation';
import { Photo, Settings } from '@/lib/types';
import GalleryGrid from '@/components/GalleryGrid';
import LockScreen from '@/components/LockScreen';
import styles from './page.module.css';

interface PublicRevealClientProps {
  photos: Photo[];
  settings: Settings;
  isVerified: boolean;
}

export default function PublicRevealClient({ photos, settings, isVerified }: PublicRevealClientProps) {
  const router = useRouter();

  if (!isVerified) {
    return <LockScreen onUnlock={() => router.refresh()} />;
  }

  const pullQuote = photos[3]?.caption || photos[0]?.caption || 'Some moments just stay with you.';

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>A small collection</div>
        <h1 className={styles.title}>
          {settings.recipient_label.split(' ').map((word, i) =>
            i === settings.recipient_label.split(' ').length - 1
              ? <em key={i}>{word}</em>
              : word + ' '
          )}
        </h1>
        <p className={styles.deck}>{settings.intro_message}</p>
      </header>

      <GalleryGrid photos={photos} pullQuote={pullQuote} />

      <footer className={styles.footer}>
        <div className={styles.eyebrow}>Before you go</div>
        <p className={styles.footerText}>{settings.closing_message}</p>
        <div className={styles.footerSign}>— made with care</div>
      </footer>
    </main>
  );
}
