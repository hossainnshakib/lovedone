'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './PolaroidCard.module.css';

interface PolaroidCardProps {
  imageUrl: string;
  caption: string | null;
  index: number;
  size: 'large' | 'medium';
  tilt: 'a' | 'b';
  alignRight?: boolean;
}

export default function PolaroidCard({ imageUrl, caption, index, size, tilt, alignRight }: PolaroidCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsRevealed(true), index * 100);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`
        ${styles.frame}
        ${styles[`size_${size}`]}
        ${styles[`tilt_${tilt}`]}
        ${alignRight ? styles.right : ''}
        ${isRevealed ? styles.inView : ''}
      `}
    >
      <span className={styles.frameNumber}>
        FRAME {String(index + 1).padStart(3, '0')}
      </span>

      <div className={styles.pin} />

      <div className={styles.print}>
        <div className={styles.photoWell}>
          <img src={imageUrl} alt="" className={styles.photo} />
        </div>
      </div>

      {caption && size === 'large' && (
        <p className={styles.greaseNote}>{caption}</p>
      )}
    </div>
  );
}
