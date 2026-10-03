import React from 'react';
import { TEXT_CHANNELS, VOICE_CHANNELS } from '../lib/constants';

function ChannelSidebar({ selected, onSelect }) {
  return (
    <aside className="channel-sidebar">
      <h3 style={{ fontSize: '0.95rem', padding: '0.25rem 0.55rem', marginBottom: '0.25rem' }}>TheGamerLink</h3>
      <div className="sidebar-heading">Text Channels</div>
      {TEXT_CHANNELS.map((ch) => (
        <button
          key={ch}
          className={`channel-btn${selected.type === 'text' && selected.name === ch ? ' active' : ''}`}
          onClick={() => onSelect({ type: 'text', name: ch })}
        >
          <span>#</span> {ch}
        </button>
      ))}
      <div className="sidebar-heading">Voice Channels</div>
      {VOICE_CHANNELS.map((ch) => (
        <button
          key={ch}
          className={`channel-btn${selected.type === 'voice' && selected.name === ch ? ' active' : ''}`}
          onClick={() => onSelect({ type: 'voice', name: ch })}
        >
          <span>🔊</span> {ch}
        </button>
      ))}
      <div style={{ marginTop: 'auto', padding: '0.5rem 0.55rem', fontSize: '0.72rem' }} className="muted">
        💼 #jobs-rail · 🏆 events
      </div>
    </aside>
  );
}

export default ChannelSidebar;
