import {
  getMessaging,
  getInitialNotification,
  onNotificationOpenedApp,
  onMessage,
} from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { displayNotification } from './NotificationService';

const TAB_SCREENS = ['Home', 'Portfolio', 'Transactions', 'BuyGold', 'Profile'];

function handleNavigation(navigationRef, data) {
  if (!data?.screen) {
    navigationRef.navigate('Main');
    return;
  }
  const screen = data.screen;
  try {
    if (TAB_SCREENS.includes(screen)) {
      navigationRef.navigate('Main');
      setTimeout(() => navigationRef.navigate('Main', { screen }), 300);
    } else {
      navigationRef.navigate(screen);
    }
  } catch {
    navigationRef.navigate('Main');
  }
}

export function registerForegroundHandlers(navigationRef) {
  const messaging = getMessaging();

  const unsubscribeFCM = onMessage(messaging, async (remoteMessage) => {
    const { notification, data } = remoteMessage;
    if (notification) {
      await displayNotification(
        notification.title ?? 'DigiGold',
        notification.body  ?? '',
        data,
        notification.android?.imageUrl ?? notification.ios?.imageUrl,
      );
    }
  });

  const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS && detail.notification?.data) {
      handleNavigation(navigationRef, detail.notification.data);
    }
  });

  return () => { unsubscribeFCM(); unsubscribeNotifee(); };
}

export async function handleInitialNotification(navigationRef) {
  const messaging = getMessaging();
  const remoteMessage = await getInitialNotification(messaging);
  if (remoteMessage?.data) {
    setTimeout(() => handleNavigation(navigationRef, remoteMessage.data), 1000);
  }
  const initialNotification = await notifee.getInitialNotification();
  if (initialNotification?.notification?.data) {
    setTimeout(() => handleNavigation(navigationRef, initialNotification.notification.data), 1000);
  }
}

export function handleBackgroundOpenedApp(navigationRef) {
  const messaging = getMessaging();
  onNotificationOpenedApp(messaging, (remoteMessage) => {
    if (remoteMessage?.data) handleNavigation(navigationRef, remoteMessage.data);
  });
}
