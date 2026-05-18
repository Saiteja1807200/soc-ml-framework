import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import { fetchSuspiciousUsers } from '../api/client';

const DEMO_USERS = [
  { username: 'user014', risk_score: 0.89, department: 'Engineering' },
  { username: 'user027', risk_score: 0.76, department: 'Finance' },
  { username: 'user003', risk_score: 0.68, department: 'HR' },
  { username: 'user041', risk_score: 0.61, department: 'Marketing' },
  { username: 'user018', risk_score: 0.58, department: 'Engineering' },
  { username: 'user009', risk_score: 0.52, department: 'IT Support' },
  { username: 'user033', risk_score: 0.48, department: 'Finance' },
  { username: 'user022', risk_score: 0.44, department: 'Engineering' },
];

const RISK_DISTRIBUTION = [
  { name: 'Critical', value: 3, color: '#ef4444' },
  { name: 'High', value: 8, color: '#f97316' },
  { name: 'Medium', value: 15, color: '#f59e0b' },
  { name: 'Low', value: 22, color: '#10b981' },
];

function riskBarColor(score) {
  if (score >= 0.75) return '#ef4444';
  if (score >= 0.55) return '#f97316';
  if (score >= 0.35) return '#f59e0b';
  return '#10b981';
}

function avatarBg(dept) {
  const map = {
    Engineering: 'rgba(6,182,212,0.15)',
    Finance: 'rgba(139,92,246,0.15)',
    HR: 'rgba(236,72,153,0.15)',
    Marketing: 'rgba(245,158,11,0.15)',
    'IT Support': 'rgba(59,130,246,0.15)',
  };
  return map[dept] || 'rgba(100,116,139,0.15)';
}

function avatarColor(dept) {
  const map = {
    Engineering: '#06b6d4',
    Finance: '#8b5cf6',
    HR: '#ec4899',
    Marketing: '#f59e0b',
    'IT Support': '#3b82f6',
  };
  return map[dept] || '#94a3b8';
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 8, padding: '10px 14px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{d.username}</p>
      <p style={{ color: riskBarColor(d.risk_score), fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>
        Risk: {d.risk_score.toFixed(2)}
      </p>
      <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{d.department}</p>
    </div>
  );
};

export default function Analytics() {
  const [users, setUsers] = useState(DEMO_USERS);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchSuspiciousUsers();
        if (res.data?.length) setUsers(res.data);
      } catch {
        // demo data
      }
    }
    load();
  }, []);

  return (
    <div id="analytics-page">
      <div className="page-header">
        <h1>Behavioral Analytics</h1>
        <p>User risk profiles, anomaly distribution, and departmental insights</p>
      </div>

      <div className="content-grid">
        {/* Top Suspicious Users Bar Chart */}
        <div className="glass-card animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="section-title">
            <span className="dot alert"></span>
            Top Suspicious Users
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={users} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" domain={[0, 1]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="username" tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }} width={70} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="risk_score" radius={[0, 4, 4, 0]} barSize={16}>
                  {users.map((entry, i) => (
                    <Cell key={i} fill={riskBarColor(entry.risk_score)} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Pie */}
        <div className="glass-card animate-in" style={{ animationDelay: '0.15s' }}>
          <div className="section-title">
            <span className="dot info"></span>
            Risk Distribution
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RISK_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  dataKey="value"
                  stroke="none"
                  paddingAngle={3}
                >
                  {RISK_DISTRIBUTION.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  wrapperStyle={{ fontSize: '0.75rem', color: '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8, fontSize: '0.85rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Suspicious Users List */}
      <div className="glass-card animate-in" style={{ animationDelay: '0.2s' }}>
        <div className="section-title">
          <span className="dot alert"></span>
          Suspicious User Profiles
        </div>
        {users.map((user, idx) => (
          <div className="user-list-item" key={idx}>
            <div className="user-info">
              <div
                className="user-avatar"
                style={{ background: avatarBg(user.department), color: avatarColor(user.department) }}
              >
                {user.username.slice(-3)}
              </div>
              <div className="user-details">
                <div className="name">{user.username}</div>
                <div className="dept">{user.department}</div>
              </div>
            </div>
            <div className="risk-bar-container">
              <div className="risk-bar">
                <div
                  className="risk-bar-fill"
                  style={{
                    width: `${user.risk_score * 100}%`,
                    background: riskBarColor(user.risk_score),
                  }}
                />
              </div>
              <div className="risk-value" style={{ color: riskBarColor(user.risk_score) }}>
                {user.risk_score.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
