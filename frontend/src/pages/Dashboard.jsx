import { useState, useEffect } from 'react';
import { Users, ShieldAlert, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import ThreatChart from '../components/ThreatChart';
import AlertTable from '../components/AlertTable';
import { fetchDashboardStats, fetchThreatTrends, fetchAlerts } from '../api/client';

// Demo fallback data
const DEMO_STATS = {
  total_users: 48,
  active_alerts: 12,
  high_risk_users: 5,
  today_alerts: 7,
  overall_risk_level: 'ELEVATED',
  last_updated: new Date().toISOString(),
};

const DEMO_ALERTS = [
  { id: 1, username: 'user014', alert_type: 'suspicious_login', severity: 'CRITICAL', risk_score: 0.89, status: 'NEW', ml_confidence: 0.94, created_at: new Date(Date.now() - 1000*60*15).toISOString() },
  { id: 2, username: 'user027', alert_type: 'behavior_anomaly', severity: 'HIGH', risk_score: 0.72, status: 'INVESTIGATING', ml_confidence: 0.87, created_at: new Date(Date.now() - 1000*60*45).toISOString() },
  { id: 3, username: 'user003', alert_type: 'insider_threat', severity: 'HIGH', risk_score: 0.68, status: 'NEW', ml_confidence: 0.79, created_at: new Date(Date.now() - 1000*60*120).toISOString() },
  { id: 4, username: 'user041', alert_type: 'suspicious_login', severity: 'MEDIUM', risk_score: 0.45, status: 'RESOLVED', ml_confidence: 0.62, created_at: new Date(Date.now() - 1000*60*200).toISOString() },
  { id: 5, username: 'user009', alert_type: 'behavior_anomaly', severity: 'LOW', risk_score: 0.22, status: 'FALSE_POSITIVE', ml_confidence: 0.41, created_at: new Date(Date.now() - 1000*60*360).toISOString() },
];

export default function Dashboard() {
  const [stats, setStats] = useState(DEMO_STATS);
  const [trends, setTrends] = useState([]);
  const [alerts, setAlerts] = useState(DEMO_ALERTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, trendsRes, alertsRes] = await Promise.allSettled([
          fetchDashboardStats(),
          fetchThreatTrends(),
          fetchAlerts(10),
        ]);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
        if (trendsRes.status === 'fulfilled') setTrends(trendsRes.value.data);
        if (alertsRes.status === 'fulfilled' && alertsRes.value.data.length)
          setAlerts(alertsRes.value.data);
      } catch {
        // Use demo data
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const riskClass =
    stats.overall_risk_level === 'ELEVATED' ? 'elevated'
    : stats.overall_risk_level === 'CRITICAL' ? 'critical'
    : 'normal';

  return (
    <div id="dashboard-page">
      <div className="page-header">
        <h1>Threat Intelligence Dashboard</h1>
        <p>Real-time user behavior analytics & anomaly detection</p>
      </div>

      {/* Risk Level Banner */}
      <div className={`risk-indicator ${riskClass}`} style={{ marginBottom: 'var(--space-lg)' }}>
        <Activity size={18} />
        Overall Threat Level: {stats.overall_risk_level}
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.7, fontWeight: 400 }}>
          Last updated: {new Date(stats.last_updated).toLocaleTimeString()}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <StatCard
          icon={<Users size={20} />}
          value={stats.total_users}
          label="Total Users"
          color="cyan"
          delay={1}
        />
        <StatCard
          icon={<ShieldAlert size={20} />}
          value={stats.active_alerts}
          label="Active Alerts"
          trend={`${stats.today_alerts} today`}
          trendDir="up"
          color="red"
          delay={2}
        />
        <StatCard
          icon={<AlertTriangle size={20} />}
          value={stats.high_risk_users}
          label="High Risk Users"
          color="amber"
          delay={3}
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          value={stats.today_alerts}
          label="Today's Alerts"
          color="purple"
          delay={4}
        />
      </div>

      {/* Charts & Tables */}
      <div className="content-grid">
        {/* Threat Trends Chart */}
        <div className="glass-card animate-in" style={{ animationDelay: '0.25s' }}>
          <div className="section-title">
            <span className="dot live"></span>
            Threat Trends (7 Days)
          </div>
          <ThreatChart data={trends} />
        </div>

        {/* Recent Alerts */}
        <div className="glass-card animate-in" style={{ animationDelay: '0.3s' }}>
          <div className="section-title">
            <span className="dot alert"></span>
            Recent Alerts
          </div>
          <AlertTable alerts={alerts.slice(0, 5)} compact />
        </div>
      </div>
    </div>
  );
}
