'use client';

import { useEffect, useRef, useState } from 'react';
import { Photo } from '@/lib/types';
import Lightbox from './Lightbox';
import styles from './GalleryGrid.module.css';

interface GalleryGridProps {
  photos: Photo[];
  pullQuote: string;
}

export default function GalleryGrid({ photos, pullQuote }: GalleryGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) {
              setVisibleItems(prev => new Set([...prev, id]));
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    itemRefs.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [photos]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (photos.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No photos yet. Add some via the admin panel.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.gallery}>
        {photos.map((photo, index) => (
          <div key={photo.id}>
            <div
              ref={el => { if (el) itemRefs.current.set(photo.id, el); }}
              data-id={photo.id}
              className={`${styles.item} ${visibleItems.has(photo.id) ? styles.inView : ''}`}
              onClick={() => setSelectedPhoto(photo)}
            >
              <figure>
                <img src={photo.image_url} alt="" />
                <figcaption>
                  <p className={styles.capText}>{photo.caption || 'Photo'}</p>
                </figcaption>
              </figure>
            </div>
            {index === 2 && pullQuote && (
              <div
                className={`${styles.pull} ${visibleItems.has('pull-0') ? styles.inView : ''}`}
                data-id="pull-0"
                ref={el => { if (el) itemRefs.current.set('pull-0', el); }}
              >
                <p>"{pullQuote}"</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <Lightbox
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </>
  );
}
