import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ACCENTS = ['#5865f2', '#eb459e', '#3ba55d', '#faa61a', '#ed4245', '#00b0f4'];

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [gamertag, setGamertag] = useState('');
  const [accent, setAccent] = useState(ACCENTS[0]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(gamertag.trim(), accent);
      navigate('/community');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h2>Pick your Gamertag</h2>
        <p className="muted">
          No passwords needed in this community build — your gamertag is your identity in chat,
          voice rooms, and job applications.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="gamertag">Gamertag</label>
            <input
              id="gamertag"
              className="input"
              placeholder="e.g. NovaQueen"
              value={gamertag}
              onChange={(e) => setGamertag(e.target.value)}
              minLength={2}
              maxLength={32}
              required
              autoFocus
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label>Player color</label>
            <div className="swatch-row">
              {ACCENTS.map((c) => (
                <button
                  type="button"
                  key={c}
                  aria-label={`color ${c}`}
                  className={`swatch${accent === c ? ' selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setAccent(c)}
                />
              ))}
            </div>
          </div>
          {error && <p style={{ color: '#ed4245', fontSize: '0.85rem' }}>{error}</p>}
          <button type="submit" className="button-primary" disabled={busy} style={{ width: '100%' }}>
            {busy ? 'Signing in…' : 'Enter the Community'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
