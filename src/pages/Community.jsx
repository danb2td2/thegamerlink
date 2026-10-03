import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../lib/socket';
import { TEXT_CHANNELS } from '../lib/constants';
import ChannelSidebar from '../components/ChannelSidebar';
import ChatChannel from '../components/ChatChannel';
import VoiceRoom from '../components/VoiceRoom';
import MemberList from '../components/MemberList';

function Community() {
  const { user } = useAuth();
  const [selected, setSelected] = useState({ type: 'text', name: TEXT_CHANNELS[0] });

  useEffect(() => {
    if (!user) return;
    const socket = getSocket(user.gamertag);
    return () => {}; // socket stays connected for the session
  }, [user?.gamertag]);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="community">
      <div className="server-rail">
        <div className="server-icon active" title="TheGamerLink">🎮</div>
        <div className="server-icon" title="Jobs">💼</div>
        <div className="server-icon" title="Events">🏆</div>
      </div>
      <ChannelSidebar selected={selected} onSelect={setSelected} />
      <main className="chat-main">
        {selected.type === 'voice'
          ? <VoiceRoom room={selected.name} />
          : <ChatChannel channel={selected.name} />}
      </main>
      <MemberList />
    </div>
  );
}

export default Community;
