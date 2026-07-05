'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './PhotoCard.module.css';

interface PhotoCardProps {
  imageUrl: string;
  caption: string | null;
  rotation: 'left' | 'right';
}

export default function PhotoCard({ imageUrl, caption, rotation }: PhotoCardProps) {
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

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${styles[rotation]} ${isRevealed ? styles.revealed : ''}`}
    >
      <div className={styles.polaroid}>
        <img src={imageUrl} alt="" className={styles.image} />
      </div>
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  );
}
