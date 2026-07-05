'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './PhotoCard.module.css';

interface PhotoCardProps {
  imageUrl: string;
  caption: string | null;
  photoDate: string | null;
  side: 'left' | 'right';
  index: number;
}

export default function PhotoCard({ imageUrl, caption, photoDate, side, index }: PhotoCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsRevealed(true), 100);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formattedDate = photoDate
    ? new Date(photoDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div
      ref={cardRef}
      className={`${styles.timelineEntry} ${styles[side]} ${isRevealed ? styles.revealed : ''}`}
    >
      <div className={styles.connector}>
        <div className={styles.node} />
      </div>

      <div className={styles.content}>
        <div className={styles.polaroid}>
          <div className={styles.imageContainer}>
            <img src={imageUrl} alt="" className={styles.image} />
          </div>
          <div className={styles.dateStamp}>
            {formattedDate || 'Photo'}
          </div>
        </div>
        {caption && <p className={styles.caption}>{caption}</p>}
      </div>
    </div>
  );
}
