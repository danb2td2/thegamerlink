async function req(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
  return body;
}

export const api = {
  login: (gamertag, accent) => req('/login', { method: 'POST', body: JSON.stringify({ gamertag, accent }) }),
  users: () => req('/users'),
  user: (gamertag) => req(`/users/${encodeURIComponent(gamertag)}`),
  updateProfile: (gamertag, patch) => req(`/users/${encodeURIComponent(gamertag)}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  jobs: () => req('/jobs'),
  job: (id) => req(`/jobs/${id}`),
  apply: (id, gamertag, note) => req(`/jobs/${id}/apply`, { method: 'POST', body: JSON.stringify({ gamertag, note }) }),
  messages: (channel) => req(`/messages/${encodeURIComponent(channel)}`),
};
