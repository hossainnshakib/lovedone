'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings } from '@/lib/types';
import styles from './settings.module.css';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recipientLabel, setRecipientLabel] = useState('');
  const [introMessage, setIntroMessage] = useState('');
  const [closingMessage, setClosingMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin-auth');
      const data = await res.json();
      if (!data.authenticated) {
        router.push('/admin/login');
      } else {
        fetchSettings();
      }
    } catch {
      router.push('/admin/login');
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
      setRecipientLabel(data.recipient_label || '');
      setIntroMessage(data.intro_message || '');
      setClosingMessage(data.closing_message || '');
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_label: recipientLabel,
          intro_message: introMessage,
          closing_message: closingMessage,
        }),
      });
      alert('Settings saved!');
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    document.cookie = 'admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/admin/login');
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <a href="/admin/photos" className={styles.navLink}>Photos</a>
          <span className={styles.navLink}>Settings</span>
        </nav>
        <button onClick={logout} className={styles.logoutBtn}>Logout</button>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Reveal Settings</h1>

          <div className={styles.field}>
            <label className={styles.label}>Recipient Label</label>
            <input
              type="text"
              value={recipientLabel}
              onChange={e => setRecipientLabel(e.target.value)}
              placeholder="For You"
              className={styles.input}
            />
            <span className={styles.hint}>Shown at the top of the intro screen</span>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Intro Message</label>
            <textarea
              value={introMessage}
              onChange={e => setIntroMessage(e.target.value)}
              placeholder="A collection of moments, waiting to be seen."
              className={styles.textarea}
              rows={3}
            />
            <span className={styles.hint}>The opening message on the reveal page</span>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Closing Message</label>
            <textarea
              value={closingMessage}
              onChange={e => setClosingMessage(e.target.value)}
              placeholder="The end."
              className={styles.textarea}
              rows={3}
            />
            <span className={styles.hint}>Shown after all photos have been revealed</span>
          </div>

          <button
            onClick={saveSettings}
            className={styles.saveBtn}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        <div className={styles.card}>
          <h1 className={styles.title}>PIN</h1>
          <p className={styles.pinNote}>
            The reveal PIN is set via the <code>REVEAL_PIN</code> environment variable.
            Current value: <strong>{'•'.repeat(4)}</strong>
          </p>
          <p className={styles.pinHint}>
            Change it in your <code>.env.local</code> file and redeploy.
          </p>
        </div>
      </main>
    </div>
  );
}
