import React, { useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import ListRow from '../../../components/agri/ListRow';
import { useAuth } from '../../../providers/AuthProvider';
import { notificationService } from '../../../api/services';

function iconForType(type) {
  switch (type) {
    case 'BOOKING': return 'calendar-outline';
    case 'PAYMENT': return 'cash-outline';
    case 'DOCUMENT_EXPIRY': return 'document-text-outline';
    case 'RATE_ALERT': return 'pricetag-outline';
    case 'MAINTENANCE': return 'construct-outline';
    case 'PAYROLL': return 'wallet-outline';
    case 'CHAT': return 'chatbubble-outline';
    default: return 'notifications-outline';
  }
}

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const { ownerId } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const load = useCallback(async () => {
    if (!ownerId) return;
    try {
      const data = await notificationService.byUser(ownerId);
      setNotifications(data || []);
    } catch (e) {}
  }, [ownerId]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <ScreenWrapper paddingHorizontal={0}
      header={
        <AppHeader
          title="Notifications"
          variant="primary"
          showBack
          actions={[{ iconName: 'settings-outline', onPress: () => navigation.navigate('NotificationPreferences') }]}
        />
      }>
      {notifications.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <AppEmptyState title="You're all caught up" subtitle="Booking and payment alerts will appear here." />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.notificationId)}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <ListRow
              icon={iconForType(item.notificationType)}
              title={item.title}
              subtitle={item.subtitle}
              status={item.isSent ? 'Sent' : 'Pending'}
              statusVariant={item.isSent ? 'success' : 'neutral'}
            />
          )}
        />
      )}
    </ScreenWrapper>
  );
}
