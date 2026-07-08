import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../api/services';
import { AsyncStorageHelper } from '../utils/AsyncStorageHelper';
import { registerSessionExpiredHandler } from '../api/axiosInstance';

const AuthContext = createContext(null);

/**
 * Holds the authenticated user, role and tokens for the whole app.
 * Backend login returns: { token, role, name, userId, refreshToken, expiresIn, sessionId }.
 * The access token is short-lived (15 min) and refreshed automatically by
 * the axios interceptor — the user is never forced back to the login
 * screen just because it expired. Only a dead/revoked refresh token (or an
 * explicit logout) ends the session.
 */
export function AuthProvider({ children }) {
  const [user, setUser]                 = useState(null);   // { userId, name, role, token, refreshToken, ... }
  const [booting, setBooting]           = useState(true);
  const [loading, setLoading]           = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

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

  // ---- react to a refresh-token that the backend has rejected ----
  useEffect(() => {
    registerSessionExpiredHandler(() => {
      setUser(null);
      setSessionExpired(true);
    });
    return () => registerSessionExpiredHandler(null);
  }, []);

  const persist = useCallback(async (u) => {
    setUser(u);
    setSessionExpired(false);
    await AsyncStorage.setItem('@user', JSON.stringify(u));
    if (u?.token)        await AsyncStorage.setItem('@auth_token', u.token);
    if (u?.refreshToken) await AsyncStorageHelper.setRefreshToken(u.refreshToken);
    if (u?.userId)       await AsyncStorage.setItem('@user_id', String(u.userId));
  }, []);

  const login = useCallback(async (username, password, role) => {
    setLoading(true);
    try {
      const res = await authService.login(username, password, role);
      const u = {
        userId:       res.userId,
        name:         res.name,
        role:         res.role,
        token:        res.token,
        refreshToken: res.refreshToken,
        expiresIn:    res.expiresIn,
        sessionId:    res.sessionId,
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

  // Logs out only this device — the refresh token is revoked server-side so
  // it can't be used again even if it leaks.
  const logout = useCallback(async () => {
    try {
      const refreshToken = await AsyncStorageHelper.getRefreshToken();
      if (refreshToken) await authService.logout(refreshToken);
    } catch (e) {
      // best-effort — still clear local session even if the network call fails
    }
    setUser(null);
    setSessionExpired(false);
    await AsyncStorageHelper.clearSession();
    await AsyncStorage.multiRemove(['@user', '@auth_token', '@user_id']);
  }, []);

  // Logs out every device the user is currently signed in on.
  const logoutAllDevices = useCallback(async () => {
    try {
      await authService.logoutAll();
    } finally {
      setUser(null);
      setSessionExpired(false);
      await AsyncStorageHelper.clearSession();
      await AsyncStorage.multiRemove(['@user', '@auth_token', '@user_id']);
    }
  }, []);

  const value = {
    user,
    role:    user?.role ?? null,
    ownerId: user?.userId ?? null,
    isAuthenticated: !!user?.token,
    sessionExpired,
    booting,
    loading,
    login,
    register,
    logout,
    logoutAllDevices,
    setUser: persist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
