'use client';

import { useEffect, useState } from 'react';
import styles from './IntroScreen.module.css';

interface IntroScreenProps {
  recipientLabel: string;
  introMessage: string;
}

export default function IntroScreen({ recipientLabel, introMessage }: IntroScreenProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      <p className={styles.label}>{recipientLabel}</p>
      <h2 className={styles.message}>{introMessage}</h2>
      <div className={styles.scrollCue}>
        <span className={styles.scrollText}>Scroll to reveal</span>
        <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </div>
  );
}
