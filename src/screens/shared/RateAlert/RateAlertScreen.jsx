import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import AppLoader from '../../../components/ui/appcomponents/AppLoader';
import ListRow from '../../../components/agri/ListRow';
import { useAuth } from '../../../providers/AuthProvider';
import { notificationService } from '../../../api/services';
import { formatDateTime } from '../../../utils/agriHelpers';

// Shown to farmers/drivers as the list of rate-change alerts pushed automatically
// whenever an owner updates a rate (see RateService.notifyRateChange on the backend).
// Owners see an explainer instead, since alerts are sent to their customers, not to them.
export default function RateAlertScreen() {
  const { COLORS, SIZES } = useTheme();
  const { role, ownerId: userId } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId || role === 'OWNER') { setLoading(false); return; }
    setLoading(true);
    try {
      const all = await notificationService.byUser(userId);
      const list = (Array.isArray(all) ? all : []).filter((n) => n.notificationType === 'RATE_ALERT');
      setAlerts(list);
    } catch (e) { setAlerts([]); }
    finally { setLoading(false); }
  }, [userId, role]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (role === 'OWNER') {
    return (
      <ScreenWrapper paddingHorizontal={0}
        header={<AppHeader title="Rate Alerts" variant="primary" showBack />}>
        <View style={{ paddingHorizontal: SIZES.padding.container, paddingTop: 30 }}>
          <AppEmptyState title="Alerts are sent automatically"
            subtitle="Whenever you change a rate's price, every linked customer is notified automatically. This page is what they see." />
        </View>
      </ScreenWrapper>
    );
  }

  if (loading) return <AppLoader mode="inline" message="Loading alerts..." />;

  return (
    <ScreenWrapper paddingHorizontal={0}
      header={<AppHeader title="Rate Alerts" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: SIZES.padding.container, paddingTop: 12 }}>
        {alerts.map((a) => (
          <ListRow key={a.notificationId} icon="trending-up-outline" title={a.title}
            subtitle={`${a.subtitle || ''}${a.subtitle ? ' · ' : ''}${formatDateTime(a.createdAt)}`} />
        ))}
        {alerts.length === 0 && (
          <AppEmptyState title="No rate alerts yet" subtitle="You'll be notified here whenever an owner changes their service rates." />
        )}
      </View>
    </ScreenWrapper>
  );
}
