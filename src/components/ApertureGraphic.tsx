'use client';

import { useEffect, useRef } from 'react';
import styles from './ApertureGraphic.module.css';

interface ApertureGraphicProps {
  isOpen: boolean;
}

export default function ApertureGraphic({ isOpen }: ApertureGraphicProps) {
  const bladesRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (isOpen && bladesRef.current) {
      bladesRef.current.style.transform = 'rotate(45deg) scale(1.5)';
      bladesRef.current.style.opacity = '0';
    }
  }, [isOpen]);

  return (
    <svg
      className={styles.aperture}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" className={styles.outerRing} />
      <circle cx="50" cy="50" r="35" className={styles.innerRing} />
      <g ref={bladesRef} className={styles.blades}>
        {[...Array(8)].map((_, i) => (
          <path
            key={i}
            d="M50 15 L55 35 L50 50 L45 35 Z"
            className={styles.blade}
            style={{ transform: `rotate(${i * 45}deg)`, transformOrigin: '50px 50px' }}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="10" className={styles.center} />
    </svg>
  );
}
