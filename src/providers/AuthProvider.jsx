import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../api/services';
import { AsyncStorageHelper } from '../utils/AsyncStorageHelper';

const AuthContext = createContext(null);

/**
 * Holds the authenticated user, role and token for the whole app.
 * Backend login returns: { token, role, name, userId }.
 */
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // { userId, name, role, token, ... }
  const [booting, setBooting] = useState(true);
  const [loading, setLoading] = useState(false);

  // ---- restore session on cold start ----
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@user');
        if (raw) setUser(JSON.parse(raw));
      } catch (e) {
        // ignore
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const persist = useCallback(async (u) => {
    setUser(u);
    await AsyncStorage.setItem('@user', JSON.stringify(u));
    if (u?.token)  await AsyncStorage.setItem('@auth_token', u.token);
    if (u?.userId) await AsyncStorage.setItem('@user_id', String(u.userId));
  }, []);

  const login = useCallback(async (username, password, role) => {
    setLoading(true);
    try {
      const res = await authService.login(username, password, role);
      const u = {
        userId: res.userId,
        name:   res.name,
        role:   res.role,
        token:  res.token,
        username,
      };
      await persist(u);
      return u;
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      return await authService.register(payload);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorageHelper.clearSession();
    await AsyncStorage.multiRemove(['@user', '@auth_token', '@user_id']);
  }, []);

  const value = {
    user,
    role:    user?.role ?? null,
    ownerId: user?.userId ?? null,
    isAuthenticated: !!user?.token,
    booting,
    loading,
    login,
    register,
    logout,
    setUser: persist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
