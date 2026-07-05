'use client';

import { useEffect } from 'react';
import { Photo } from '@/lib/types';
import styles from './Lightbox.module.css';

interface LightboxProps {
  photo: Photo | null;
  onClose: () => void;
}

export default function Lightbox({ photo, onClose }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (photo) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div
      className={`${styles.lightbox} ${photo ? styles.open : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button className={styles.closeBtn} onClick={onClose}>
        Close ✕
      </button>
      <div className={styles.inner}>
        <img src={photo.image_url} alt="" />
        <div className={styles.caption}>
          <p className={styles.text}>{photo.caption || 'Photo'}</p>
        </div>
      </div>
    </div>
  );
}
