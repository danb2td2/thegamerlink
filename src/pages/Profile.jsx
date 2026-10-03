import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { badgesFor, levelFor, levelProgress } from '../lib/constants';

const STATUSES = ['online', 'idle', 'in-queue', 'away'];

function Profile() {
  const { user, updateLocal } = useAuth();
  const [bio, setBio] = useState(user?.bio || '');
  const [status, setStatus] = useState(user?.status || 'online');
  const [saved, setSaved] = useState(false);
  const [apps, setApps] = useState(null);

  useEffect(() => {
    setBio(user?.bio || '');
    setStatus(user?.status || 'online');
  }, [user?.gamertag]);

  useEffect(() => {
    // application count lives server-side; reflect XP/badges from fresh profile too
    if (!user) return;
    api.user(user.gamertag).then(({ user: fresh }) => updateLocal(fresh)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) {
    return (
      <div className="main-content">
        <h2>Profile</h2>
        <p className="muted">
          You are not signed in. <Link to="/login" style={{ textDecoration: 'underline' }}>Pick a gamertag</Link> to build your profile.
        </p>
      </div>
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaved(false);
    const { user: fresh } = await api.updateProfile(user.gamertag, { bio, status });
    updateLocal(fresh);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const level = levelFor(user.xp);
  const progress = levelProgress(user.xp);
  const badges = badgesFor(user.xp);

  return (
    <div className="main-content">
      <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <span className="avatar-dot" style={{ background: user.accent, width: 64, height: 64, fontSize: '1.6rem' }}>
          {user.gamertag[0]}
        </span>
        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: '0.15rem' }}>{user.gamertag}</h2>
          <p className="muted">Member since {user.joinedAt} · Status: {user.status}</p>
          <div className="profile-xp" style={{ maxWidth: 360 }}>
            <div style={{ width: `${progress}%` }} />
          </div>
          <p className="muted" style={{ marginTop: '0.3rem' }}>
            Level {level} · {user.xp} XP ({100 - progress} XP to level {level + 1})
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3>Badges</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {badges.length === 0 && <span className="muted">Chat in the community to earn your first badge.</span>}
          {badges.map((b) => <span key={b} className="badge-pill">🏅 {b}</span>)}
        </div>
      </div>

      <div className="card">
        <h3>Edit profile</h3>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label>Bio</label>
            <textarea className="input" rows={3} maxLength={280} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxWidth: 260 }}>
            <label>Status</label>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <button type="submit" className="button-primary">Save changes</button>
            {saved && <span style={{ color: 'var(--accent-green)', marginLeft: '0.6rem', fontSize: '0.85rem' }}>Saved!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
