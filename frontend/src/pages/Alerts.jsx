import { useState, useEffect } from 'react';
import { ShieldAlert, Filter } from 'lucide-react';
import AlertTable from '../components/AlertTable';
import { fetchAlerts, fetchHighRiskAlerts } from '../api/client';

const DEMO_ALERTS = [
  { id: 1, username: 'user014', alert_type: 'suspicious_login', severity: 'CRITICAL', risk_score: 0.89, status: 'NEW', ml_confidence: 0.94, created_at: new Date(Date.now() - 1000*60*15).toISOString() },
  { id: 2, username: 'user027', alert_type: 'behavior_anomaly', severity: 'HIGH', risk_score: 0.72, status: 'INVESTIGATING', ml_confidence: 0.87, created_at: new Date(Date.now() - 1000*60*45).toISOString() },
  { id: 3, username: 'user003', alert_type: 'insider_threat', severity: 'HIGH', risk_score: 0.68, status: 'NEW', ml_confidence: 0.79, created_at: new Date(Date.now() - 1000*60*120).toISOString() },
  { id: 4, username: 'user041', alert_type: 'suspicious_login', severity: 'MEDIUM', risk_score: 0.45, status: 'RESOLVED', ml_confidence: 0.62, created_at: new Date(Date.now() - 1000*60*200).toISOString() },
  { id: 5, username: 'user009', alert_type: 'behavior_anomaly', severity: 'LOW', risk_score: 0.22, status: 'FALSE_POSITIVE', ml_confidence: 0.41, created_at: new Date(Date.now() - 1000*60*360).toISOString() },
  { id: 6, username: 'user018', alert_type: 'insider_threat', severity: 'CRITICAL', risk_score: 0.91, status: 'NEW', ml_confidence: 0.96, created_at: new Date(Date.now() - 1000*60*30).toISOString() },
  { id: 7, username: 'user033', alert_type: 'suspicious_login', severity: 'MEDIUM', risk_score: 0.52, status: 'INVESTIGATING', ml_confidence: 0.58, created_at: new Date(Date.now() - 1000*60*90).toISOString() },
  { id: 8, username: 'user022', alert_type: 'behavior_anomaly', severity: 'HIGH', risk_score: 0.77, status: 'NEW', ml_confidence: 0.85, created_at: new Date(Date.now() - 1000*60*180).toISOString() },
];

const SEVERITY_FILTERS = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const STATUS_FILTERS = ['ALL', 'NEW', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE'];

export default function Alerts() {
  const [alerts, setAlerts] = useState(DEMO_ALERTS);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchAlerts(50);
        if (res.data?.length) setAlerts(res.data);
      } catch {
        // Use demo data
      }
    }
    load();
  }, []);

  const filtered = alerts.filter((a) => {
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    return true;
  });

  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const highCount = alerts.filter(a => a.severity === 'HIGH').length;
  const newCount = alerts.filter(a => a.status === 'NEW').length;

  return (
    <div id="alerts-page">
      <div className="page-header">
        <h1>Security Alerts</h1>
        <p>Monitor, triage, and manage threat detections</p>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="glass-card" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="stat-icon red"><ShieldAlert size={18} /></div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800 }}>{criticalCount}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Critical</div>
            </div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="stat-icon amber"><ShieldAlert size={18} /></div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800 }}>{highCount}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>High</div>
            </div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="stat-icon blue"><ShieldAlert size={18} /></div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800 }}>{newCount}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Untriaged</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>
            <Filter size={14} /> Severity:
          </div>
          {SEVERITY_FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn ${severityFilter === f ? 'active' : ''}`}
              onClick={() => setSeverityFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>
            <Filter size={14} /> Status:
          </div>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn ${statusFilter === f ? 'active' : ''}`}
              onClick={() => setStatusFilter(f)}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Table */}
      <div className="glass-card">
        <div className="section-title">
          <span className="dot alert"></span>
          Showing {filtered.length} of {alerts.length} alerts
        </div>
        <AlertTable alerts={filtered} />
      </div>
    </div>
  );
}
