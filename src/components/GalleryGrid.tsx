'use client';

import { useEffect, useRef, useState } from 'react';
import { Photo } from '@/lib/types';
import PolaroidCard from './PolaroidCard';
import PhotoCluster from './PhotoCluster';
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
        <p>No photos yet. Add some via the admin panel.</p>
      </div>
    );
  }

  // Build the reel layout with specific rhythm:
  // large, medium, cluster(2), large, quote, medium, cluster(3), large, medium, cluster(2), large
  const elements: Array<{ type: string; photo?: Photo; photos?: Photo[]; size?: string; tilt?: string; alignRight?: boolean; align?: string; text?: string; index: number; startIndex?: number }> = [];

  let photoIndex = 0;
  let elementIndex = 0;

  // 1. Large
  if (photos[photoIndex]) {
    elements.push({ type: 'frame', photo: photos[photoIndex], size: 'large', tilt: 'a', index: elementIndex++ });
    photoIndex++;
  }

  // 2. Medium (right)
  if (photos[photoIndex]) {
    elements.push({ type: 'frame', photo: photos[photoIndex], size: 'medium', tilt: 'b', alignRight: true, index: elementIndex++ });
    photoIndex++;
  }

  // 3. Cluster of 2 (left)
  if (photos[photoIndex] && photos[photoIndex + 1]) {
    elements.push({ type: 'cluster', photos: [photos[photoIndex], photos[photoIndex + 1]], align: 'left', startIndex: elementIndex, index: elementIndex });
    photoIndex += 2;
    elementIndex++;
  }

  // 4. Large
  if (photos[photoIndex]) {
    elements.push({ type: 'frame', photo: photos[photoIndex], size: 'large', tilt: 'a', index: elementIndex++ });
    photoIndex++;
  }

  // 5. Quote break
  if (pullQuote) {
    elements.push({ type: 'quote', text: pullQuote, index: elementIndex++ });
  }

  // 6. Medium
  if (photos[photoIndex]) {
    elements.push({ type: 'frame', photo: photos[photoIndex], size: 'medium', tilt: 'a', index: elementIndex++ });
    photoIndex++;
  }

  // 7. Cluster of 3 (right)
  if (photos[photoIndex] && photos[photoIndex + 1] && photos[photoIndex + 2]) {
    elements.push({ type: 'cluster', photos: [photos[photoIndex], photos[photoIndex + 1], photos[photoIndex + 2]], align: 'right', startIndex: elementIndex, index: elementIndex });
    photoIndex += 3;
    elementIndex++;
  }

  // 8. Large
  if (photos[photoIndex]) {
    elements.push({ type: 'frame', photo: photos[photoIndex], size: 'large', tilt: 'b', index: elementIndex++ });
    photoIndex++;
  }

  // 9. Medium (right)
  if (photos[photoIndex]) {
    elements.push({ type: 'frame', photo: photos[photoIndex], size: 'medium', tilt: 'b', alignRight: true, index: elementIndex++ });
    photoIndex++;
  }

  // 10. Remaining as cluster of 2 (left)
  if (photos[photoIndex] && photos[photoIndex + 1]) {
    elements.push({ type: 'cluster', photos: [photos[photoIndex], photos[photoIndex + 1]], align: 'left', startIndex: elementIndex, index: elementIndex });
    photoIndex += 2;
    elementIndex++;
  }

  // 11. Final large if one photo left
  if (photos[photoIndex]) {
    elements.push({ type: 'frame', photo: photos[photoIndex], size: 'large', tilt: 'a', index: elementIndex++ });
    photoIndex++;
  }

  return (
    <div className={styles.reel}>
      {elements.map((el, i) => {
        if (el.type === 'frame' && el.photo) {
          return (
            <PolaroidCard
              key={`frame-${el.photo.id}`}
              imageUrl={el.photo.image_url}
              caption={el.photo.caption}
              index={el.index}
              size={el.size as 'large' | 'medium'}
              tilt={el.tilt as 'a' | 'b'}
              alignRight={el.alignRight}
            />
          );
        }

        if (el.type === 'cluster' && el.photos) {
          return (
            <PhotoCluster
              key={`cluster-${el.startIndex}`}
              photos={el.photos}
              align={el.align as 'left' | 'right'}
              startIndex={el.startIndex ?? el.index}
            />
          );
        }

        if (el.type === 'quote' && el.text) {
          return (
            <QuoteBreak
              key={`quote-${el.index}`}
              text={el.text}
              index={el.index}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
