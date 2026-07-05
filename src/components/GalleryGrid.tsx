'use client';

import { Photo } from '@/lib/types';
import QuoteBreak from './QuoteBreak';
import styles from './GalleryGrid.module.css';

interface GalleryGridProps {
  photos: Photo[];
  pullQuote: string;
}

export default function GalleryGrid({ photos, pullQuote }: GalleryGridProps) {
  if (photos.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No photos yet. Add the first frame from the admin panel.</p>
      </div>
    );
  }

  const openingSet = photos.slice(0, 4);
  const remainingSet = photos.slice(4);

  return (
    <section className={styles.gallery} aria-label="Photo gallery">
      <div className={styles.sectionHeader}>
        <p>After the first frame</p>
        <h2>The small proof that life was happening beautifully.</h2>
      </div>

      <div className={styles.grid}>
        {openingSet.map((photo, index) => (
          <article key={photo.id} className={`${styles.card} ${styles[`variant_${index % 4}`]}`}>
            <img src={photo.image_url} alt="" className={styles.image} />
            <div className={styles.cardBody}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {photo.caption && <p>{photo.caption}</p>}
            </div>
          </article>
        ))}
      </div>

      {pullQuote && <QuoteBreak text={pullQuote} index={openingSet.length} />}

      {remainingSet.length > 0 && (
        <div className={styles.grid}>
          {remainingSet.map((photo, index) => {
            const absoluteIndex = index + openingSet.length;

            return (
              <article
                key={photo.id}
                className={`${styles.card} ${styles[`variant_${absoluteIndex % 4}`]}`}
              >
                <img src={photo.image_url} alt="" className={styles.image} />
                <div className={styles.cardBody}>
                  <span>{String(absoluteIndex + 1).padStart(2, '0')}</span>
                  {photo.caption && <p>{photo.caption}</p>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
