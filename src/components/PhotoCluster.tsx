'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './PhotoCluster.module.css';

interface PhotoClusterProps {
  photos: Array<{ id: string; image_url: string; caption: string | null }>;
  align: 'left' | 'right';
  startIndex: number;
}

export default function PhotoCluster({ photos, align, startIndex }: PhotoClusterProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const clusterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsRevealed(true), startIndex * 100);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (clusterRef.current) {
      observer.observe(clusterRef.current);
    }

    return () => observer.disconnect();
  }, [startIndex]);

  return (
    <div
      ref={clusterRef}
      className={`${styles.cluster} ${styles[`align_${align}`]} ${isRevealed ? styles.inView : ''}`}
    >
      {photos.map((photo, i) => (
        <div key={photo.id} className={styles.clusterItem}>
          <div className={styles.pin} />
          <div className={`${styles.print} ${styles[`tilt_${i}`]}`}>
            <div className={styles.photoWell}>
              <img src={photo.image_url} alt="" className={styles.photo} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
