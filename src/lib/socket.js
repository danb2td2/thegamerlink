import { io } from 'socket.io-client';

let socket = null;

export function getSocket(gamertag) {
  if (socket && socket.auth?.gamertag === gamertag) return socket;
  if (socket) socket.disconnect();
  socket = io('/', { auth: { gamertag } });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
