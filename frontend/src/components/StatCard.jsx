export default function StatCard({ icon, value, label, trend, trendDir, color = 'cyan', delay = 0 }) {
  return (
    <div className={`glass-card stat-card animate-in animate-delay-${delay}`}>
      <div className={`stat-icon ${color}`}>
        {icon}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {trend && (
        <div className={`stat-trend ${trendDir || 'up'}`}>
          {trendDir === 'down' ? '↓' : '↑'} {trend}
        </div>
      )}
    </div>
  );
}
