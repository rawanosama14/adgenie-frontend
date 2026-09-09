'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, getStoredUser, getToken, logout as clearAuth, setStoredUser, setToken } from '@/lib/api';

const AuthContext = createContext({
  user: null,
  isAuthed: false,
  ready: false,
  login: async () => {},
  registerAndLogin: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthed, setIsAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setIsAuthed(Boolean(getToken()));
    setReady(true);
  }, []);

  const persistSession = useCallback((data, fallbackEmail = '') => {
    setToken(data.access_token);
    const nextUser = data.user || { email: fallbackEmail };
    setStoredUser(nextUser);
    setUser(nextUser);
    setIsAuthed(true);
    return data;
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    return persistSession(data, email);
  }, [persistSession]);

  // The modular backend returns a JWT immediately after registration, so there
  // is no second login request and no stale route mismatch.
  const registerAndLogin = useCallback(async (payload) => {
    const data = await api.register(payload);
    return persistSession(data, payload.email);
  }, [persistSession]);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setIsAuthed(false);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthed, ready, login, registerAndLogin, logout }),
    [user, isAuthed, ready, login, registerAndLogin, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
