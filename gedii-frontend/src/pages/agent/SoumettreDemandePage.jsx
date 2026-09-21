import { useState } from 'react';
import {
  Send, Circle, Zap, Flame, CheckCircle2, FileText, AlertCircle, Info,
} from 'lucide-react';
import { demandeService } from '../../services/demandeService';

const MAX_DESC = 1000;

const URGENCE_OPTIONS = [
  {
    value: 'FAIBLE',
    label: 'Faible',
    description: 'Pas urgent, peut attendre',
    Icon: Circle,
    color: 'var(--color-primary)',
  },
  {
    value: 'NORMALE',
    label: 'Normale',
    description: 'À traiter dans la journée',
    Icon: Zap,
    color: 'var(--color-accent-gold)',
  },
  {
    value: 'URGENTE',
    label: 'Urgente',
    description: 'Bloque mon travail',
    Icon: Flame,
    color: 'var(--color-accent-red)',
  },
];

export default function SoumettreDemandePage() {
  const [form, setForm] = useState({
    titre: '',
    description: '',
    urgence: 'NORMALE',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [recap, setRecap] = useState(null);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: null });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.titre.trim()) newErrors.titre = 'Le titre est requis';
    else if (form.titre.trim().length < 5) newErrors.titre = 'Le titre doit faire au moins 5 caractères';
    if (!form.description.trim()) newErrors.description = 'La description est requise';
    else if (form.description.trim().length < 15) newErrors.description = 'La description doit faire au moins 15 caractères';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    demandeService.creer(form)
      .then(() => {
        setRecap({ ...form });
        setSubmitted(true);
      })
      .catch((err) => {
        setErrors({ general: err.response?.data?.erreur || 'Erreur lors de la soumission' });
      })
      .finally(() => setSubmitting(false));
  };

  const resetForm = () => {
    setForm({ titre: '', description: '', urgence: 'NORMALE' });
    setSubmitted(false);
    setRecap(null);
    setErrors({});
  };

  if (submitted) {
    const recapUrgence = URGENCE_OPTIONS.find((o) => o.value === recap?.urgence);
    return (
      <>
        <style>{`
          .sd-success {
            max-width: 620px;
            background: var(--color-surface);
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(10, 21, 17, 0.08);
            text-align: center;
            animation: sdSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes sdSlideIn {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .sd-success-icon {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: rgba(11, 110, 79, 0.1);
            color: var(--color-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px auto;
            animation: sdPulse 2s ease-in-out infinite;
          }

          @keyframes sdPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(11, 110, 79, 0.2); }
            50% { box-shadow: 0 0 0 12px rgba(11, 110, 79, 0); }
          }

          .sd-success-title {
            font-size: 22px;
            font-weight: 700;
            color: var(--color-text);
            margin: 0 0 10px 0;
            font-family: var(--font-display);
          }

          .sd-success-text {
            font-size: 14px;
            color: var(--color-text-soft);
            line-height: 1.6;
            margin: 0 0 24px 0;
          }

          .sd-recap {
            background: var(--color-bg-strong);
            padding: 20px 24px;
            border-radius: 12px;
            text-align: left;
            margin-bottom: 24px;
            border-left: 4px solid var(--color-primary);
          }

          .sd-recap-label {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--color-text-soft);
            margin: 0 0 4px 0;
          }

          .sd-recap-value {
            font-size: 14px;
            color: var(--color-text);
            margin: 0 0 12px 0;
            line-height: 1.5;
          }

          .sd-recap-value:last-child {
            margin-bottom: 0;
          }

          .sd-recap-urgence {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 700;
            color: #fff;
          }

          .sd-success-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            border-radius: 10px;
            border: none;
            background: var(--color-primary);
            color: #fff;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .sd-success-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(11, 110, 79, 0.3);
          }
        `}</style>

        <div className="sd-success">
          <div className="sd-success-icon">
            <CheckCircle2 size={36} strokeWidth={2.5} />
          </div>
          <h1 className="sd-success-title">Demande envoyée avec succès</h1>
          <p className="sd-success-text">
            Votre demande a été enregistrée avec le statut <strong>En attente</strong>.<br />
            Vous recevrez un email dès qu'elle sera traitée par la cellule informatique.
          </p>

          {recap && (
            <div className="sd-recap">
              <p className="sd-recap-label">Titre</p>
              <p className="sd-recap-value">{recap.titre}</p>

              <p className="sd-recap-label">Niveau d'urgence</p>
              <div style={{ marginBottom: '12px' }}>
                <span
                  className="sd-recap-urgence"
                  style={{ background: recapUrgence?.color, color: recap.urgence === 'NORMALE' ? 'var(--color-text)' : '#fff' }}
                >
                  {recapUrgence && <recapUrgence.Icon size={12} strokeWidth={2.5} />}
                  {recapUrgence?.label}
                </span>
              </div>

              <p className="sd-recap-label">Description</p>
              <p className="sd-recap-value">{recap.description}</p>
            </div>
          )}

          <button onClick={resetForm} className="sd-success-btn">
            <Send size={16} />
            Soumettre une nouvelle demande
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .sd-header {
          margin-bottom: 28px;
        }

        .sd-title {
          font-size: 26px;
          color: var(--color-text);
          margin: 0 0 6px 0;
          font-family: var(--font-display);
          letter-spacing: -0.02em;
        }

        .sd-subtitle {
          font-size: 14px;
          color: var(--color-text-soft);
          margin: 0;
          line-height: 1.5;
        }

        .sd-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 620px;
          background: var(--color-surface);
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(10, 21, 17, 0.06);
          animation: sdFormIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes sdFormIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sd-error-banner {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(206, 17, 38, 0.08);
          border-left: 4px solid var(--color-accent-red);
          border-radius: 8px;
          font-size: 13px;
          color: var(--color-accent-red);
          font-weight: 500;
        }

        .sd-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sd-field-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .sd-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text);
        }

        .sd-hint {
          font-size: 11px;
          color: var(--color-text-soft);
          font-weight: 400;
        }

        .sd-input,
        .sd-textarea {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
          font-size: 15px;
          font-family: var(--font-body);
          background: var(--color-surface);
          color: var(--color-text);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .sd-input:hover,
        .sd-textarea:hover {
          border-color: rgba(11, 110, 79, 0.4);
        }

        .sd-input:focus,
        .sd-textarea:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(11, 110, 79, 0.12);
        }

        .sd-input.invalid,
        .sd-textarea.invalid {
          border-color: var(--color-accent-red);
        }

        .sd-input.invalid:focus,
        .sd-textarea.invalid:focus {
          box-shadow: 0 0 0 4px rgba(206, 17, 38, 0.14);
        }

        .sd-textarea {
          resize: vertical;
          min-height: 120px;
          line-height: 1.6;
        }

        .sd-error {
          font-size: 12px;
          color: var(--color-accent-red);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .sd-char-count {
          font-size: 11px;
          font-weight: 500;
          color: var(--color-text-soft);
          font-family: var(--font-mono, monospace);
        }

        .sd-char-count.warn {
          color: var(--color-accent-gold);
        }

        .sd-char-count.danger {
          color: var(--color-accent-red);
        }

        .sd-urgence-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .sd-urgence-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          padding: 14px 16px;
          border-radius: 12px;
          border: 2px solid var(--color-border);
          background: var(--color-surface);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          overflow: hidden;
        }

        .sd-urgence-card:hover {
          transform: translateY(-2px);
          border-color: rgba(11, 110, 79, 0.4);
        }

        .sd-urgence-card.active {
          border-color: currentColor;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
        }

        .sd-urgence-card.active::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 18px;
          height: 18px;
          background: currentColor;
          border-radius: 0 10px 0 12px;
        }

        .sd-urgence-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: currentColor;
        }

        .sd-urgence-icon svg {
          color: #fff;
          stroke: #fff;
        }
        .sd-urgence-label {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-text);
          margin: 0;
        }

        .sd-urgence-desc {
          font-size: 11px;
          color: var(--color-text-soft);
          margin: 0;
          line-height: 1.4;
        }

        .sd-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
          box-shadow: 0 8px 20px rgba(11, 110, 79, 0.22);
          align-self: flex-start;
        }

        .sd-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(11, 110, 79, 0.3);
        }

        .sd-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .sd-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .sd-urgence-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div>
        <div className="sd-header">
          <h1 className="sd-title">Soumettre une demande</h1>
          <p className="sd-subtitle">
            Décrivez votre problème technique. La cellule informatique vous répondra dans les plus brefs délais.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="sd-form" noValidate>
          {errors.general && (
            <div className="sd-error-banner">
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              {errors.general}
            </div>
          )}

          <div className="sd-field">
            <div className="sd-field-header">
              <label htmlFor="titre" className="sd-label">Titre de la demande</label>
              <span className="sd-hint">Résumé en une phrase</span>
            </div>
            <input
              id="titre"
              type="text"
              placeholder="Ex : Imprimante hors service au 2e étage"
              value={form.titre}
              onChange={handleChange('titre')}
              className={`sd-input ${errors.titre ? 'invalid' : ''}`}
              maxLength={120}
            />
            {errors.titre && (
              <span className="sd-error">
                <AlertCircle size={12} /> {errors.titre}
              </span>
            )}
          </div>

          <div className="sd-field">
            <div className="sd-field-header">
              <label htmlFor="description" className="sd-label">Description détaillée</label>
              <span className={`sd-char-count ${form.description.length > MAX_DESC * 0.9 ? 'warn' : ''} ${form.description.length >= MAX_DESC ? 'danger' : ''}`}>
                {form.description.length} / {MAX_DESC}
              </span>
            </div>
            <textarea
              id="description"
              placeholder="Décrivez le problème en détail : depuis quand, quel appareil, quelles circonstances, quelles étapes avez-vous déjà essayées..."
              value={form.description}
              onChange={handleChange('description')}
              className={`sd-textarea ${errors.description ? 'invalid' : ''}`}
              rows={6}
              maxLength={MAX_DESC}
            />
            {errors.description && (
              <span className="sd-error">
                <AlertCircle size={12} /> {errors.description}
              </span>
            )}
          </div>

          <div className="sd-field">
            <div className="sd-field-header">
              <label className="sd-label">Niveau d'urgence</label>
              <span className="sd-hint">Choisissez selon l'impact</span>
            </div>
            <div className="sd-urgence-grid">
              {URGENCE_OPTIONS.map((opt) => {
                const Icon = opt.Icon;
                const active = form.urgence === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, urgence: opt.value })}
                    className={`sd-urgence-card ${active ? 'active' : ''}`}
                    style={{ color: opt.color }}
                  >
                    <span className="sd-urgence-icon">
                      <Icon size={18} strokeWidth={2.5} />
                    </span>
                    <p className="sd-urgence-label">{opt.label}</p>
                    <p className="sd-urgence-desc">{opt.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit" className="sd-submit" disabled={submitting}>
            <Send size={16} />
            {submitting ? 'Envoi en cours...' : 'Envoyer la demande'}
          </button>
        </form>
      </div>
    </>
  );
}