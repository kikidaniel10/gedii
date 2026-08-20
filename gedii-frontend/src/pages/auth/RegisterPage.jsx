import { useState } from 'react';
import coatOfArms from '../../assets/coat-of-arms.png';
import mincomBuilding from '../../assets/mincom-building.png';

// Liste temporaire en dur - sera remplacee par un appel a GET /api/services
const SERVICES_TEMP = [
  { id: 1, nom: 'Direction de la Communication' },
  { id: 2, nom: 'Cellule Informatique' },
  { id: 3, nom: 'Service du Personnel' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    nom: '',
    matricule: '',
    email: '',
    password: '',
    serviceId: '',
    cleAcces: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: null });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!form.matricule.trim()) newErrors.matricule = 'Le matricule est requis';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Format email invalide';
    if (form.password.length < 6) newErrors.password = 'Minimum 6 caractères';
    if (!form.serviceId) newErrors.serviceId = 'Sélectionnez un service';
    if (!form.cleAcces.trim()) newErrors.cleAcces = 'La clé d\'accès est requise';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Branchement sur AuthService.register() a l'etape backend
    console.log('Inscription:', form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <img src={coatOfArms} alt="République du Cameroun" style={styles.logoSmall} />
          <h1 style={styles.title}>Compte créé</h1>
          <p style={styles.subtitle}>
            Votre compte est en attente de validation par le responsable de la cellule
            informatique. Vous recevrez un email dès qu'il sera activé.
          </p>
          <a href="/login" style={styles.link}>Retour à la connexion</a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <img src={coatOfArms} alt="République du Cameroun" style={styles.logo} />

      <div style={styles.card}>
        <p style={styles.eyebrow}>GEDII — Cellule Informatique</p>
        <h1 style={styles.title}>Créer un compte</h1>
        <p style={styles.subtitle}>Ministère de la Communication</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Nom complet
            <input
              type="text"
              value={form.nom}
              onChange={handleChange('nom')}
              style={styles.input}
            />
            {errors.nom && <span style={styles.error}>{errors.nom}</span>}
          </label>

          <label style={styles.label}>
            Matricule
            <input
              type="text"
              value={form.matricule}
              onChange={handleChange('matricule')}
              style={styles.input}
            />
            {errors.matricule && <span style={styles.error}>{errors.matricule}</span>}
          </label>

          <label style={styles.label}>
            Email
            <input
              type="email"
              placeholder="exemple@mincom.cm"
              value={form.email}
              onChange={handleChange('email')}
              style={styles.input}
            />
            {errors.email && <span style={styles.error}>{errors.email}</span>}
          </label>

          <label style={styles.label}>
            Mot de passe
            <input
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              style={styles.input}
            />
            {errors.password && <span style={styles.error}>{errors.password}</span>}
          </label>

          <label style={styles.label}>
            Service
            <select
              value={form.serviceId}
              onChange={handleChange('serviceId')}
              style={styles.input}
            >
              <option value="">Sélectionnez votre service</option>
              {SERVICES_TEMP.map((s) => (
                <option key={s.id} value={s.id}>{s.nom}</option>
              ))}
            </select>
            {errors.serviceId && <span style={styles.error}>{errors.serviceId}</span>}
          </label>

          <label style={styles.label}>
            Clé d'accès du service
            <input
              type="text"
              placeholder="Fournie par votre responsable"
              value={form.cleAcces}
              onChange={handleChange('cleAcces')}
              style={styles.input}
            />
            {errors.cleAcces && <span style={styles.error}>{errors.cleAcces}</span>}
          </label>

          <button type="submit" style={styles.button}>
            Créer mon compte
          </button>

          <a href="/login" style={styles.link}>
            J'ai déjà un compte
          </a>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    backgroundImage: `linear-gradient(rgba(11, 20, 16, 0.75), rgba(11, 20, 16, 0.85)), url(${mincomBuilding})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  logo: { width: '64px', height: '64px', objectFit: 'contain', marginBottom: '20px' },
  logoSmall: { width: '48px', height: '48px', objectFit: 'contain', marginBottom: '16px' },
  card: {
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
    padding: '36px 40px',
    width: '100%',
    maxWidth: '420px',
  },
  eyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--color-primary)',
    margin: '0 0 8px 0',
  },
  title: { fontSize: '26px', marginBottom: '4px', color: 'var(--color-text)' },
  subtitle: {
    color: 'var(--color-text-soft)',
    fontSize: '14px',
    marginTop: '4px',
    marginBottom: '24px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
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
  error: {
    fontSize: '12px',
    color: 'var(--color-accent-red)',
  },
  button: {
    marginTop: '8px',
    padding: '12px',
    background: 'var(--color-primary)',
    color: 'var(--color-surface)',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: 600,
  },
  link: {
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--color-primary)',
    textDecoration: 'none',
    marginTop: '8px',
  },
};