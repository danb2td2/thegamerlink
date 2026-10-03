import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { getSocket } from '../lib/socket';
import { useAuth } from '../context/AuthContext';
import { levelFor } from '../lib/constants';

function MemberList() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [onlineTags, setOnlineTags] = useState([]);

  useEffect(() => {
    api.users().then(({ users }) => setUsers(users)).catch(() => {});
  }, []);

  useEffect(() => {
    const socket = getSocket(user.gamertag);
    function onPresence(list) {
      setOnlineTags(list.map((u) => u.gamertag.toLowerCase()));
      // keep XP/status fresh from presence updates
      setUsers((prev) => prev.map((u) => {
        const live = list.find((l) => l.gamertag.toLowerCase() === u.gamertag.toLowerCase());
        return live ? { ...u, xp: live.xp, status: live.status } : u;
      }));
    }
    socket.on('presence', onPresence);
    return () => socket.off('presence', onPresence);
  }, [user.gamertag]);

  const sorted = [...users].sort((a, b) => {
    const aOn = onlineTags.includes(a.gamertag.toLowerCase()) ? 0 : 1;
    const bOn = onlineTags.includes(b.gamertag.toLowerCase()) ? 0 : 1;
    return aOn - bOn || b.xp - a.xp;
  });

  return (
    <aside className="member-list">
      <div className="sidebar-heading">Members — {users.length}</div>
      {sorted.map((u) => {
        const isOnline = onlineTags.includes(u.gamertag.toLowerCase());
        return (
          <div key={u.gamertag} className="member-row" style={{ opacity: isOnline ? 1 : 0.45 }}>
            <span className={`presence-dot ${isOnline ? (u.status === 'idle' ? 'idle' : 'online') : 'offline'}`} />
            <span className="avatar-dot" style={{ background: u.accent, width: 22, height: 22, fontSize: '0.65rem' }}>
              {u.gamertag[0]}
            </span>
            <span className="name">{u.gamertag}</span>
            <span className="lvl">Lv {levelFor(u.xp)}</span>
          </div>
        );
      })}
    </aside>
  );
}

export default MemberList;
