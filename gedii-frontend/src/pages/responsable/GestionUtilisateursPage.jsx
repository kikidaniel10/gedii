import { useState } from 'react';
import { Check, X, Search } from 'lucide-react';

// Donnees fictives temporaires - seront remplacees par des appels API
const COMPTES_EN_ATTENTE_TEMP = [
  {
    id: 1,
    nom: 'Sarah Ondoa',
    matricule: 'MC-2201',
    email: 'sarah.ondoa@mincom.cm',
    service: 'Direction de la Communication',
    dateCreation: '2026-08-18',
  },
  {
    id: 2,
    nom: 'Éric Talla',
    matricule: 'MC-2202',
    email: 'eric.talla@mincom.cm',
    service: 'Cellule Informatique',
    dateCreation: '2026-08-19',
  },
];

const COMPTES_ACTIFS_TEMP = [
  {
    id: 10,
    nom: 'Jean Mballa',
    matricule: 'MC-1001',
    email: 'jean.mballa@mincom.cm',
    service: 'Direction de la Communication',
    role: 'AGENT',
    dateValidation: '2026-06-02',
  },
  {
    id: 11,
    nom: 'Paul Nkeng',
    matricule: 'MC-1002',
    email: 'paul.nkeng@mincom.cm',
    service: 'Cellule Informatique',
    role: 'TECHNICIEN',
    dateValidation: '2026-05-14',
  },
  {
    id: 12,
    nom: 'Marie Fotso',
    matricule: 'MC-1003',
    email: 'marie.fotso@mincom.cm',
    service: 'Service du Personnel',
    role: 'AGENT',
    dateValidation: '2026-07-20',
  },
];

const ROLE_LABEL = {
  AGENT: 'Agent',
  TECHNICIEN: 'Technicien',
  RESPONSABLE: 'Responsable',
};

export default function GestionUtilisateursPage() {
  const [onglet, setOnglet] = useState('attente');
  const [comptesEnAttente, setComptesEnAttente] = useState(COMPTES_EN_ATTENTE_TEMP);
  const [comptesActifs] = useState(COMPTES_ACTIFS_TEMP);
  const [confirmAction, setConfirmAction] = useState(null);
  const [recherche, setRecherche] = useState('');

  const handleAction = (id, type) => {
    // Branchement sur utilisateurService.validerCompte() / rejeterCompte() a l'etape backend
    console.log(`Compte ${id} : ${type}`);
    setComptesEnAttente(comptesEnAttente.filter((c) => c.id !== id));
    setConfirmAction(null);
  };

  const comptesActifsFiltres = comptesActifs.filter(
    (c) =>
      c.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      c.matricule.toLowerCase().includes(recherche.toLowerCase()) ||
      c.service.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div>
      <h1 style={styles.title}>Gestion des utilisateurs</h1>
      <p style={styles.pageSubtitle}>
        Validez les nouveaux comptes ou consultez les utilisateurs déjà actifs.
      </p>

      <div style={styles.tabs}>
        <button
          onClick={() => setOnglet('attente')}
          style={{ ...styles.tab, ...(onglet === 'attente' ? styles.tabActive : {}) }}
        >
          En attente
          {comptesEnAttente.length > 0 && (
            <span style={styles.tabBadge}>{comptesEnAttente.length}</span>
          )}
        </button>
        <button
          onClick={() => setOnglet('actifs')}
          style={{ ...styles.tab, ...(onglet === 'actifs' ? styles.tabActive : {}) }}
        >
          Comptes actifs ({comptesActifs.length})
        </button>
      </div>

      {onglet === 'attente' && (
        <>
          {comptesEnAttente.length === 0 ? (
            <p style={styles.empty}>Aucun compte en attente pour le moment.</p>
          ) : (
            <div style={styles.list}>
              {comptesEnAttente.map((c) => {
                const isConfirming = confirmAction?.id === c.id;
                return (
                  <div key={c.id} style={styles.card}>
                    <div style={styles.cardMain}>
                      <div style={styles.avatar}>
                        {c.nom.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <div>
                        <h3 style={styles.cardTitle}>{c.nom}</h3>
                        <p style={styles.cardMeta}>{c.matricule} · {c.email}</p>
                        <p style={styles.cardMeta}>
                          {c.service} · Inscrit le {new Date(c.dateCreation).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    {isConfirming ? (
                      <div style={styles.confirmBox}>
                        <span style={styles.confirmText}>
                          Confirmer : {confirmAction.type === 'valider' ? 'activer' : 'rejeter'} ce compte ?
                        </span>
                        <div style={styles.confirmActions}>
                          <button
                            onClick={() => handleAction(c.id, confirmAction.type)}
                            style={{
                              ...styles.confirmBtn,
                              background:
                                confirmAction.type === 'valider'
                                  ? 'var(--color-primary)'
                                  : 'var(--color-accent-red)',
                            }}
                          >
                            Oui, confirmer
                          </button>
                          <button onClick={() => setConfirmAction(null)} style={styles.cancelBtn}>
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={styles.actions}>
                        <button
                          onClick={() => setConfirmAction({ id: c.id, type: 'valider' })}
                          style={styles.validerBtn}
                        >
                          <Check size={16} />
                          Activer
                        </button>
                        <button
                          onClick={() => setConfirmAction({ id: c.id, type: 'rejeter' })}
                          style={styles.rejeterBtn}
                        >
                          <X size={16} />
                          Rejeter
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {onglet === 'actifs' && (
        <>
          <div style={styles.searchBox}>
            <Search size={16} color="var(--color-text-soft)" />
            <input
              type="text"
              placeholder="Rechercher par nom, matricule ou service..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {comptesActifsFiltres.length === 0 ? (
            <p style={styles.empty}>Aucun utilisateur ne correspond à cette recherche.</p>
          ) : (
            <div style={styles.table}>
              <div style={styles.tableHeader}>
                <span style={{ flex: 2 }}>Utilisateur</span>
                <span style={{ flex: 1.5 }}>Service</span>
                <span style={{ flex: 1 }}>Rôle</span>
                <span style={{ flex: 1 }}>Actif depuis</span>
              </div>
              {comptesActifsFiltres.map((c) => (
                <div key={c.id} style={styles.tableRow}>
                  <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={styles.avatarSmall}>
                      {c.nom.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <div>
                      <p style={styles.rowName}>{c.nom}</p>
                      <p style={styles.rowSub}>{c.matricule}</p>
                    </div>
                  </div>
                  <span style={{ flex: 1.5, fontSize: '13px', color: 'var(--color-text-soft)' }}>
                    {c.service}
                  </span>
                  <span style={{ flex: 1 }}>
                    <span style={styles.roleBadge}>{ROLE_LABEL[c.role]}</span>
                  </span>
                  <span style={{ flex: 1, fontSize: '13px', color: 'var(--color-text-soft)' }}>
                    {new Date(c.dateValidation).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  title: { fontSize: '24px', color: 'var(--color-text)', marginBottom: '6px' },
  pageSubtitle: { fontSize: '14px', color: 'var(--color-text-soft)', marginBottom: '20px' },
  tabs: { display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)' },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 4px',
    marginRight: '20px',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    fontSize: '14px',
    color: 'var(--color-text-soft)',
    fontWeight: 500,
  },
  tabActive: {
    color: 'var(--color-primary)',
    borderBottomColor: 'var(--color-primary)',
    fontWeight: 600,
  },
  tabBadge: {
    background: 'var(--color-accent-red)',
    color: 'var(--color-surface)',
    fontSize: '11px',
    fontWeight: 700,
    padding: '1px 7px',
    borderRadius: '999px',
  },
  list: { display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '680px' },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'var(--color-surface)',
    padding: '18px 20px',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-card)',
    flexWrap: 'wrap',
    gap: '14px',
  },
  cardMain: { display: 'flex', alignItems: 'center', gap: '14px' },
  avatar: {
    width: '42px',
    height: '42px',
    minWidth: '42px',
    borderRadius: '50%',
    background: 'var(--color-primary)',
    color: 'var(--color-surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 600,
  },
  cardTitle: { fontSize: '15px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px 0' },
  cardMeta: { fontSize: '12px', color: 'var(--color-text-soft)', margin: 0 },
  actions: { display: 'flex', gap: '8px' },
  validerBtn: {
    display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px',
    borderRadius: '6px', border: 'none', background: 'var(--color-primary)',
    color: 'var(--color-surface)', fontSize: '13px', fontWeight: 600,
  },
  rejeterBtn: {
    display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px',
    borderRadius: '6px', border: '1px solid var(--color-accent-red)', background: 'transparent',
    color: 'var(--color-accent-red)', fontSize: '13px', fontWeight: 600,
  },
  confirmBox: {
    background: 'var(--color-bg-strong)', borderRadius: '8px', padding: '12px 14px',
    display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
  },
  confirmText: { fontSize: '13px', color: 'var(--color-text)', fontWeight: 500 },
  confirmActions: { display: 'flex', gap: '8px' },
  confirmBtn: {
    padding: '7px 14px', borderRadius: '6px', border: 'none',
    color: 'var(--color-surface)', fontSize: '13px', fontWeight: 600,
  },
  cancelBtn: {
    padding: '7px 14px', borderRadius: '6px', border: '1px solid var(--color-border)',
    background: 'transparent', color: 'var(--color-text-soft)', fontSize: '13px',
  },
  empty: { color: 'var(--color-text-soft)', fontSize: '14px' },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '360px',
    padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)',
    background: 'var(--color-surface)', marginBottom: '20px',
  },
  searchInput: {
    border: 'none', outline: 'none', flex: 1, fontSize: '14px',
    background: 'transparent', color: 'var(--color-text)',
  },
  table: { maxWidth: '760px', background: 'var(--color-surface)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' },
  tableHeader: {
    display: 'flex', padding: '12px 20px', background: 'var(--color-bg-strong)',
    fontSize: '12px', fontWeight: 600, color: 'var(--color-text-soft)', textTransform: 'uppercase',
  },
  tableRow: {
    display: 'flex', alignItems: 'center', padding: '14px 20px',
    borderTop: '1px solid var(--color-border)',
  },
  avatarSmall: {
    width: '32px', height: '32px', minWidth: '32px', borderRadius: '50%',
    background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: 600,
  },
  rowName: { fontSize: '14px', fontWeight: 500, color: 'var(--color-text)', margin: 0 },
  rowSub: { fontSize: '12px', color: 'var(--color-text-soft)', margin: 0 },
  roleBadge: {
    fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '999px',
    background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)',
  },
};