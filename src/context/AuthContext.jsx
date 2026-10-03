import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { disconnectSocket } from '../lib/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tgl_user')) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem('tgl_user', JSON.stringify(user));
    else localStorage.removeItem('tgl_user');
  }, [user]);

  async function login(gamertag, accent) {
    const { user: loggedIn } = await api.login(gamertag, accent);
    setUser(loggedIn);
    return loggedIn;
  }

  function logout() {
    disconnectSocket();
    setUser(null);
  }

  function updateLocal(patch) {
    setUser((u) => (u ? { ...u, ...patch } : u));
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateLocal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
