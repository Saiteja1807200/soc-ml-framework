import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  BarChart3,
  ChevronRight,
  Shield,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/alerts', label: 'Security Alerts', icon: ShieldAlert },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signout } = useAuth();

  const handleLogout = () => {
    signout();
    navigate('/login');
  };

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
        {/* User info */}
        {user && (
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user.username?.slice(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.username}</div>
              <div className="sidebar-user-role">SOC Analyst</div>
            </div>
          </div>
        )}

        <button className="sidebar-logout" onClick={handleLogout} id="logout-btn">
          <LogOut size={16} />
          Sign Out
        </button>

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
          padding: var(--space-md) var(--space-lg) var(--space-lg);
          border-top: 1px solid var(--border-subtle);
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-md);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid var(--border-subtle);
        }

        .sidebar-user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(6, 182, 212, 0.12);
          color: var(--accent-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .sidebar-user-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .sidebar-user-role {
          font-size: 0.68rem;
          color: var(--text-muted);
        }

        .sidebar-logout {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          width: 100%;
          padding: 8px var(--space-md);
          margin-bottom: var(--space-md);
          border-radius: var(--radius-sm);
          background: rgba(239, 68, 68, 0.06);
          border: 1px solid rgba(239, 68, 68, 0.12);
          color: var(--accent-red);
          font-size: 0.78rem;
          font-weight: 600;
          font-family: var(--font-sans);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .sidebar-logout:hover {
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.25);
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
