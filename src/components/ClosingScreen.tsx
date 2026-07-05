'use client';

import { useEffect, useState } from 'react';
import styles from './ClosingScreen.module.css';

interface ClosingScreenProps {
  message: string;
}

export default function ClosingScreen({ message }: ClosingScreenProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById('closing');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="closing" className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      <p className={styles.message}>{message}</p>
      <button onClick={scrollToTop} className={styles.replayButton}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.icon}>
          <path d="M3 12a9 9 0 1 1 9 9M3 12V6m0 6H9" />
        </svg>
        Watch again
      </button>
    </div>
  );
}
