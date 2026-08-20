import { useState } from 'react';
import { Play, CheckCircle2, FileEdit } from 'lucide-react';

// Donnees fictives temporaires - seront remplacees par un appel a interventionService.getMesInterventions()
const INTERVENTIONS_TEMP = [
  {
    id: 1,
    titre: 'Imprimante hors service au 2e étage',
    urgence: 'URGENTE',
    statut: 'ASSIGNEE',
    agentNom: 'Jean Mballa',
    dateAssignation: '2026-08-19',
    compteRendu: '',
  },
  {
    id: 2,
    titre: 'Écran qui clignote par intermittence',
    urgence: 'NORMALE',
    statut: 'EN_COURS',
    agentNom: 'Paul Nkeng',
    dateAssignation: '2026-08-18',
    compteRendu: '',
  },
  {
    id: 3,
    titre: 'Problème réseau bureau 204',
    urgence: 'URGENTE',
    statut: 'EN_COURS',
    agentNom: 'Marie Fotso',
    dateAssignation: '2026-08-17',
    compteRendu: '',
  },
];

const URGENCE_CONFIG = {
  FAIBLE: { label: 'Faible', color: 'var(--color-primary)' },
  NORMALE: { label: 'Normale', color: 'var(--color-accent-gold)' },
  URGENTE: { label: 'Urgente', color: 'var(--color-accent-red)' },
};

const STATUT_CONFIG = {
  ASSIGNEE: { label: 'À démarrer', color: 'var(--color-primary-soft)', text: 'var(--color-primary-dark)' },
  EN_COURS: { label: 'En cours', color: 'var(--color-accent-gold)', text: 'var(--color-text)' },
  TERMINEE: { label: 'Terminée', color: 'var(--color-primary)', text: 'var(--color-surface)' },
};

export default function InterventionsAssigneesPage() {
  const [interventions, setInterventions] = useState(INTERVENTIONS_TEMP);
  const [ouvertId, setOuvertId] = useState(null);
  const [compteRenduDraft, setCompteRenduDraft] = useState('');

  const demarrer = (id) => {
    // Branchement sur interventionService.updateStatut(id, 'EN_COURS') a l'etape backend
    setInterventions(
      interventions.map((it) => (it.id === id ? { ...it, statut: 'EN_COURS' } : it))
    );
  };

  const ouvrirCloture = (it) => {
    setOuvertId(it.id);
    setCompteRenduDraft(it.compteRendu || '');
  };

  const confirmerCloture = (id) => {
    if (!compteRenduDraft.trim()) return;
    // Branchement sur interventionService.cloturer(id, compteRendu) a l'etape backend
    // -> mettra aussi a jour le statut de la Demande a "Resolue" et notifiera l'agent
    setInterventions(
      interventions.map((it) =>
        it.id === id ? { ...it, statut: 'TERMINEE', compteRendu: compteRenduDraft } : it
      )
    );
    setOuvertId(null);
    setCompteRenduDraft('');
  };

  const actives = interventions.filter((it) => it.statut !== 'TERMINEE');
  const terminees = interventions.filter((it) => it.statut === 'TERMINEE');

  return (
    <div>
      <h1 style={styles.title}>Mes interventions</h1>
      <p style={styles.pageSubtitle}>
        {actives.length} intervention{actives.length !== 1 ? 's' : ''} en cours ou à démarrer
      </p>

      {actives.length === 0 ? (
        <p style={styles.empty}>Aucune intervention active pour le moment.</p>
      ) : (
        <div style={styles.list}>
          {actives.map((it) => {
            const urgenceCfg = URGENCE_CONFIG[it.urgence];
            const statutCfg = STATUT_CONFIG[it.statut];
            const isOuvert = ouvertId === it.id;

            return (
              <div key={it.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardTitle}>{it.titre}</h3>
                    <p style={styles.cardMeta}>
                      Demandé par <strong>{it.agentNom}</strong> · Assignée le{' '}
                      {new Date(it.dateAssignation).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div style={styles.badges}>
                    <span style={{ ...styles.badge, background: urgenceCfg.color, color: 'var(--color-surface)' }}>
                      {urgenceCfg.label}
                    </span>
                    <span style={{ ...styles.badge, background: statutCfg.color, color: statutCfg.text }}>
                      {statutCfg.label}
                    </span>
                  </div>
                </div>

                {isOuvert ? (
                  <div style={styles.crBox}>
                    <label style={styles.crLabel}>Compte-rendu de l'intervention</label>
                    <textarea
                      value={compteRenduDraft}
                      onChange={(e) => setCompteRenduDraft(e.target.value)}
                      placeholder="Décrivez ce qui a été fait pour résoudre le problème..."
                      style={styles.textarea}
                      rows={4}
                    />
                    <div style={styles.crActions}>
                      <button
                        onClick={() => confirmerCloture(it.id)}
                        disabled={!compteRenduDraft.trim()}
                        style={{
                          ...styles.terminerBtn,
                          opacity: compteRenduDraft.trim() ? 1 : 0.5,
                          cursor: compteRenduDraft.trim() ? 'pointer' : 'not-allowed',
                        }}
                      >
                        <CheckCircle2 size={16} />
                        Clôturer l'intervention
                      </button>
                      <button onClick={() => setOuvertId(null)} style={styles.cancelBtn}>
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={styles.actions}>
                    {it.statut === 'ASSIGNEE' && (
                      <button onClick={() => demarrer(it.id)} style={styles.demarrerBtn}>
                        <Play size={16} />
                        Démarrer l'intervention
                      </button>
                    )}
                    {it.statut === 'EN_COURS' && (
                      <button onClick={() => ouvrirCloture(it)} style={styles.terminerBtn}>
                        <FileEdit size={16} />
                        Ajouter compte-rendu & clôturer
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {terminees.length > 0 && (
        <>
          <p style={styles.sectionTitle}>Terminées récemment</p>
          <div style={styles.list}>
            {terminees.map((it) => (
              <div key={it.id} style={{ ...styles.card, opacity: 0.75 }}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardTitle}>{it.titre}</h3>
                    <p style={styles.cardMeta}>Pour {it.agentNom}</p>
                  </div>
                  <span style={{ ...styles.badge, background: 'var(--color-primary)', color: 'var(--color-surface)' }}>
                    Terminée
                  </span>
                </div>
                <p style={styles.crReadonly}>{it.compteRendu}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  title: { fontSize: '24px', color: 'var(--color-text)', marginBottom: '6px' },
  pageSubtitle: { fontSize: '14px', color: 'var(--color-text-soft)', marginBottom: '24px' },
  sectionTitle: { fontSize: '14px', fontWeight: 600, color: 'var(--color-text-soft)', margin: '28px 0 12px 0' },
  list: { display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '680px' },
  card: {
    background: 'var(--color-surface)',
    padding: '20px 22px',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-card)',
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    gap: '12px', marginBottom: '14px', flexWrap: 'wrap',
  },
  cardTitle: { fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px 0' },
  cardMeta: { fontSize: '12px', color: 'var(--color-text-soft)', margin: 0 },
  badges: { display: 'flex', gap: '6px', flexShrink: 0 },
  badge: {
    padding: '4px 10px', borderRadius: '999px', fontSize: '11px',
    fontWeight: 600, whiteSpace: 'nowrap', height: 'fit-content',
  },
  actions: { display: 'flex', gap: '10px' },
  demarrerBtn: {
    display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px',
    borderRadius: '6px', border: 'none', background: 'var(--color-primary)',
    color: 'var(--color-surface)', fontSize: '14px', fontWeight: 600,
  },
  terminerBtn: {
    display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px',
    borderRadius: '6px', border: 'none', background: 'var(--color-primary)',
    color: 'var(--color-surface)', fontSize: '14px', fontWeight: 600,
  },
  cancelBtn: {
    padding: '9px 16px', borderRadius: '6px', border: '1px solid var(--color-border)',
    background: 'transparent', color: 'var(--color-text-soft)', fontSize: '14px',
  },
  crBox: { display: 'flex', flexDirection: 'column', gap: '10px' },
  crLabel: { fontSize: '13px', fontWeight: 500, color: 'var(--color-text)' },
  textarea: {
    padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-border)',
    fontSize: '14px', fontFamily: 'var(--font-body)', background: 'var(--color-surface)',
    color: 'var(--color-text)', resize: 'vertical',
  },
  crActions: { display: 'flex', gap: '10px' },
  crReadonly: {
    fontSize: '13px', color: 'var(--color-text-soft)', background: 'var(--color-bg-strong)',
    padding: '10px 12px', borderRadius: '6px', margin: 0,
  },
  empty: { color: 'var(--color-text-soft)', fontSize: '14px' },
};