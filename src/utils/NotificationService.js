import {
  getMessaging, getToken, requestPermission,
  onTokenRefresh, AuthorizationStatus,
} from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance, AndroidVisibility,
  AuthorizationStatus as NotifeeAuthorizationStatus,
} from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';
import * as Application from 'expo-application';
import { axiosInstance } from '../api/axiosInstance';
import { DEVICE } from '../api/endpoints';
import { AsyncStorageHelper } from './AsyncStorageHelper';

export const CHANNEL_ID = 'digigold_default';

export async function createNotificationChannel() {
  if (Platform.OS !== 'android') return;
  await notifee.createChannel({
    id: CHANNEL_ID, name: 'DigiGold Notifications',
    importance: AndroidImportance.HIGH, visibility: AndroidVisibility.PUBLIC,
    sound: 'default', vibration: true,
  });
}

export async function requestNotificationPermission() {
  if (Platform.OS === 'ios') {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= NotifeeAuthorizationStatus.AUTHORIZED;
  }
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      { title: 'Notification Permission', message: 'DigiGold needs permission to send you notifications.', buttonPositive: 'Allow', buttonNegative: 'Deny' },
    );
    if (result !== PermissionsAndroid.RESULTS.GRANTED) return false;
  }
  const messaging = getMessaging();
  const authStatus = await requestPermission(messaging);
  return authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL;
}

async function getDeviceId() {
  let deviceId = await AsyncStorageHelper.getDeviceId();
  if (!deviceId) {
    deviceId = Platform.OS === 'android'
      ? (Application.getAndroidId() ?? 'android-unknown')
      : (await Application.getIosIdForVendorAsync() ?? 'ios-unknown');
    await AsyncStorageHelper.setDeviceId(deviceId);
  }
  return deviceId;
}

export async function registerTokenToBackend(fcmToken) {
  try {
    const userId = await AsyncStorageHelper.getUserId();
    if (!userId) return;
    const deviceId   = await getDeviceId();
    const deviceType = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
    await axiosInstance.post(DEVICE.REGISTER, { userId: Number(userId), deviceId, deviceType, fcmToken, expoToken: null });
    await AsyncStorageHelper.setFcmToken(fcmToken);
  } catch {}
}

export async function initNotifications() {
  await createNotificationChannel();
  const granted = await requestNotificationPermission();
  if (!granted) return;
  const messaging = getMessaging();
  const fcmToken  = await getToken(messaging);
  const isFirstTime = !(await AsyncStorageHelper.getFcmToken());
  await registerTokenToBackend(fcmToken);
  if (isFirstTime) {
    await displayNotification('🥇 Welcome to DigiGold!', 'Start investing in digital gold today.', { screen: 'Home' });
  }
  onTokenRefresh(messaging, async (newToken) => { await registerTokenToBackend(newToken); });
}

export async function displayNotification(title, body, data, imageUrl) {
  try {
    await createNotificationChannel();
    await notifee.displayNotification({
      title, body, data,
      android: {
        channelId: CHANNEL_ID, importance: AndroidImportance.HIGH,
        sound: 'default', pressAction: { id: 'default' },
        ...(imageUrl && { largeIcon: imageUrl, style: { type: 0, picture: imageUrl } }),
      },
      ios: { sound: 'default', ...(imageUrl && { attachments: [{ url: imageUrl }] }) },
    });
  } catch {}
}

export async function deactivateDeviceToken() {
  try {
    const deviceId = await AsyncStorageHelper.getDeviceId();
    if (!deviceId) return;
    await axiosInstance.post(DEVICE.LOGOUT, { deviceId });
  } catch {}
}
