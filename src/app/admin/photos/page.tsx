'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Photo } from '@/lib/types';
import styles from './photos.module.css';

export default function AdminPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [editingCaption, setEditingCaption] = useState('');
  const [editingNote, setEditingNote] = useState('');
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        fetchPhotos();
      }
    } catch {
      router.push('/admin/login');
    }
  };

  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/photos');
      const data = await res.json();
      setPhotos(data);
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('context_note', '');
        formData.append('caption', '');

        const res = await fetch('/api/photos', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');
      }
      await fetchPhotos();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const selectPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
    setEditingCaption(photo.caption || '');
    setEditingNote(photo.context_note || '');
  };

  const generateCaption = async () => {
    if (!selectedPhoto) return;
    setGeneratingCaption(true);

    try {
      const res = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: selectedPhoto.image_url,
          contextNote: editingNote,
        }),
      });

      const data = await res.json();
      if (data.caption) {
        setEditingCaption(data.caption);
      }
    } catch (error) {
      console.error('Caption generation error:', error);
    } finally {
      setGeneratingCaption(false);
    }
  };

  const savePhoto = async () => {
    if (!selectedPhoto) return;

    try {
      const res = await fetch('/api/photos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPhoto.id,
          caption: editingCaption,
          context_note: editingNote,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert('Failed to save: ' + (err.error || 'Unknown error'));
        return;
      }

      await fetchPhotos();
      setSelectedPhoto(null);
    } catch (error) {
      console.error('Save error:', error);
      alert('Save failed. Check console for details.');
    }
  };

  const deletePhoto = async (id: string) => {
    if (!confirm('Delete this photo?')) return;

    try {
      await fetch(`/api/photos?id=${id}`, { method: 'DELETE' });
      await fetchPhotos();
      if (selectedPhoto?.id === id) setSelectedPhoto(null);
    } catch (error) {
      console.error('Delete error:', error);
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
          <span className={styles.navLink}>Photos</span>
          <a href="/admin/settings" className={styles.navLink}>Settings</a>
        </nav>
        <button onClick={logout} className={styles.logoutBtn}>Logout</button>
      </header>

      <main className={styles.main}>
        <div className={styles.toolbar}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className={styles.fileInput}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={styles.uploadBtn}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Photos'}
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.photoGrid}>
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className={`${styles.photoItem} ${selectedPhoto?.id === photo.id ? styles.selected : ''}`}
                onClick={() => selectPhoto(photo)}
              >
                <img src={photo.image_url} alt="" className={styles.thumbnail} />
                <span className={styles.orderBadge}>{index + 1}</span>
              </div>
            ))}
            {photos.length === 0 && (
              <p className={styles.emptyText}>No photos yet. Upload some to get started.</p>
            )}
          </div>

          {selectedPhoto && (
            <div className={styles.editor}>
              <h3 className={styles.editorTitle}>Edit Photo</h3>

              <img src={selectedPhoto.image_url} alt="" className={styles.preview} />

              <div className={styles.field}>
                <label className={styles.label}>Context Note (private, for AI)</label>
                <textarea
                  value={editingNote}
                  onChange={e => setEditingNote(e.target.value)}
                  placeholder="Add a note about this photo..."
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <div className={styles.field}>
                <div className={styles.captionHeader}>
                  <label className={styles.label}>Caption</label>
                  <button
                    onClick={generateCaption}
                    className={styles.generateBtn}
                    disabled={generatingCaption}
                  >
                    {generatingCaption ? 'Generating...' : 'Generate with AI'}
                  </button>
                </div>
                <textarea
                  value={editingCaption}
                  onChange={e => setEditingCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className={styles.textarea}
                  rows={2}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Photo Date</label>
                <input
                  type="date"
                  defaultValue={selectedPhoto.photo_date || ''}
                  className={styles.dateInput}
                  onChange={async e => {
                    await fetch('/api/photos', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        id: selectedPhoto.id,
                        photo_date: e.target.value,
                      }),
                    });
                    await fetchPhotos();
                  }}
                />
              </div>

              <div className={styles.actions}>
                <button onClick={savePhoto} className={styles.saveBtn}>Save</button>
                <button
                  onClick={() => deletePhoto(selectedPhoto.id)}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
