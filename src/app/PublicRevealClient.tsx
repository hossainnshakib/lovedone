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

  const pullQuote = photos[4]?.caption || photos[0]?.caption || 'Some moments deserve more than a camera roll.';

  return (
    <main className={styles.main}>
      <div className={styles.safelightGlow} />
      <div className={styles.grainOverlay} />

      <div className={styles.wrap}>
        <section className={styles.hero}>
          <div className={styles.pilot} />
          <p className={styles.greeting}>Dear {settings.recipient_label} — a little surprise just for you</p>
          <h1 className={styles.title}>
            A moment <em>just for you</em>
          </h1>
          <p className={styles.heroSub}>{settings.intro_message}</p>
          <div className={styles.scrollCue}>
            <div className={styles.scrollLine} />
            REEL BEGINS
          </div>
        </section>

        <GalleryGrid photos={photos} pullQuote={pullQuote} />

        <footer className={styles.footer}>
          <svg className={styles.bulb} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
            <circle cx="12" cy="10" r="7"/>
            <path d="M9 20h6M10 17h4M10 20l-.5 2h5l-.5-2"/>
          </svg>
          <p className={styles.footerLine}>{settings.closing_message}</p>
          <div className={styles.footerSign}>— made with love ❤️</div>
        </footer>
      </div>
    </main>
  );
}
