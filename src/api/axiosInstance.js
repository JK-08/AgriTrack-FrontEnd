import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE_URL = 'https://agritrack-backend-rwsy.onrender.com/api/v1';
import { AsyncStorageHelper } from '../utils/AsyncStorageHelper';
import { getOrCreateDeviceId, getDeviceName, getPlatform, getAppVersion } from '../utils/deviceInfo';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// A plain axios client with none of the interceptors below — used only for
// the refresh call itself, so a failed/expired access token can never turn
// a refresh request into an infinite interceptor loop.
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 15000,
});

// Set by AuthProvider so the interceptor can force a logout / navigate to
// the login screen when the refresh token itself is no longer valid
// (expired, revoked, or the device was logged out remotely).
let onSessionExpired = null;
export function registerSessionExpiredHandler(handler) {
  onSessionExpired = handler;
}

axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorageHelper.getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  try {
    const [deviceId] = await Promise.all([getOrCreateDeviceId()]);
    config.headers['X-Device-Id'] = deviceId;
    config.headers['X-Device-Name'] = getDeviceName();
    config.headers['X-Platform'] = getPlatform();
    config.headers['X-App-Version'] = getAppVersion();
  } catch (e) {
    // device metadata is best-effort — never block a request over it
  }
  return config;
});

// ---- automatic access-token refresh ----
// Concurrent 401s while a refresh is already in flight all wait on the same
// promise instead of firing N parallel refresh calls (which would each try
// to rotate the same refresh token and invalidate one another).
let refreshPromise = null;

async function performRefresh() {
  const refreshToken = await AsyncStorageHelper.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  const { data } = await refreshClient.post('/auth/refresh', { refreshToken });

  await AsyncStorageHelper.setToken(data.accessToken);
  await AsyncStorageHelper.setRefreshToken(data.refreshToken);

  return data.accessToken;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    const isAuthEndpoint =
      config?.url?.includes('/auth/refresh') ||
      config?.url?.includes('/user/login') ||
      config?.url?.includes('/mpin/login') ||
      config?.url?.includes('/google');

    if (response?.status === 401 && config && !config._retried && !isAuthEndpoint) {
      config._retried = true;

      try {
        if (!refreshPromise) {
          refreshPromise = performRefresh().finally(() => { refreshPromise = null; });
        }
        const newAccessToken = await refreshPromise;

        config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance.request(config);
      } catch (refreshError) {
        // Refresh token is dead too (expired/revoked/logged-out device) —
        // the user genuinely needs to log in again. This is the ONE case
        // where we don't silently retry.
        await AsyncStorageHelper.clearSession();
        if (onSessionExpired) onSessionExpired();
        return Promise.reject(refreshError);
      }
    }

    if (error?.response?.status === 401 && isAuthEndpoint) {
      await AsyncStorage.multiRemove(['@auth_token', '@user']);
    }

    return Promise.reject(error);
  }
);
