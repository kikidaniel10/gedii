import { useState, useEffect } from 'react';
import {
  FileText, Clock, CheckCircle2, Users, Download, TrendingUp, TrendingDown,
  Calendar, Filter, X, RefreshCw, BarChart3,
} from 'lucide-react';
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

const PERIODES = [
  { value: '7j', label: '7 jours' },
  { value: '30j', label: '30 jours' },
  { value: '3m', label: '3 mois' },
  { value: '6m', label: '6 mois' },
  { value: '1a', label: '1 an' },
];

// Tooltip personnalisé pour Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.98)',
      border: '1px solid var(--color-border)',
      borderRadius: '10px',
      padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(10, 21, 17, 0.15)',
      fontSize: '12px',
      fontFamily: 'var(--font-body)',
    }}>
      {label && (
        <p style={{ margin: '0 0 6px 0', fontWeight: 700, color: 'var(--color-text)' }}>
          {label}
        </p>
      )}
      {payload.map((entry, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color || entry.payload?.color }} />
          <span style={{ color: 'var(--color-text-soft)' }}>{entry.name} :</span>
          <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// Calcule le delta (variation) entre 2 valeurs
const calcDelta = (actuel, precedent) => {
  if (precedent === 0) return actuel > 0 ? 100 : 0;
  return ((actuel - precedent) / precedent) * 100;
};

export default function StatistiquesPage() {
  const [stats, setStats] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [services, setServices] = useState([]);
  const [periode, setPeriode] = useState('30j');
  const [service, setService] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const loadData = async (showFullLoader = true) => {
    if (showFullLoader) setLoading(true);
    else setRefreshing(true);
    try {
      const [statsData, perfData] = await Promise.all([
        statistiqueService.getStatistiques(periode, service || null),
        statistiqueService.getPerformanceTechniciens(),
      ]);
      setStats(statsData);
      setPerformance(perfData);
    } catch {
      setStats(null);
      setPerformance([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    statistiqueService.getListeServices().then(setServices).catch(() => setServices([]));
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periode, service]);

  const handleDownloadRapport = async () => {
    setDownloading(true);
    try {
      const blob = await statistiqueService.downloadRapport();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'rapport-statistiques.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert('Erreur lors du téléchargement du rapport');
    } finally {
      setDownloading(false);
    }
  };

  const exportCSV = () => {
    if (!stats) return;
    const lignes = [
      ['Indicateur', 'Valeur'],
      ['Demandes totales', stats.totalDemandes],
      ['En attente', stats.enAttente],
      ['En cours', stats.enCours],
      ['Résolues', stats.resolues],
      ['Rejetées', stats.rejetees],
      ['Taux de résolution (%)', Math.round(stats.tauxResolution)],
      ['Délai moyen (h)', Math.round(stats.delaiMoyenHeures)],
      [],
      ['Service', 'Demandes'],
      ...(stats.demandesParService || []).map((e) => [e.service, e.total]),
      [],
      ['Mois', 'Demandes'],
      ...(stats.evolutionMensuelle || []).map((e) => [e.mois, e.demandes]),
    ];
    const csv = lignes.map((l) => l.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `statistiques-${periode || 'tout'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-text-soft)' }}>
        <div style={{
          width: 36, height: 36,
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px auto',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        Chargement des statistiques...
      </div>
    );
  }

  if (!stats) {
    return <p style={{ color: 'var(--color-text-soft)', fontSize: 14, padding: 40 }}>Impossible de charger les statistiques.</p>;
  }

  const repartitionStatut = [
    { name: 'Résolues', value: stats.resolues ?? 0, color: COLORS.resolue },
    { name: 'En cours', value: stats.enCours ?? 0, color: COLORS.enCours },
    { name: 'En attente', value: stats.enAttente ?? 0, color: COLORS.enAttente },
    { name: 'Rejetées', value: stats.rejetees ?? 0, color: COLORS.rejetee },
  ];

  const demandesParService = stats.demandesParService ?? [];
  const evolutionMensuelle = stats.evolutionMensuelle ?? [];

  // Deltas
  const deltaTotal = calcDelta(stats.totalDemandes, stats.totalDemandesPrecedente ?? 0);
  const deltaResolues = calcDelta(stats.resolues, stats.resoluesPrecedente ?? 0);

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes statFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .stat-title {
          font-size: 26px;
          color: var(--color-text);
          margin: 0 0 6px 0;
          font-family: var(--font-display);
          letter-spacing: -0.02em;
        }

        .stat-subtitle {
          font-size: 14px;
          color: var(--color-text-soft);
          margin: 0;
        }

        .stat-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .stat-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 10px;
          border: none;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
        }

        .stat-btn-primary {
          background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: #fff;
          box-shadow: 0 6px 16px rgba(11, 110, 79, 0.24);
        }

        .stat-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(11, 110, 79, 0.32);
        }

        .stat-btn-outline {
          background: var(--color-surface);
          color: var(--color-text);
          border: 1px solid var(--color-border);
        }

        .stat-btn-outline:hover:not(:disabled) {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .stat-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .stat-filters {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 24px;
          padding: 16px 18px;
          background: var(--color-surface);
          border-radius: 14px;
          border: 1px solid var(--color-border);
          animation: statFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .stat-filter-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-text-soft);
        }

        .stat-period-group {
          display: inline-flex;
          gap: 4px;
          padding: 4px;
          background: var(--color-bg-strong);
          border-radius: 10px;
        }

        .stat-period-btn {
          padding: 7px 14px;
          border-radius: 7px;
          border: none;
          background: transparent;
          color: var(--color-text-soft);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .stat-period-btn:hover:not(.active) {
          color: var(--color-text);
        }

        .stat-period-btn.active {
          background: var(--color-surface);
          color: var(--color-primary);
          box-shadow: 0 2px 6px rgba(10, 21, 17, 0.08);
        }

        .stat-select-wrapper {
          position: relative;
        }

        .stat-select {
          padding: 9px 36px 9px 14px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          color: var(--color-text);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          appearance: none;
          min-width: 200px;
        }

        .stat-select:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(11, 110, 79, 0.1);
        }

        .stat-select-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--color-text-soft);
        }

        .stat-clear {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 8px 12px;
          border-radius: 8px;
          border: none;
          background: rgba(206, 17, 38, 0.1);
          color: var(--color-accent-red);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .stat-refresh {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          color: var(--color-text-soft);
          cursor: pointer;
          margin-left: auto;
        }

        .stat-refresh.spinning svg {
          animation: spin 0.8s linear infinite;
        }

        .stat-refresh:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .stat-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }

        .stat-kpi {
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--color-surface);
          padding: 18px 20px;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(10, 21, 17, 0.06);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: statFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .stat-kpi:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(10, 21, 17, 0.1);
        }

        .stat-kpi-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-kpi-value {
          font-size: 26px;
          font-weight: 800;
          color: var(--color-text);
          margin: 0;
          font-family: var(--font-display);
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .stat-kpi-label {
          font-size: 12px;
          color: var(--color-text-soft);
          margin: 4px 0 0 0;
          font-weight: 500;
        }

        .stat-kpi-delta {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 999px;
          margin-top: 6px;
        }

        .stat-kpi-delta.up {
          background: rgba(11, 110, 79, 0.12);
          color: var(--color-primary-dark);
        }

        .stat-kpi-delta.down {
          background: rgba(206, 17, 38, 0.12);
          color: var(--color-accent-red);
        }

        .stat-kpi-delta.neutral {
          background: var(--color-bg-strong);
          color: var(--color-text-soft);
        }

        .stat-two-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        @media (max-width: 900px) {
          .stat-two-cols { grid-template-columns: 1fr; }
        }

        .stat-panel {
          background: var(--color-surface);
          padding: 22px 24px;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(10, 21, 17, 0.06);
          animation: statFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .stat-panel-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: var(--color-text);
          margin: 0 0 18px 0;
        }

        .stat-empty {
          color: var(--color-text-soft);
          font-size: 13px;
          padding: 20px 0;
          text-align: center;
        }
      `}</style>

      <div>
        {/* Header */}
        <div className="stat-header">
          <div>
            <h1 className="stat-title">Statistiques</h1>
            <p className="stat-subtitle">
              {stats.periodeLabel}
              {service ? ` · ${service}` : ''}
            </p>
          </div>
          <div className="stat-actions">
            <button
              className="stat-btn stat-btn-outline"
              onClick={exportCSV}
            >
              <FileText size={16} />
              Export CSV
            </button>
            <button
              className="stat-btn stat-btn-primary"
              onClick={handleDownloadRapport}
              disabled={downloading}
            >
              <Download size={16} />
              {downloading ? 'Génération...' : 'Rapport PDF'}
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="stat-filters">
          <span className="stat-filter-label">
            <Calendar size={13} strokeWidth={2.5} /> Période
          </span>
          <div className="stat-period-group">
            {PERIODES.map((p) => (
              <button
                key={p.value}
                className={`stat-period-btn ${periode === p.value ? 'active' : ''}`}
                onClick={() => setPeriode(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <span className="stat-filter-label" style={{ marginLeft: 12 }}>
            <Filter size={13} strokeWidth={2.5} /> Service
          </span>
          <div className="stat-select-wrapper">
            <select
              className="stat-select"
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option value="">Tous les services</option>
              {services.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <svg className="stat-select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {service && (
            <button className="stat-clear" onClick={() => setService('')}>
              <X size={12} strokeWidth={3} />
              Retirer
            </button>
          )}

          <button
            className={`stat-refresh ${refreshing ? 'spinning' : ''}`}
            onClick={() => loadData(false)}
            title="Actualiser"
          >
            <RefreshCw size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* KPI Cards */}
        <div className="stat-kpi-grid">
          <div className="stat-kpi" style={{ animationDelay: '0s' }}>
            <div className="stat-kpi-icon" style={{ background: 'var(--color-primary-soft)' }}>
              <FileText size={22} color="var(--color-primary-dark)" strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="stat-kpi-value">{stats.totalDemandes ?? 0}</p>
              <p className="stat-kpi-label">Demandes totales</p>
              {stats.totalDemandesPrecedente > 0 && (
                <span className={`stat-kpi-delta ${deltaTotal > 0 ? 'up' : deltaTotal < 0 ? 'down' : 'neutral'}`}>
                  {deltaTotal > 0 ? <TrendingUp size={10} /> : deltaTotal < 0 ? <TrendingDown size={10} /> : null}
                  {deltaTotal > 0 ? '+' : ''}{Math.round(deltaTotal)}% vs préc.
                </span>
              )}
            </div>
          </div>

          <div className="stat-kpi" style={{ animationDelay: '0.05s' }}>
            <div className="stat-kpi-icon" style={{ background: 'rgba(252, 209, 22, 0.18)' }}>
              <Clock size={22} color="#8a6d00" strokeWidth={2.5} />
            </div>
            <div>
              <p className="stat-kpi-value">{Math.round(stats.delaiMoyenHeures ?? 0)}h</p>
              <p className="stat-kpi-label">Délai moyen</p>
            </div>
          </div>

          <div className="stat-kpi" style={{ animationDelay: '0.1s' }}>
            <div className="stat-kpi-icon" style={{ background: 'var(--color-primary-soft)' }}>
              <CheckCircle2 size={22} color="var(--color-primary-dark)" strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="stat-kpi-value">{Math.round(stats.tauxResolution ?? 0)}%</p>
              <p className="stat-kpi-label">Taux de résolution</p>
              {stats.resoluesPrecedente > 0 && (
                <span className={`stat-kpi-delta ${deltaResolues > 0 ? 'up' : deltaResolues < 0 ? 'down' : 'neutral'}`}>
                  {deltaResolues > 0 ? <TrendingUp size={10} /> : deltaResolues < 0 ? <TrendingDown size={10} /> : null}
                  {deltaResolues > 0 ? '+' : ''}{Math.round(deltaResolues)}% vs préc.
                </span>
              )}
            </div>
          </div>

          <div className="stat-kpi" style={{ animationDelay: '0.15s' }}>
            <div className="stat-kpi-icon" style={{ background: 'rgba(206, 17, 38, 0.1)' }}>
              <Users size={22} color="var(--color-accent-red)" strokeWidth={2.5} />
            </div>
            <div>
              <p className="stat-kpi-value">{stats.enAttente ?? 0}</p>
              <p className="stat-kpi-label">En attente</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="stat-two-cols">
          <div className="stat-panel">
            <p className="stat-panel-title">
              <BarChart3 size={15} strokeWidth={2.5} />
              Répartition par statut
            </p>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={repartitionStatut}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  animationDuration={800}
                >
                  {repartitionStatut.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="stat-panel">
            <p className="stat-panel-title">
              <BarChart3 size={15} strokeWidth={2.5} />
              Demandes par service
            </p>
            {demandesParService.length === 0 ? (
              <p className="stat-empty">Pas de données pour cette période.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={demandesParService} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--color-text-soft)' }} />
                  <YAxis type="category" dataKey="service" width={110} tick={{ fontSize: 12, fill: 'var(--color-text-soft)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" fill="#0B6E4F" radius={[0, 6, 6, 0]} barSize={22} animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {evolutionMensuelle.length > 0 && (
          <div className="stat-panel" style={{ marginBottom: 20 }}>
            <p className="stat-panel-title">
              <Calendar size={15} strokeWidth={2.5} />
              Évolution des demandes
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={evolutionMensuelle}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="mois" tick={{ fontSize: 12, fill: 'var(--color-text-soft)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-soft)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="demandes"
                  stroke="#0B6E4F"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#0B6E4F' }}
                  activeDot={{ r: 6 }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="stat-panel">
          <p className="stat-panel-title">
            <Users size={15} strokeWidth={2.5} />
            Performance des techniciens
          </p>
          {performance.length === 0 ? (
            <p className="stat-empty">Aucune donnée de performance disponible.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {performance.map((t) => (
                <div key={t.nom} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: 36, height: 36, minWidth: 36, borderRadius: '50%',
                    background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 700,
                  }}>
                    {t.nom.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
                      {t.nom}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-soft)', margin: '2px 0 0 0' }}>
                      {t.interventionsResolues} interventions résolues · délai moyen {Math.round(t.delaiMoyenHeures)}h
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}