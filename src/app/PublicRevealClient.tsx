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
  const featuredPhoto = photos[0];

  return (
    <main className={styles.main}>
      <div className={styles.paperTexture} />

      <div className={styles.wrap}>
        <section className={styles.cover}>
          {featuredPhoto ? (
            <div className={styles.coverPhotoWrap}>
              <img src={featuredPhoto.image_url} alt="" className={styles.coverPhoto} />
            </div>
          ) : (
            <div className={styles.emptyHeroImage}>A little surprise</div>
          )}

          <div className={styles.coverCopy}>
            <h1 className={styles.editorialTitle}>
              Dear Sumiya Sehtaz — a little surprise just for you
            </h1>
            <p className={styles.heroSub}>{settings.intro_message}</p>
          </div>
        </section>

        <GalleryGrid photos={photos} pullQuote={pullQuote} />

        <footer className={styles.footer}>
          <svg className={styles.bulb} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
            <circle cx="12" cy="10" r="7"/>
            <path d="M9 20h6M10 17h4M10 20l-.5 2h5l-.5-2"/>
          </svg>
          <p className={styles.footerLabel}>Closing note</p>
          <p className={styles.footerLine}>{settings.closing_message}</p>
          <div className={styles.footerCredit}>made with love ❤️</div>
        </footer>
      </div>
    </main>
  );
}
