import { useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

export default function MonProfilPage() {
  const { user, refreshUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  if (!user) return null;

  const initials = user.nom.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('La photo ne doit pas dépasser 5 MB');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post('/utilisateurs/me/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.erreur || "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Supprimer votre photo de profil ?')) return;
    setUploading(true);
    setError(null);
    try {
      await api.delete('/utilisateurs/me/photo');
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.erreur || 'Erreur lors de la suppression');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Mon profil</h1>
      <p style={styles.subtitle}>Gérez vos informations personnelles et votre photo de profil.</p>

      <div style={styles.card}>
        <div style={styles.photoBlock}>
          <div style={styles.avatarLarge}>
            {user.photoUrl ? (
              <img src={user.photoUrl} alt={user.nom} style={styles.avatarImg} />
            ) : (
              initials
            )}
          </div>
          <div style={styles.photoActions}>
            <label style={styles.uploadBtn}>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                style={{ display: 'none' }}
                disabled={uploading}
              />
              <Camera size={16} />
              {uploading ? 'Envoi...' : 'Changer la photo'}
            </label>
            {user.photoUrl && (
              <button onClick={handleDelete} style={styles.deleteBtn} disabled={uploading}>
                <Trash2 size={16} />
                Supprimer
              </button>
            )}
          </div>
          {error && <p style={styles.error}>{error}</p>}
        </div>

        <div style={styles.infoBlock}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Nom</span>
            <span style={styles.infoValue}>{user.nom}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Matricule</span>
            <span style={styles.infoValue}>{user.matricule}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Email</span>
            <span style={styles.infoValue}>{user.email}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Rôle</span>
            <span style={styles.infoValue}>{user.role}</span>
          </div>
          {user.serviceNom && (
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Service</span>
              <span style={styles.infoValue}>{user.serviceNom}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  title: { fontSize: '24px', color: 'var(--color-text)', marginBottom: '6px' },
  subtitle: { fontSize: '14px', color: 'var(--color-text-soft)', marginBottom: '24px' },
  card: {
    background: 'var(--color-surface)', padding: '28px',
    borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)',
    maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '28px',
  },
  photoBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' },
  avatarLarge: {
    width: '120px', height: '120px', borderRadius: '50%',
    background: 'var(--color-primary)', color: 'var(--color-surface)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '36px', fontWeight: 600, overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  photoActions: { display: 'flex', gap: '10px' },
  uploadBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 14px', borderRadius: '6px', border: 'none',
    background: 'var(--color-primary)', color: 'var(--color-surface)',
    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
  },
  deleteBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 14px', borderRadius: '6px',
    border: '1px solid var(--color-accent-red)', background: 'transparent',
    color: 'var(--color-accent-red)', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
  },
  error: { fontSize: '12px', color: 'var(--color-accent-red)' },
  infoBlock: { display: 'flex', flexDirection: 'column', gap: '12px' },
  infoRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '12px 0', borderBottom: '1px solid var(--color-border)',
  },
  infoLabel: { fontSize: '13px', color: 'var(--color-text-soft)' },
  infoValue: { fontSize: '14px', fontWeight: 500, color: 'var(--color-text)' },
};