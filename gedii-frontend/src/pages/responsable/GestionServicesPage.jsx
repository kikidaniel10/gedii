import { useState } from 'react';
import { Copy, Check, Plus } from 'lucide-react';

// Donnees fictives temporaires - seront remplacees par des appels a serviceService (GET/POST /api/services)
const SERVICES_INIT = [
  { id: 1, nom: 'Direction de la Communication', cleAcces: 'SRV-4F2A9C', dateCreation: '2026-07-10' },
  { id: 2, nom: 'Cellule Informatique', cleAcces: 'SRV-88B1E2', dateCreation: '2026-07-10' },
  { id: 3, nom: 'Service du Personnel', cleAcces: 'SRV-D34F01', dateCreation: '2026-08-01' },
];

function genererCle() {
  const chars = '0123456789ABCDEF';
  let code = 'MINCOM-';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function GestionServicesPage() {
  const [services, setServices] = useState(SERVICES_INIT);
  const [nomService, setNomService] = useState('');
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!nomService.trim()) {
      setError('Le nom du service est requis');
      return;
    }
    if (services.some((s) => s.nom.toLowerCase() === nomService.trim().toLowerCase())) {
      setError('Ce service existe déjà');
      return;
    }

    // Branchement sur serviceService.creerService(nom) a l'etape backend
    const nouveauService = {
      id: Date.now(),
      nom: nomService.trim(),
      cleAcces: genererCle(),
      dateCreation: new Date().toISOString().slice(0, 10),
    };
    setServices([nouveauService, ...services]);
    setNomService('');
    setError('');
  };

  const handleCopy = (id, cle) => {
    navigator.clipboard.writeText(cle);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div>
      <h1 style={styles.title}>Services & clés d'accès</h1>
      <p style={styles.pageSubtitle}>
        Créez un service pour générer sa clé d'accès. Communiquez cette clé aux agents
        concernés pour qu'ils puissent s'inscrire.
      </p>

      <form onSubmit={handleCreate} style={styles.form}>
        <input
          type="text"
          placeholder="Nom du nouveau service"
          value={nomService}
          onChange={(e) => {
            setNomService(e.target.value);
            setError('');
          }}
          style={styles.input}
        />
        <button type="submit" style={styles.createBtn}>
          <Plus size={16} />
          Créer
        </button>
      </form>
      {error && <span style={styles.error}>{error}</span>}

      <div style={styles.list}>
        {services.map((s) => (
          <div key={s.id} style={styles.card}>
            <div>
              <h3 style={styles.cardTitle}>{s.nom}</h3>
              <p style={styles.cardMeta}>
                Créé le {new Date(s.dateCreation).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div style={styles.cleBox}>
              <code style={styles.cleText}>{s.cleAcces}</code>
              <button
                onClick={() => handleCopy(s.id, s.cleAcces)}
                style={styles.copyBtn}
                title="Copier la clé"
              >
                {copiedId === s.id ? (
                  <Check size={16} color="var(--color-primary)" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  title: { fontSize: '24px', color: 'var(--color-text)', marginBottom: '6px' },
  pageSubtitle: { fontSize: '14px', color: 'var(--color-text-soft)', marginBottom: '24px', maxWidth: '540px' },
  form: { display: 'flex', gap: '10px', marginBottom: '6px', maxWidth: '480px' },
  input: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    fontSize: '14px',
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
  },
  createBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '6px',
    border: 'none',
    background: 'var(--color-primary)',
    color: 'var(--color-surface)',
    fontSize: '14px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  error: { display: 'block', fontSize: '12px', color: 'var(--color-accent-red)', marginBottom: '20px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '600px', marginTop: '24px' },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'var(--color-surface)',
    padding: '16px 20px',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-card)',
    flexWrap: 'wrap',
    gap: '12px',
  },
  cardTitle: { fontSize: '15px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px 0' },
  cardMeta: { fontSize: '12px', color: 'var(--color-text-soft)', margin: 0 },
  cleBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--color-bg-strong)',
    padding: '6px 10px',
    borderRadius: '6px',
  },
  cleText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    color: 'var(--color-primary-dark)',
  },
  copyBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    padding: '4px',
    color: 'var(--color-text-soft)',
  },
};