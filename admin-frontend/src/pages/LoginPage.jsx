// ─── LoginPage ────────────────────────────────────────────────────────────
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as Icon from '../components/ui/Icons';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }

    try {
      await login(username.trim(), password);
      navigate('/admin/dashboard', { replace: true });
    } catch {
      // Intentionally vague — don't reveal which field was wrong
      setError('Incorrect username or password. Please try again.');
    }
  };

  return (
    <main className="login-page" id="login-page">
      <div className="login-card" role="main">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon" aria-hidden="true">
            <Icon.ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="login-title">ASTHRA Admin</h1>
            <p className="login-subtitle">Department Association Management</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="login-error" role="alert" aria-live="assertive">
            <Icon.Warning size={16} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate aria-label="Login form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">Username</label>
            <input
              id="login-username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              placeholder="Enter your username"
              autoComplete="username"
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isLoading}
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <Icon.EyeOff size={16} /> : <Icon.Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '12px' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <><span className="spinner" style={{ borderTopColor: '#fff' }} /> Signing in…</>
            ) : (
              'Log in'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
