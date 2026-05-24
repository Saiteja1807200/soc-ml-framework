import { useState } from 'react';
import { Shield, User, Mail, Lock, Building, ArrowRight, AlertCircle } from 'lucide-react';
import { login, register } from '../api/client';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const { signin } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Login fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regDepartment, setRegDepartment] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(username, password);
      signin(res.data.access_token);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (regPassword !== regConfirm) {
      setError('Passwords do not match');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register({
        username: regUsername,
        email: regEmail,
        full_name: regFullName,
        department: regDepartment,
        password: regPassword,
      });
      // Auto-login after registration
      const loginRes = await login(regUsername, regPassword);
      signin(loginRes.data.access_token);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <div className="login-page">
      {/* Background effects */}
      <div className="login-bg-orb orb-1" />
      <div className="login-bg-orb orb-2" />
      <div className="login-bg-orb orb-3" />

      <div className="login-container">
        {/* Brand Header */}
        <div className="login-brand">
          <div className="login-brand-icon">
            <Shield size={28} />
          </div>
          <h1 className="login-title">SOC ML Framework</h1>
          <p className="login-subtitle">
            {mode === 'login'
              ? 'Sign in to access the Threat Intelligence Dashboard'
              : 'Create your SOC analyst account'}
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="login-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="login-form" id="login-form">
            <div className="form-group">
              <label htmlFor="login-username">
                <User size={14} />
                Username
              </label>
              <input
                id="login-username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">
                <Lock size={14} />
                Password
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading || !username || !password}
              id="login-submit-btn"
            >
              {loading ? (
                <span className="login-spinner" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="login-form" id="register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-username">
                  <User size={14} />
                  Username
                </label>
                <input
                  id="reg-username"
                  type="text"
                  placeholder="Choose a username"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  required
                  autoFocus
                  autoComplete="username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="reg-email">
                  <Mail size={14} />
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="analyst@company.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-fullname">
                  <User size={14} />
                  Full Name
                </label>
                <input
                  id="reg-fullname"
                  type="text"
                  placeholder="Jane Doe"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  autoComplete="name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="reg-department">
                  <Building size={14} />
                  Department
                </label>
                <input
                  id="reg-department"
                  type="text"
                  placeholder="Security Operations"
                  value={regDepartment}
                  onChange={(e) => setRegDepartment(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-password">
                  <Lock size={14} />
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  placeholder="Min 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="reg-confirm">
                  <Lock size={14} />
                  Confirm
                </label>
                <input
                  id="reg-confirm"
                  type="password"
                  placeholder="Repeat password"
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading || !regUsername || !regEmail || !regPassword || !regConfirm}
              id="register-submit-btn"
            >
              {loading ? (
                <span className="login-spinner" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Toggle */}
        <div className="login-toggle">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button onClick={switchMode} type="button" id="switch-to-register">
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={switchMode} type="button" id="switch-to-login">
                Sign in
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: var(--space-lg);
        }

        /* Animated background orbs */
        .login-bg-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.4;
          pointer-events: none;
          z-index: 0;
        }
        .orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%);
          top: -10%;
          left: -5%;
          animation: orbFloat 12s ease-in-out infinite;
        }
        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%);
          bottom: -10%;
          right: -5%;
          animation: orbFloat 15s ease-in-out infinite reverse;
        }
        .orb-3 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
          top: 40%;
          left: 50%;
          animation: orbFloat 18s ease-in-out infinite 3s;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -20px) scale(1.05); }
          50% { transform: translate(-20px, 30px) scale(0.95); }
          75% { transform: translate(20px, 20px) scale(1.02); }
        }

        .login-container {
          width: 100%;
          max-width: 460px;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.6s ease forwards;
        }

        .login-brand {
          text-align: center;
          margin-bottom: var(--space-xl);
        }

        .login-brand-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-lg);
          background: var(--gradient-brand);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: var(--space-md);
          box-shadow: 0 0 30px rgba(6,182,212,0.2);
        }

        .login-title {
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--space-xs);
        }

        .login-subtitle {
          color: var(--text-secondary);
          font-size: 0.88rem;
          line-height: 1.5;
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: var(--radius-md);
          padding: var(--space-sm) var(--space-md);
          color: #fca5a5;
          font-size: 0.82rem;
          font-weight: 500;
          margin-bottom: var(--space-lg);
          animation: fadeInUp 0.3s ease forwards;
        }

        .login-form {
          background: var(--gradient-card);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          position: relative;
          overflow: hidden;
        }

        .login-form::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(6,182,212,0.15), transparent);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
        }

        .form-group {
          margin-bottom: var(--space-md);
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        }

        .form-group input {
          width: 100%;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.88rem;
          transition: all var(--transition-fast);
          outline: none;
        }

        .form-group input::placeholder {
          color: var(--text-muted);
        }

        .form-group input:focus {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
          background: rgba(255, 255, 255, 0.06);
        }

        .login-submit {
          width: 100%;
          padding: 12px;
          margin-top: var(--space-sm);
          border-radius: var(--radius-md);
          background: var(--gradient-brand);
          color: white;
          font-size: 0.9rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          transition: all var(--transition-fast);
          cursor: pointer;
          border: none;
          font-family: var(--font-sans);
        }

        .login-submit:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 0 24px rgba(6, 182, 212, 0.2);
        }

        .login-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .login-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-toggle {
          text-align: center;
          margin-top: var(--space-lg);
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .login-toggle button {
          background: none;
          border: none;
          color: var(--accent-cyan);
          font-weight: 600;
          font-size: 0.82rem;
          font-family: var(--font-sans);
          cursor: pointer;
          padding: 0;
          transition: color var(--transition-fast);
        }

        .login-toggle button:hover {
          color: var(--accent-blue);
        }

        @media (max-width: 520px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          .login-container {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
