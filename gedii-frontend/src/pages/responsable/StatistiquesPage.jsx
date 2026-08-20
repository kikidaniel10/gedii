import { FileText, Clock, CheckCircle2, Users } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend,
} from 'recharts';

// Donnees fictives temporaires - seront remplacees par un appel a statistiqueService.getStatistiques()
const STATS_TEMP = {
  totalDemandes: 47,
  enAttente: 5,
  enCours: 8,
  resolues: 31,
  rejetees: 3,
  delaiMoyenHeures: 18,
  tauxResolution: 82,
};

const REPARTITION_STATUT = [
  { name: 'Résolues', value: STATS_TEMP.resolues, color: 'var(--color-primary)' },
  { name: 'En cours', value: STATS_TEMP.enCours, color: '#FCD116' },
  { name: 'En attente', value: STATS_TEMP.enAttente, color: '#a7d9c4' },
  { name: 'Rejetées', value: STATS_TEMP.rejetees, color: 'var(--color-accent-red)' },
];

const DEMANDES_PAR_SERVICE = [
  { service: 'Direction Comm.', total: 18 },
  { service: 'Cellule Info', total: 12 },
  { service: 'Personnel', total: 17 },
];

const EVOLUTION_MENSUELLE = [
  { mois: 'Avr', demandes: 6 },
  { mois: 'Mai', demandes: 9 },
  { mois: 'Juin', demandes: 7 },
  { mois: 'Juil', demandes: 11 },
  { mois: 'Août', demandes: 14 },
];

const PERFORMANCE_TECHNICIENS_TEMP = [
  { nom: 'Paul Nkeng', resolues: 14, delaiMoyenHeures: 12 },
  { nom: 'André Biya', resolues: 11, delaiMoyenHeures: 22 },
  { nom: 'Christelle Manga', resolues: 6, delaiMoyenHeures: 16 },
];

// Couleurs "en dur" pour Recharts (les var(--...) CSS ne sont pas lues par la lib elle-meme)
const COLORS = {
  resolue: '#0B6E4F',
  enCours: '#FCD116',
  enAttente: '#a7d9c4',
  rejetee: '#CE1126',
};

export default function StatistiquesPage() {
  return (
    <div>
      <h1 style={styles.title}>Statistiques</h1>
      <p style={styles.pageSubtitle}>Vue d'ensemble de l'activité de la cellule informatique.</p>

      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}>
          <div style={{ ...styles.kpiIcon, background: 'var(--color-primary-soft)' }}>
            <FileText size={20} color="var(--color-primary-dark)" />
          </div>
          <div>
            <p style={styles.kpiValue}>{STATS_TEMP.totalDemandes}</p>
            <p style={styles.kpiLabel}>Demandes totales</p>
          </div>
        </div>
        <div style={styles.kpiCard}>
          <div style={{ ...styles.kpiIcon, background: 'rgba(252, 209, 22, 0.18)' }}>
            <Clock size={20} color="#8a6d00" />
          </div>
          <div>
            <p style={styles.kpiValue}>{STATS_TEMP.delaiMoyenHeures}h</p>
            <p style={styles.kpiLabel}>Délai moyen de traitement</p>
          </div>
        </div>
        <div style={styles.kpiCard}>
          <div style={{ ...styles.kpiIcon, background: 'var(--color-primary-soft)' }}>
            <CheckCircle2 size={20} color="var(--color-primary-dark)" />
          </div>
          <div>
            <p style={styles.kpiValue}>{STATS_TEMP.tauxResolution}%</p>
            <p style={styles.kpiLabel}>Taux de résolution</p>
          </div>
        </div>
        <div style={styles.kpiCard}>
          <div style={{ ...styles.kpiIcon, background: 'rgba(206, 17, 38, 0.1)' }}>
            <Users size={20} color="var(--color-accent-red)" />
          </div>
          <div>
            <p style={styles.kpiValue}>{STATS_TEMP.enAttente}</p>
            <p style={styles.kpiLabel}>En attente de traitement</p>
          </div>
        </div>
      </div>

      <div style={styles.twoColumns}>
        <div style={styles.panel}>
          <p style={styles.sectionTitle}>Répartition par statut</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={REPARTITION_STATUT}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {REPARTITION_STATUT.map((entry, index) => (
                  <Cell key={index} fill={Object.values(COLORS)[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.panel}>
          <p style={styles.sectionTitle}>Demandes par service</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={DEMANDES_PAR_SERVICE} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--color-text-soft)' }} />
              <YAxis
                type="category"
                dataKey="service"
                width={110}
                tick={{ fontSize: 12, fill: 'var(--color-text-soft)' }}
              />
              <Tooltip />
              <Bar dataKey="total" fill="#0B6E4F" radius={[0, 6, 6, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.panelWide}>
        <p style={styles.sectionTitle}>Évolution des demandes (5 derniers mois)</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={EVOLUTION_MENSUELLE}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="mois" tick={{ fontSize: 12, fill: 'var(--color-text-soft)' }} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-soft)' }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="demandes"
              stroke="#0B6E4F"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#0B6E4F' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={styles.panelWide}>
        <p style={styles.sectionTitle}>Performance des techniciens</p>
        <div style={styles.techList}>
          {PERFORMANCE_TECHNICIENS_TEMP.map((t) => (
            <div key={t.nom} style={styles.techRow}>
              <div style={styles.avatarSmall}>
                {t.nom.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={styles.techName}>{t.nom}</p>
                <p style={styles.techMeta}>
                  {t.resolues} interventions résolues · délai moyen {t.delaiMoyenHeures}h
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  title: { fontSize: '24px', color: 'var(--color-text)', marginBottom: '6px' },
  pageSubtitle: { fontSize: '14px', color: 'var(--color-text-soft)', marginBottom: '28px' },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '28px',
  },
  kpiCard: {
    display: 'flex', alignItems: 'center', gap: '14px',
    background: 'var(--color-surface)', padding: '18px 20px',
    borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)',
  },
  kpiIcon: { width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  kpiValue: { fontSize: '22px', fontWeight: 700, color: 'var(--color-text)', margin: 0, fontFamily: 'var(--font-display)' },
  kpiLabel: { fontSize: '12px', color: 'var(--color-text-soft)', margin: '2px 0 0 0' },
  twoColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    maxWidth: '900px',
    marginBottom: '20px',
  },
  panel: {
    background: 'var(--color-surface)',
    padding: '20px 24px',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-card)',
  },
  panelWide: {
    background: 'var(--color-surface)',
    padding: '20px 24px',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-card)',
    maxWidth: '900px',
    marginBottom: '20px',
  },
  sectionTitle: { fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '14px' },
  techList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  techRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatarSmall: {
    width: '36px', height: '36px', minWidth: '36px', borderRadius: '50%',
    background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: 600,
  },
  techName: { fontSize: '13px', fontWeight: 500, color: 'var(--color-text)', margin: 0 },
  techMeta: { fontSize: '12px', color: 'var(--color-text-soft)', margin: '2px 0 0 0' },
};