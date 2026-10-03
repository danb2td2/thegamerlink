import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import store from './store.js';

store.init();
const db = store.get();

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: true, credentials: true } });

const MAX_MESSAGES_PER_CHANNEL = 300;

// ---------- helpers ----------
function getUser(gamertag) {
  return db.users.find((u) => u.gamertag.toLowerCase() === String(gamertag || '').toLowerCase());
}

function ensureUser(gamertag, accent) {
  let user = getUser(gamertag);
  if (!user) {
    user = {
      gamertag: String(gamertag).slice(0, 32),
      accent: accent || '#5865f2',
      bio: '',
      status: 'online',
      xp: 0,
      joinedAt: new Date().toISOString().slice(0, 10),
    };
    db.users.push(user);
    store.save();
  }
  return user;
}

function publicUser(u) {
  return { gamertag: u.gamertag, accent: u.accent, bio: u.bio, status: u.status, xp: u.xp, joinedAt: u.joinedAt };
}

// gamertag -> Set(socketId)
const online = new Map();
// room name -> Map(socketId -> gamertag)
const voiceRooms = new Map();

function broadcastPresence() {
  const list = db.users
    .filter((u) => online.has(u.gamertag.toLowerCase()))
    .map((u) => ({ gamertag: u.gamertag, accent: u.accent, status: u.status, xp: u.xp }));
  io.emit('presence', list);
}

// ---------- REST ----------
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/login', (req, res) => {
  const { gamertag, accent } = req.body || {};
  if (!gamertag || typeof gamertag !== 'string' || gamertag.trim().length < 2) {
    return res.status(400).json({ error: 'Gamertag must be at least 2 characters.' });
  }
  const user = ensureUser(gamertag.trim(), accent);
  if (accent && accent !== user.accent) {
    user.accent = accent;
    store.save();
  }
  res.json({ user: publicUser(user) });
});

app.get('/api/users', (_req, res) => {
  res.json({ users: db.users.map(publicUser).sort((a, b) => b.xp - a.xp) });
});

app.get('/api/users/:gamertag', (req, res) => {
  const user = getUser(req.params.gamertag);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user: publicUser(user) });
});

app.patch('/api/users/:gamertag', (req, res) => {
  const user = getUser(req.params.gamertag);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  const { bio, status, accent } = req.body || {};
  if (bio !== undefined) user.bio = String(bio).slice(0, 280);
  if (status !== undefined) user.status = String(status).slice(0, 32);
  if (accent !== undefined) user.accent = String(accent);
  store.save();
  broadcastPresence();
  res.json({ user: publicUser(user) });
});

app.get('/api/jobs', (_req, res) => {
  res.json({ jobs: db.jobs });
});

app.get('/api/jobs/:id', (req, res) => {
  const job = db.jobs.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found.' });
  res.json({ job });
});

app.post('/api/jobs/:id/apply', (req, res) => {
  const job = db.jobs.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found.' });
  const { gamertag, note } = req.body || {};
  if (!gamertag) return res.status(400).json({ error: 'Login required.' });
  if (db.applications.some((a) => a.jobId === job.id && a.gamertag.toLowerCase() === gamertag.toLowerCase())) {
    return res.status(409).json({ error: 'You already applied to this job.' });
  }
  db.applications.push({ id: `a${Date.now()}${Math.random().toString(36).slice(2, 6)}`, jobId: job.id, gamertag, note: String(note || '').slice(0, 500), ts: Date.now(), status: 'submitted' });
  store.save();
  res.json({ ok: true });
});

app.get('/api/messages/:channel', (req, res) => {
  const channel = req.params.channel;
  res.json({ messages: db.messages.filter((m) => m.channel === channel) });
});

// ---------- realtime ----------
io.on('connection', (socket) => {
  const gamertag = socket.handshake.auth?.gamertag;
  const user = gamertag ? ensureUser(gamertag) : null;
  if (!user) {
    socket.disconnect(true);
    return;
  }
  const key = user.gamertag.toLowerCase();
  if (!online.has(key)) online.set(key, new Set());
  online.get(key).add(socket.id);
  broadcastPresence();

  socket.on('status', (status) => {
    if (['online', 'idle', 'in-queue', 'away'].includes(status)) {
      user.status = status;
      store.save();
      broadcastPresence();
    }
  });

  socket.on('chat:message', ({ channel, text }) => {
    const clean = String(text || '').trim().slice(0, 2000);
    if (!channel || !clean) return;
    const msg = { id: `m${Date.now()}${Math.random().toString(36).slice(2, 6)}`, channel, gamertag: user.gamertag, accent: user.accent, text: clean, ts: Date.now(), reactions: {} };
    db.messages.push(msg);
    if (db.messages.length > MAX_MESSAGES_PER_CHANNEL * 10) {
      const byChannel = new Map();
      for (const m of db.messages) {
        if (!byChannel.has(m.channel)) byChannel.set(m.channel, []);
        byChannel.get(m.channel).push(m);
      }
      db.messages = [];
      for (const arr of byChannel.values()) db.messages.push(...arr.slice(-MAX_MESSAGES_PER_CHANNEL));
    }
    user.xp += 5;
    store.save();
    io.emit('chat:message', { ...msg, xp: user.xp });
  });

  socket.on('chat:react', ({ messageId, emoji }) => {
    const msg = db.messages.find((m) => m.id === messageId);
    if (!msg || !emoji || typeof emoji !== 'string' || emoji.length > 8) return;
    msg.reactions[emoji] = msg.reactions[emoji] || [];
    const arr = msg.reactions[emoji];
    const idx = arr.indexOf(user.gamertag);
    if (idx >= 0) arr.splice(idx, 1); else arr.push(user.gamertag);
    if (arr.length === 0) delete msg.reactions[emoji];
    store.save();
    io.emit('chat:react', { messageId, reactions: msg.reactions });
  });

  socket.on('typing', ({ channel }) => {
    if (channel) socket.broadcast.emit('typing', { channel, gamertag: user.gamertag });
  });

  // voice / video rooms (WebRTC mesh signaling)
  socket.on('voice:join', ({ room }) => {
    if (!room || typeof room !== 'string') return;
    if (!voiceRooms.has(room)) voiceRooms.set(room, new Map());
    const peers = [...voiceRooms.get(room).keys()];
    voiceRooms.get(room).set(socket.id, user.gamertag);
    socket.join(`voice:${room}`);
    socket.emit('voice:peers', { room, peers });
    socket.to(`voice:${room}`).emit('voice:joined', { socketId: socket.id, gamertag: user.gamertag });
  });

  socket.on('voice:leave', () => leaveVoice());
  function leaveVoice() {
    for (const [room, peers] of voiceRooms) {
      if (peers.delete(socket.id)) {
        socket.to(`voice:${room}`).emit('voice:left', { socketId: socket.id });
        if (peers.size === 0) voiceRooms.delete(room);
      }
    }
  }

  socket.on('rtc:offer', ({ to, sdp }) => io.to(to).emit('rtc:offer', { from: socket.id, sdp }));
  socket.on('rtc:answer', ({ to, sdp }) => io.to(to).emit('rtc:answer', { from: socket.id, sdp }));
  socket.on('rtc:ice', ({ to, candidate }) => io.to(to).emit('rtc:ice', { from: socket.id, candidate }));

  socket.on('disconnect', () => {
    const set = online.get(key);
    if (set) {
      set.delete(socket.id);
      if (set.size === 0) online.delete(key);
    }
    leaveVoice();
    broadcastPresence();
  });
});

server.listen(8000, '0.0.0.0', () => {
  console.log('thegamerlink API listening on http://0.0.0.0:8000');
});
