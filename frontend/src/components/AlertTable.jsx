import { AlertTriangle } from 'lucide-react';

function SeverityBadge({ severity }) {
  const level = (severity || '').toLowerCase();
  return <span className={`badge ${level}`}>{severity}</span>;
}

function StatusBadge({ status }) {
  const key = (status || '').toLowerCase().replace(' ', '_');
  const labels = {
    new: 'New',
    investigating: 'Investigating',
    resolved: 'Resolved',
    false_positive: 'False Positive',
  };
  return <span className={`badge ${key}`}>{labels[key] || status}</span>;
}

export default function AlertTable({ alerts = [], compact = false }) {
  if (!alerts.length) {
    return (
      <div className="empty-state">
        <AlertTriangle size={32} />
        <p>No alerts to display</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table" id="alerts-table">
        <thead>
          <tr>
            {!compact && <th>ID</th>}
            <th>User</th>
            <th>Type</th>
            <th>Severity</th>
            <th>Risk</th>
            {!compact && <th>Status</th>}
            {!compact && <th>Confidence</th>}
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert, idx) => (
            <tr key={alert.id || idx}>
              {!compact && (
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  #{alert.id}
                </td>
              )}
              <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {alert.username}
              </td>
              <td>{(alert.alert_type || '').replace('_', ' ')}</td>
              <td><SeverityBadge severity={alert.severity} /></td>
              <td>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  color: alert.risk_score >= 0.7 ? 'var(--accent-red)' :
                         alert.risk_score >= 0.4 ? 'var(--accent-amber)' :
                         'var(--accent-green)',
                }}>
                  {typeof alert.risk_score === 'number' ? alert.risk_score.toFixed(2) : '—'}
                </span>
              </td>
              {!compact && <td><StatusBadge status={alert.status} /></td>}
              {!compact && (
                <td style={{ fontFamily: 'var(--font-mono)' }}>
                  {typeof alert.ml_confidence === 'number'
                    ? `${(alert.ml_confidence * 100).toFixed(0)}%`
                    : '—'}
                </td>
              )}
              <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                {alert.created_at
                  ? new Date(alert.created_at).toLocaleString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
