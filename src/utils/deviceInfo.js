import { Platform } from 'react-native';
import * as Application from 'expo-application';
import { AsyncStorageHelper } from './AsyncStorageHelper';

// Stable per-install device id, reused by both push-notification
// registration and auth session tracking (X-Device-Id header).
export async function getOrCreateDeviceId() {
  let deviceId = await AsyncStorageHelper.getDeviceId();
  if (!deviceId) {
    deviceId = Platform.OS === 'android'
      ? (Application.getAndroidId() ?? `android-${Date.now()}`)
      : ((await Application.getIosIdForVendorAsync()) ?? `ios-${Date.now()}`);
    await AsyncStorageHelper.setDeviceId(deviceId);
  }
  return deviceId;
}

export function getDeviceName() {
  return Platform.OS === 'ios' ? 'iOS device' : 'Android device';
}

export function getPlatform() {
  return Platform.OS;
}

export function getAppVersion() {
  return Application.nativeApplicationVersion ?? 'unknown';
}
