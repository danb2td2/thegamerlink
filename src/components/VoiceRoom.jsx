import React, { useEffect, useRef, useState } from 'react';
import { getSocket } from '../lib/socket';
import { useAuth } from '../context/AuthContext';

const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

function VoiceRoom({ room }) {
  const { user } = useAuth();
  const [joined, setJoined] = useState(false);
  const [peers, setPeers] = useState([]); // [{ socketId, gamertag, stream }]
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [error, setError] = useState('');
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnsRef = useRef(new Map()); // socketId -> RTCPeerConnection

  async function join() {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setJoined(true);

      const socket = getSocket(user.gamertag);

      function createPeer(peerId) {
        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        peerConnsRef.current.set(peerId, pc);
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        pc.onicecandidate = (e) => {
          if (e.candidate) socket.emit('rtc:ice', { to: peerId, candidate: e.candidate });
        };
        pc.ontrack = (e) => {
          const remoteStream = e.streams[0];
          setPeers((prev) => prev.map((p) => (p.socketId === peerId ? { ...p, stream: remoteStream } : p)));
        };
        pc.onconnectionstatechange = () => {
          if (['failed', 'closed', 'disconnected'].includes(pc.connectionState)) {
            setPeers((prev) => prev.filter((p) => p.socketId !== peerId));
          }
        };
        return pc;
      }

      socket.on('voice:peers', ({ peers: peerIds }) => {
        setPeers(peerIds.map((id) => ({ socketId: id, gamertag: id, stream: null })));
        peerIds.forEach(async (peerId) => {
          const pc = createPeer(peerId);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('rtc:offer', { to: peerId, sdp: pc.localDescription });
        });
      });

      socket.on('voice:joined', ({ socketId }) => {
        setPeers((prev) => (prev.some((p) => p.socketId === socketId) ? prev : [...prev, { socketId, gamertag: socketId, stream: null }]));
      });

      socket.on('voice:left', ({ socketId }) => {
        peerConnsRef.current.get(socketId)?.close();
        peerConnsRef.current.delete(socketId);
        setPeers((prev) => prev.filter((p) => p.socketId !== socketId));
      });

      socket.on('rtc:offer', async ({ from, sdp }) => {
        const pc = peerConnsRef.current.get(from) || createPeer(from);
        setPeers((prev) => (prev.some((p) => p.socketId === from) ? prev : [...prev, { socketId: from, gamertag: from, stream: null }]));
        await pc.setRemoteDescription(sdp);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('rtc:answer', { to: from, sdp: pc.localDescription });
      });

      socket.on('rtc:answer', async ({ from, sdp }) => {
        const pc = peerConnsRef.current.get(from);
        if (pc && pc.signalingState !== 'stable') await pc.setRemoteDescription(sdp);
      });

      socket.on('rtc:ice', ({ from, candidate }) => {
        peerConnsRef.current.get(from)?.addIceCandidate(candidate).catch(() => {});
      });

      socket.emit('voice:join', { room });
    } catch (err) {
      setError(
        err.name === 'NotAllowedError'
          ? 'Camera/microphone permission denied. Allow access in your browser to join.'
          : `Could not start video: ${err.message}`
      );
    }
  }

  function leave() {
    const socket = getSocket(user.gamertag);
    socket.emit('voice:leave');
    socket.off('voice:peers');
    socket.off('voice:joined');
    socket.off('voice:left');
    socket.off('rtc:offer');
    socket.off('rtc:answer');
    socket.off('rtc:ice');
    peerConnsRef.current.forEach((pc) => pc.close());
    peerConnsRef.current = new Map();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    setPeers([]);
    setJoined(false);
  }

  // leave the voice room when navigating away
  useEffect(() => () => { if (joined) leave(); }, []);

  function toggleMic() {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    }
  }

  function toggleCam() {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setCamOn(track.enabled);
    }
  }

  return (
    <div className="voice-wrap">
      <div className="chat-header">
        <h3>🔊 {room}</h3>
        <span className="muted">{joined ? 'Live party — like a console lobby' : 'Jump in with voice + video'}</span>
      </div>
      {error && <p style={{ color: '#ed4245', padding: '1rem' }}>{error}</p>}

      {!joined ? (
        <div className="voice-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="voice-tile-placeholder" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2rem' }}>🎮</div>
            <h3>{room} is quiet</h3>
            <p className="muted">Join to hang out on mic or camera — your browser will ask for permission.</p>
            <button className="button-primary" onClick={join}>Join {room}</button>
          </div>
        </div>
      ) : (
        <>
          <div className="voice-grid">
            <div className="video-tile">
              <video ref={localVideoRef} autoPlay playsInline muted />
              <span className="tile-label">{user.gamertag} (you)</span>
              {!micOn && <span className="tile-mute">🔇</span>}
              {!camOn && (
                <div className="voice-tile-placeholder" style={{ position: 'absolute', inset: 0, background: 'var(--panel-deep)' }}>
                  <span style={{ fontSize: '1.6rem' }}>📷</span>
                </div>
              )}
            </div>
            {peers.map((p) => (
              <RemoteTile key={p.socketId} peer={p} />
            ))}
            {peers.length === 0 && (
              <div className="voice-tile-placeholder" style={{ gridColumn: '1 / -1' }}>
                <p>Waiting for squad members to join…</p>
                <p className="muted">Open the site in another tab to test the party.</p>
              </div>
            )}
          </div>
          <div className="voice-controls">
            <button className={`ctrl-btn${micOn ? '' : ' off'}`} onClick={toggleMic} title="Toggle microphone">{micOn ? '🎙️' : '🔇'}</button>
            <button className={`ctrl-btn${camOn ? '' : ' off'}`} onClick={toggleCam} title="Toggle camera">{camOn ? '📹' : '🚫'}</button>
            <button className="ctrl-btn off" onClick={leave} title="Leave the room">📞</button>
          </div>
        </>
      )}
    </div>
  );
}

function RemoteTile({ peer }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && peer.stream && videoRef.current.srcObject !== peer.stream) {
      videoRef.current.srcObject = peer.stream;
    }
  }, [peer.stream]);

  return (
    <div className="video-tile">
      {peer.stream ? (
        <video ref={videoRef} autoPlay playsInline />
      ) : (
        <div className="voice-tile-placeholder"><span style={{ fontSize: '1.6rem' }}>🎮</span><span>connecting…</span></div>
      )}
      <span className="tile-label">{peer.gamertag}</span>
    </div>
  );
}

export default VoiceRoom;
