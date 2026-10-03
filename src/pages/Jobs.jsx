import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

function Jobs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [applyState, setApplyState] = useState({ busy: false, error: '', done: false });

  useEffect(() => {
    api.jobs()
      .then(({ jobs }) => setJobs(jobs))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs.filter((j) => {
      if (remoteOnly && !j.remote) return false;
      if (!q) return true;
      const hay = `${j.title} ${j.company} ${j.location} ${j.tags.join(' ')}`.toLowerCase();
      return hay.includes(q);
    });
  }, [jobs, search, remoteOnly]);

  function openJob(job) {
    setSelected(job);
    setNote('');
    setApplyState({ busy: false, error: '', done: false });
  }

  async function handleApply(e) {
    e.preventDefault();
    setApplyState({ busy: true, error: '', done: false });
    try {
      await api.apply(selected.id, user.gamertag, note);
      setApplyState({ busy: false, error: '', done: true });
    } catch (err) {
      setApplyState({ busy: false, error: err.message, done: false });
    }
  }

  if (loading) return <div className="main-content muted">Loading active listings…</div>;

  return (
    <div className="main-content">
      <header className="jobs-header">
        <h2>Live Job Board</h2>
        <p className="muted">
          Sourced from gaming and tech employers. {user ? 'You are signed in — apply with a quick note.' : 'Sign in to apply.'}
        </p>
      </header>

      <div className="jobs-filters">
        <input
          className="input"
          style={{ maxWidth: 320 }}
          placeholder="Search title, company, or skill…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} />
          Remote only
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="muted">No jobs match your filters.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((job) => (
            <div key={job.id} className="card job-card" onClick={() => openJob(job)}>
              <div>
                <h3 className="job-title">{job.title}</h3>
                <div className="job-company">{job.company}</div>
                <div className="job-meta">
                  <span>📍 {job.location}</span>
                  <span>{job.type}</span>
                  <span>{job.salary}</span>
                  {job.remote && <span className="tag">Remote</span>}
                </div>
                <div className="job-meta">
                  {job.tags.map((t) => <span key={t} className="tag">#{t}</span>)}
                </div>
              </div>
              <button className="button-secondary" style={{ alignSelf: 'center', flexShrink: 0 }}>Apply</button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="card modal" onClick={(e) => e.stopPropagation()}>
            <h3>{selected.title}</h3>
            <div className="job-company">{selected.company} · {selected.location} · {selected.type}</div>
            <p style={{ fontSize: '0.92rem' }}>{selected.description}</p>
            <div className="job-meta">{selected.tags.map((t) => <span key={t} className="tag">#{t}</span>)}</div>

            {applyState.done ? (
              <p style={{ color: 'var(--accent-green)' }}>
                ✅ Application submitted! Track it from your profile and keep grinding XP in the community.
              </p>
            ) : user ? (
              <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label>Quick note to the hiring squad</label>
                <textarea
                  className="input"
                  rows={3}
                  maxLength={500}
                  placeholder="Why are you a great fit?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                {applyState.error && <p style={{ color: '#ed4245', fontSize: '0.85rem' }}>{applyState.error}</p>}
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button type="submit" className="button-primary" disabled={applyState.busy}>
                    {applyState.busy ? 'Sending…' : 'Submit application'}
                  </button>
                  <button type="button" className="button-secondary" onClick={() => setSelected(null)}>Close</button>
                </div>
              </form>
            ) : (
              <div>
                <button className="button-primary" onClick={() => navigate('/login')}>Sign in to apply</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;
