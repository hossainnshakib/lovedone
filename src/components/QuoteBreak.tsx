'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './QuoteBreak.module.css';

interface QuoteBreakProps {
  text: string;
  index: number;
}

export default function QuoteBreak({ text, index }: QuoteBreakProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsRevealed(true), index * 100);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (quoteRef.current) {
      observer.observe(quoteRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={quoteRef}
      className={`${styles.quoteBreak} ${isRevealed ? styles.inView : ''}`}
    >
      <p>{text}</p>
    </div>
  );
}
