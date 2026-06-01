import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Small delay for feel
    await new Promise((r) => setTimeout(r, 400));

    const result = login(username, password);
    if (!result.success) {
      setError(result.error);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setIsLoading(false);
  }

  return (
    <div className="login-page">
      {/* Animated background orbs */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      <div className={`login-card ${shake ? 'shake' : ''}`}>
        {/* Logo section */}
        <div className="login-logo">
          <div className="login-logo-icon">💰</div>
          <div className="login-logo-text">DuitTracker</div>
          <div className="login-logo-sub">Kelola keuanganmu dengan mudah</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label" htmlFor="login-username">
              <span className="login-label-icon">👤</span> Username
            </label>
            <input
              id="login-username"
              className="login-input"
              type="text"
              placeholder="Masukkan nama..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="login-password">
              <span className="login-label-icon">🔒</span> Password
            </label>
            <input
              id="login-password"
              className="login-input"
              type="password"
              placeholder="Masukkan password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={isLoading || !username || !password}
          >
            {isLoading ? (
              <span className="login-spinner" />
            ) : (
              <>Masuk 🚀</>
            )}
          </button>
        </form>

        {/* Footer hint */}
        <div className="login-footer">
          <div className="login-avatars">
            <div className="login-avatar login-avatar-ricky">R</div>
            <div className="login-avatar login-avatar-andrea">A</div>
          </div>
          <div className="login-footer-text">Ricky & Andrea</div>
        </div>
      </div>
    </div>
  );
}
