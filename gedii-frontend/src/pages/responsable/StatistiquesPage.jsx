import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle2, Users } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend,
} from 'recharts';
import { statistiqueService } from '../../services/statistiqueService';

const COLORS = {
  resolue: '#0B6E4F',
  enCours: '#FCD116',
  enAttente: '#a7d9c4',
  rejetee: '#CE1126',
};

export default function StatistiquesPage() {
  const [stats, setStats] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      statistiqueService.getStatistiques(),
      statistiqueService.getPerformanceTechniciens(),
    ])
      .then(([statsData, perfData]) => {
        setStats(statsData);
        setPerformance(perfData);
      })
      .catch(() => {
        setStats(null);
        setPerformance([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={styles.empty}>Chargement...</p>;
  if (!stats) return <p style={styles.empty}>Impossible de charger les statistiques.</p>;

  const repartitionStatut = [
    { name: 'Résolues', value: stats.resolues ?? 0, color: COLORS.resolue },
    { name: 'En cours', value: stats.enCours ?? 0, color: COLORS.enCours },
    { name: 'En attente', value: stats.enAttente ?? 0, color: COLORS.enAttente },
    { name: 'Rejetées', value: stats.rejetees ?? 0, color: COLORS.rejetee },
  ];

  const demandesParService = stats.demandesParService ?? [];
  const evolutionMensuelle = stats.evolutionMensuelle ?? [];

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
            <p style={styles.kpiValue}>{stats.totalDemandes ?? 0}</p>
            <p style={styles.kpiLabel}>Demandes totales</p>
          </div>
        </div>
        <div style={styles.kpiCard}>
          <div style={{ ...styles.kpiIcon, background: 'rgba(252, 209, 22, 0.18)' }}>
            <Clock size={20} color="#8a6d00" />
          </div>
          <div>
            <p style={styles.kpiValue}>{Math.round(stats.delaiMoyenHeures ?? 0)}h</p>
            <p style={styles.kpiLabel}>Délai moyen de traitement</p>
          </div>
        </div>
        <div style={styles.kpiCard}>
          <div style={{ ...styles.kpiIcon, background: 'var(--color-primary-soft)' }}>
            <CheckCircle2 size={20} color="var(--color-primary-dark)" />
          </div>
          <div>
            <p style={styles.kpiValue}>{Math.round(stats.tauxResolution ?? 0)}%</p>
            <p style={styles.kpiLabel}>Taux de résolution</p>
          </div>
        </div>
        <div style={styles.kpiCard}>
          <div style={{ ...styles.kpiIcon, background: 'rgba(206, 17, 38, 0.1)' }}>
            <Users size={20} color="var(--color-accent-red)" />
          </div>
          <div>
            <p style={styles.kpiValue}>{stats.enAttente ?? 0}</p>
            <p style={styles.kpiLabel}>En attente de traitement</p>
          </div>
        </div>
      </div>

      <div style={styles.twoColumns}>
        <div style={styles.panel}>
          <p style={styles.sectionTitle}>Répartition par statut</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={repartitionStatut} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {repartitionStatut.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.panel}>
          <p style={styles.sectionTitle}>Demandes par service</p>
          {demandesParService.length === 0 ? (
            <p style={styles.empty}>Pas de données.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={demandesParService} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--color-text-soft)' }} />
                <YAxis type="category" dataKey="service" width={110} tick={{ fontSize: 12, fill: 'var(--color-text-soft)' }} />
                <Tooltip />
                <Bar dataKey="total" fill="#0B6E4F" radius={[0, 6, 6, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {evolutionMensuelle.length > 0 && (
        <div style={styles.panelWide}>
          <p style={styles.sectionTitle}>Évolution des demandes (5 derniers mois)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={evolutionMensuelle}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="mois" tick={{ fontSize: 12, fill: 'var(--color-text-soft)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-soft)' }} />
              <Tooltip />
              <Line type="monotone" dataKey="demandes" stroke="#0B6E4F" strokeWidth={2.5} dot={{ r: 4, fill: '#0B6E4F' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={styles.panelWide}>
        <p style={styles.sectionTitle}>Performance des techniciens</p>
        {performance.length === 0 ? (
          <p style={styles.empty}>Aucune donnée de performance disponible.</p>
        ) : (
          <div style={styles.techList}>
            {performance.map((t) => (
              <div key={t.nom} style={styles.techRow}>
                <div style={styles.avatarSmall}>
                  {t.nom.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={styles.techName}>{t.nom}</p>
                  <p style={styles.techMeta}>
                    {t.interventionsResolues} interventions résolues · délai moyen {Math.round(t.delaiMoyenHeures)}h
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  title: { fontSize: '24px', color: 'var(--color-text)', marginBottom: '6px' },
  pageSubtitle: { fontSize: '14px', color: 'var(--color-text-soft)', marginBottom: '28px' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' },
  kpiCard: { display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--color-surface)', padding: '18px 20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)' },
  kpiIcon: { width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  kpiValue: { fontSize: '22px', fontWeight: 700, color: 'var(--color-text)', margin: 0, fontFamily: 'var(--font-display)' },
  kpiLabel: { fontSize: '12px', color: 'var(--color-text-soft)', margin: '2px 0 0 0' },
  twoColumns: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '900px', marginBottom: '20px' },
  panel: { background: 'var(--color-surface)', padding: '20px 24px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)' },
  panelWide: { background: 'var(--color-surface)', padding: '20px 24px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)', maxWidth: '900px', marginBottom: '20px' },
  sectionTitle: { fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '14px' },
  techList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  techRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatarSmall: { width: '36px', height: '36px', minWidth: '36px', borderRadius: '50%', background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600 },
  techName: { fontSize: '13px', fontWeight: 500, color: 'var(--color-text)', margin: 0 },
  techMeta: { fontSize: '12px', color: 'var(--color-text-soft)', margin: '2px 0 0 0' },
  empty: { color: 'var(--color-text-soft)', fontSize: '14px' },
};