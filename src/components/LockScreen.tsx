'use client';

import { useState, useRef, useEffect } from 'react';
import ApertureGraphic from './ApertureGraphic';
import styles from './LockScreen.module.css';

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError(false);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newPin.every(digit => digit !== '') && newPin.join('').length === 4) {
      verifyPin(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyPin = async (pinValue: string) => {
    try {
      const res = await fetch('/api/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinValue }),
      });

      if (res.ok) {
        setIsUnlocking(true);
        setTimeout(() => setShowFlash(true), 400);
        setTimeout(onUnlock, 800);
      } else {
        setError(true);
        setPin(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError(true);
      setPin(['', '', '', '']);
    }
  };

  return (
    <div className={styles.container}>
      {showFlash && <div className={styles.flash} />}
      <div className={`${styles.lockScreen} ${isUnlocking ? styles.unlocking : ''}`}>
        <ApertureGraphic isOpen={isUnlocking} />

        <p className={styles.eyebrow}>Enter PIN to continue</p>
        <h1 className={styles.heading}>Moment Reveal</h1>

        <div className={styles.pinContainer}>
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={el => { inputRefs.current[index] = el; }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className={`${styles.pinInput} ${error ? styles.error : ''}`}
              autoComplete="off"
            />
          ))}
        </div>

        {error && <p className={styles.errorText}>Incorrect PIN. Try again.</p>}
      </div>
    </div>
  );
}
