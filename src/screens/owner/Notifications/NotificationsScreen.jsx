import React from 'react';
import { View } from 'react-native';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';

export default function NotificationsScreen() {
  return (
    <ScreenWrapper paddingHorizontal={0}
      header={<AppHeader title="Notifications" variant="primary" showBack />}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <AppEmptyState title="You're all caught up" subtitle="Booking and payment alerts will appear here." />
      </View>
    </ScreenWrapper>
  );
}
