import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppSwitch from '../../../components/ui/appcomponents/AppSwitch';
import AppBadge from '../../../components/ui/appcomponents/AppBadge';
import { useAuth } from '../../../providers/AuthProvider';
import { useToast } from '../../../components/ui/Toast';
import { notificationService } from '../../../api/services';

const TYPE_LABELS = {
  BOOKING: { label: 'Bookings', sub: 'New requests, accept/reject, completion' },
  PAYMENT: { label: 'Payments', sub: 'Payment received, pending dues' },
  DOCUMENT_EXPIRY: { label: 'Document Expiry', sub: 'RC/Insurance/Permit/PUC/Fitness renewal reminders' },
  RATE_ALERT: { label: 'Rate Alerts', sub: 'Rate changes on your tractors' },
  MAINTENANCE: { label: 'Maintenance', sub: 'Service due, maintenance logs' },
  PAYROLL: { label: 'Payroll', sub: 'Salary generated, payslips' },
  CHAT: { label: 'Chat Messages', sub: 'New messages from customers/drivers' },
  GENERAL: { label: 'General', sub: 'Announcements and other updates' },
};

export default function NotificationPreferencesScreen() {
  const { COLORS } = useTheme();
  const { ownerId } = useAuth();
  const toast = useToast();
  const [prefs, setPrefs] = useState([]);
  const [savingType, setSavingType] = useState(null);

  const load = useCallback(async () => {
    if (!ownerId) return;
    try {
      const data = await notificationService.getPreferences(ownerId);
      setPrefs(data || []);
    } catch (e) {}
  }, [ownerId]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const toggle = async (pref, field) => {
    const updated = { ...pref, [field]: !pref[field] };
    setPrefs((prev) => prev.map((p) => (p.notificationType === pref.notificationType ? updated : p)));
    setSavingType(pref.notificationType);
    try {
      await notificationService.updatePreference(ownerId, {
        notificationType: updated.notificationType,
        pushEnabled: updated.pushEnabled,
        inAppEnabled: updated.inAppEnabled,
        smsEnabled: updated.smsEnabled,
        emailEnabled: updated.emailEnabled,
      });
    } catch (e) {
      setPrefs((prev) => prev.map((p) => (p.notificationType === pref.notificationType ? pref : p)));
      toast?.show?.('Could not update preference', 'error');
    } finally {
      setSavingType(null);
    }
  };

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Notification Preferences" subtitle="Choose how you're notified" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        {prefs.map((pref) => {
          const meta = TYPE_LABELS[pref.notificationType] || { label: pref.notificationType, sub: '' };
          return (
            <AppCard key={pref.notificationType} style={{ marginBottom: 12 }}>
              <AppText variant="label" style={{ fontWeight: '700' }}>{meta.label}</AppText>
              {!!meta.sub && (
                <AppText variant="caption" color={COLORS.textSecondary} style={{ marginBottom: 8 }}>{meta.sub}</AppText>
              )}
              <AppSwitch
                label="Push notifications"
                value={!!pref.pushEnabled}
                disabled={savingType === pref.notificationType}
                onValueChange={() => toggle(pref, 'pushEnabled')}
                style={{ marginTop: 6 }}
              />
              <AppSwitch
                label="In-app notifications"
                value={!!pref.inAppEnabled}
                disabled={savingType === pref.notificationType}
                onValueChange={() => toggle(pref, 'inAppEnabled')}
                style={{ marginTop: 10 }}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <AppText variant="bodySmall" color={COLORS.textTertiary} style={{ flex: 1 }}>SMS notifications</AppText>
                <AppBadge label="Coming soon" variant="neutral" />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                <AppText variant="bodySmall" color={COLORS.textTertiary} style={{ flex: 1 }}>Email notifications</AppText>
                <AppBadge label="Coming soon" variant="neutral" />
              </View>
            </AppCard>
          );
        })}
      </View>
    </ScreenWrapper>
  );
}
