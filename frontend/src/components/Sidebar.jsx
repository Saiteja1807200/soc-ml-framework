import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  BarChart3,
  Brain,
  Settings,
  ChevronRight,
  Shield,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/alerts', label: 'Security Alerts', icon: ShieldAlert },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Shield size={22} />
        </div>
        <div className="brand-text">
          <span className="brand-name">SOC ML</span>
          <span className="brand-tag">Framework</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="nav-item-left">
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} className="nav-arrow" />}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="sidebar-footer">
        <div className="system-status">
          <div className="status-dot live"></div>
          <span>System Online</span>
        </div>
        <div className="sidebar-version">v1.0.0</div>
      </div>

      <style>{`
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: var(--sidebar-width);
          background: var(--bg-sidebar);
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          z-index: 100;
          overflow-y: auto;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-lg) var(--space-lg);
          border-bottom: 1px solid var(--border-subtle);
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--gradient-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .brand-name {
          display: block;
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .brand-tag {
          display: block;
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 600;
        }

        .sidebar-nav {
          flex: 1;
          padding: var(--space-md) var(--space-sm);
        }

        .nav-section-label {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-muted);
          padding: var(--space-md) var(--space-md) var(--space-sm);
        }

        .nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px var(--space-md);
          margin: 2px 0;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .nav-item-left {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: rgba(6, 182, 212, 0.08);
          color: var(--accent-cyan);
          font-weight: 600;
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: var(--accent-cyan);
          border-radius: 0 3px 3px 0;
        }

        .nav-arrow {
          opacity: 0.6;
        }

        .sidebar-footer {
          padding: var(--space-lg);
          border-top: 1px solid var(--border-subtle);
        }

        .system-status {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: 0.78rem;
          color: var(--accent-green);
          font-weight: 600;
          margin-bottom: var(--space-xs);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-green);
          animation: pulse-dot 2s ease-in-out infinite;
        }

        .sidebar-version {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}
