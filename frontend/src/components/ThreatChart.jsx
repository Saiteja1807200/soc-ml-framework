import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: '#1e293b',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        padding: '12px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: 6 }}>{label}</p>
      {payload.map((entry, i) => (
        <p
          key={i}
          style={{
            color: entry.color,
            fontSize: '0.85rem',
            fontWeight: 600,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
        </p>
      ))}
    </div>
  );
};

export default function ThreatChart({ data = [] }) {
  // Fallback demo data if API returns empty
  const chartData = data.length > 0 ? data : [
    { date: 'Mon', alert_count: 12, avg_risk: 0.35 },
    { date: 'Tue', alert_count: 19, avg_risk: 0.42 },
    { date: 'Wed', alert_count: 8, avg_risk: 0.28 },
    { date: 'Thu', alert_count: 24, avg_risk: 0.55 },
    { date: 'Fri', alert_count: 15, avg_risk: 0.39 },
    { date: 'Sat', alert_count: 6, avg_risk: 0.22 },
    { date: 'Sun', alert_count: 9, avg_risk: 0.31 },
  ];

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradientAlerts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: '0.75rem', color: '#94a3b8' }}
          />
          <Area
            type="monotone"
            dataKey="alert_count"
            name="Alerts"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#gradientAlerts)"
            dot={false}
            activeDot={{ r: 4, fill: '#06b6d4', stroke: '#0a0e1a', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="avg_risk"
            name="Avg Risk"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#gradientRisk)"
            dot={false}
            activeDot={{ r: 4, fill: '#ef4444', stroke: '#0a0e1a', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
