'use client';

import { useEffect, useRef, useState } from 'react';
import { Photo } from '@/lib/types';
import PolaroidCard from './PolaroidCard';
import styles from './GalleryGrid.module.css';

interface GalleryGridProps {
  photos: Photo[];
  pullQuote: string;
}

export default function GalleryGrid({ photos, pullQuote }: GalleryGridProps) {
  const [revealedItems, setRevealedItems] = useState<Set<string>>(new Set());
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) {
              setRevealedItems(prev => new Set([...prev, id]));
            }
          }
        });
      },
      { threshold: 0.08 }
    );

    itemRefs.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [photos]);

  if (photos.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No photos yet. Add some via the admin panel.</p>
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          ref={el => { if (el) itemRefs.current.set(photo.id, el); }}
          data-id={photo.id}
          className={`${styles.galleryItem} ${revealedItems.has(photo.id) ? styles.inView : ''}`}
        >
          <PolaroidCard
            imageUrl={photo.image_url}
            caption={photo.caption}
            index={index}
          />
        </div>
      ))}
    </div>
  );
}
