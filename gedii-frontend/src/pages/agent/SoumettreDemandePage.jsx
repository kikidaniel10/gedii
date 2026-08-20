import { useState } from 'react';

export default function SoumettreDemandePage() {
  const [form, setForm] = useState({
    titre: '',
    description: '',
    urgence: 'NORMALE',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: null });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.titre.trim()) newErrors.titre = 'Le titre est requis';
    if (!form.description.trim()) newErrors.description = 'La description est requise';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Branchement sur demandeService.creerDemande() a l'etape backend
    console.log('Nouvelle demande:', form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={styles.confirmCard}>
        <h1 style={styles.title}>Demande soumise avec succès</h1>
        <p style={styles.subtitle}>
          Votre demande a été enregistrée avec le statut <strong>En attente</strong>.
          Vous serez notifié par email dès qu'elle sera traitée.
        </p>
        <button
          onClick={() => {
            setForm({ titre: '', description: '', urgence: 'NORMALE' });
            setSubmitted(false);
          }}
          style={styles.button}
        >
          Soumettre une nouvelle demande
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 style={styles.title}>Soumettre une demande</h1>
      <p style={styles.pageSubtitle}>
        Décrivez votre problème technique, la cellule informatique vous répondra rapidement.
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Titre
          <input
            type="text"
            placeholder="Ex: Imprimante hors service au 2e étage"
            value={form.titre}
            onChange={handleChange('titre')}
            style={styles.input}
          />
          {errors.titre && <span style={styles.error}>{errors.titre}</span>}
        </label>

        <label style={styles.label}>
          Description
          <textarea
            placeholder="Décrivez le problème en détail : depuis quand, quel appareil, quelles circonstances..."
            value={form.description}
            onChange={handleChange('description')}
            style={styles.textarea}
            rows={6}
          />
          {errors.description && <span style={styles.error}>{errors.description}</span>}
        </label>

        <label style={styles.label}>
          Niveau d'urgence
          <div style={styles.urgenceGroup}>
            {[
              { value: 'FAIBLE', label: 'Faible' },
              { value: 'NORMALE', label: 'Normale' },
              { value: 'URGENTE', label: 'Urgente' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, urgence: opt.value })}
                style={{
                  ...styles.urgenceOption,
                  ...(form.urgence === opt.value ? styles.urgenceOptionActive(opt.value) : {}),
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </label>

        <button type="submit" style={styles.button}>
          Envoyer la demande
        </button>
      </form>
    </div>
  );
}

const urgenceColors = {
  FAIBLE: 'var(--color-primary)',
  NORMALE: 'var(--color-accent-gold)',
  URGENTE: 'var(--color-accent-red)',
};

const styles = {
  title: { fontSize: '24px', color: 'var(--color-text)', marginBottom: '6px' },
  pageSubtitle: { fontSize: '14px', color: 'var(--color-text-soft)', marginBottom: '28px' },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    maxWidth: '560px',
    background: 'var(--color-surface)',
    padding: '28px',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-card)',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--color-text)',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    fontSize: '15px',
    fontFamily: 'var(--font-body)',
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
  },
  textarea: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    fontSize: '15px',
    fontFamily: 'var(--font-body)',
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    resize: 'vertical',
  },
  urgenceGroup: { display: 'flex', gap: '8px' },
  urgenceOption: {
    flex: 1,
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontSize: '14px',
  },
  urgenceOptionActive: (value) => ({
    background: urgenceColors[value],
    borderColor: urgenceColors[value],
    color: value === 'NORMALE' ? 'var(--color-text)' : 'var(--color-surface)',
    fontWeight: 600,
  }),
  error: { fontSize: '12px', color: 'var(--color-accent-red)' },
  button: {
    marginTop: '4px',
    padding: '12px',
    background: 'var(--color-primary)',
    color: 'var(--color-surface)',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: 600,
  },
  confirmCard: {
    maxWidth: '560px',
    background: 'var(--color-surface)',
    padding: '32px',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-card)',
  },
};