'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './PolaroidCard.module.css';

interface PolaroidCardProps {
  imageUrl: string;
  caption: string | null;
  index: number;
}

const TAPE_COLORS = ['rose', 'mustard'] as const;
type TapeColor = typeof TAPE_COLORS[number];

export default function PolaroidCard({ imageUrl, caption, index }: PolaroidCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsRevealed(true), 100 + index * 80);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  const toggleFlip = () => setIsFlipped(f => !f);

  const tapeColor: TapeColor = TAPE_COLORS[index % 2];
  const rotation = index % 2 === 0 ? -3.5 + index * 0.8 : 3.2 - index * 0.6;

  return (
    <div
      ref={cardRef}
      className={`${styles.wrapper} ${isRevealed ? styles.inView : ''}`}
      style={{ '--rotation': `${rotation}deg` } as React.CSSProperties}
    >
      <div
        className={`${styles.flipCard} ${isFlipped ? styles.flipped : ''}`}
        onClick={toggleFlip}
      >
        <div className={styles.front}>
          <div className={`${styles.tape} ${styles[`tape_${tapeColor}`]}`} />

          <div className={styles.polaroid}>
            <img src={imageUrl} alt="" className={styles.photo} />
            <p className={styles.flipHint}>tap to flip ↻</p>
          </div>
        </div>

        <div className={styles.back}>
          <div className={`${styles.tape} ${styles[`tape_${tapeColor}`]}`} />

          <div className={styles.polaroidBack}>
            <p className={styles.backNote}>
              {caption || 'A moment worth keeping.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
