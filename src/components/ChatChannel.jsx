import React, { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
import { getSocket } from '../lib/socket';
import { useAuth } from '../context/AuthContext';
import { QUICK_REACTIONS } from '../lib/constants';

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function ChatChannel({ channel }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState([]);
  const scrollRef = useRef(null);
  const typingTimer = useRef(0);

  useEffect(() => {
    let alive = true;
    api.messages(channel).then(({ messages }) => {
      if (alive) setMessages(messages);
    }).catch(() => {});
    return () => { alive = false; };
  }, [channel]);

  useEffect(() => {
    const socket = getSocket(user.gamertag);

    function onMessage(msg) {
      if (msg.channel !== channel) return;
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
    }
    function onReact({ messageId, reactions }) {
      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, reactions } : m)));
    }
    function onTyping({ channel: ch, gamertag }) {
      if (ch !== channel || gamertag === user.gamertag) return;
      setTyping((prev) => (prev.includes(gamertag) ? prev : [...prev, gamertag]));
      setTimeout(() => setTyping((prev) => prev.filter((t) => t !== gamertag)), 2500);
    }

    socket.on('chat:message', onMessage);
    socket.on('chat:react', onReact);
    socket.on('typing', onTyping);
    return () => {
      socket.off('chat:message', onMessage);
      socket.off('chat:react', onReact);
      socket.off('typing', onTyping);
    };
  }, [channel, user.gamertag]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  function send(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const socket = getSocket(user.gamertag);
    socket.emit('chat:message', { channel, text });
    setDraft('');
  }

  function handleDraftChange(e) {
    setDraft(e.target.value);
    const now = Date.now();
    if (now - typingTimer.current > 1500) {
      typingTimer.current = now;
      getSocket(user.gamertag).emit('typing', { channel });
    }
  }

  function react(messageId, emoji) {
    getSocket(user.gamertag).emit('chat:react', { messageId, emoji });
  }

  return (
    <>
      <div className="chat-header">
        <h3># {channel}</h3>
        <span className="muted">Real-time chat · react with emojis · earn 5 XP per message</span>
      </div>
      <div className="chat-scroll" ref={scrollRef}>
        {messages.length === 0 && (
          <p className="muted" style={{ padding: '1rem' }}>
            Nothing here yet — say hi to the squad! 👋
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className="chat-msg">
            <span className="msg-avatar" style={{ background: m.accent || '#5865f2' }}>{m.gamertag[0]}</span>
            <div className="msg-body">
              <div className="msg-meta">
                <span className="msg-author">{m.gamertag}</span>
                <span className="msg-time">{formatTime(m.ts)}</span>
              </div>
              <div className="msg-text">{m.text}</div>
              {Object.keys(m.reactions || {}).length > 0 && (
                <div className="msg-reactions">
                  {Object.entries(m.reactions).map(([emoji, reactors]) => (
                    <button
                      key={emoji}
                      className={`reaction-pill${reactors.includes(user.gamertag) ? ' mine' : ''}`}
                      onClick={() => react(m.id, emoji)}
                      title={reactors.join(', ')}
                    >
                      {emoji} {reactors.length}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="msg-toolbar">
              {QUICK_REACTIONS.map((emoji) => (
                <button key={emoji} className="toolbar-emoji" onClick={() => react(m.id, emoji)}>{emoji}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="typing-note">
        {typing.length > 0 && `${typing.join(', ')} ${typing.length === 1 ? 'is' : 'are'} typing…`}
      </div>
      <form className="chat-input-row" onSubmit={send}>
        <input
          className="chat-input"
          placeholder={`Message #${channel}`}
          value={draft}
          onChange={handleDraftChange}
          maxLength={2000}
        />
      </form>
    </>
  );
}

export default ChatChannel;
