import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import AppLoader from '../../../components/ui/appcomponents/AppLoader';
import StatCard from '../../../components/agri/StatCard';
import ListRow from '../../../components/agri/ListRow';
import { useAuth } from '../../../providers/AuthProvider';
import { driverService, workService } from '../../../api/services';
import { formatCurrency, formatDate, minutesToLabel } from '../../../utils/agriHelpers';

export default function DriverEarningsScreen() {
  const { COLORS, SIZES } = useTheme();
  const { ownerId: userId } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const d = await driverService.byUser(userId);
      if (d?.driverId) {
        const r = await workService.byDriver(d.driverId);
        setRecords(Array.isArray(r) ? r : []);
      }
    } catch (e) { setRecords([]); }
    finally { setLoading(false); }
  }, [userId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const completed = records.filter((r) => r.status === 'COMPLETED');
  const totalAmount = completed.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const totalJobs = completed.length;

  if (loading) return <AppLoader mode="inline" message="Loading earnings..." />;

  return (
    <ScreenWrapper paddingHorizontal={0}
      header={<AppHeader title="Earnings" variant="primary" />}>
      <View style={{ paddingHorizontal: SIZES.padding.container, paddingTop: 12 }}>
        <View style={{ flexDirection: 'row' }}>
          <StatCard icon="cash" label="Total Value" tint={COLORS.success} value={formatCurrency(totalAmount)} />
          <View style={{ width: 12 }} />
          <StatCard icon="checkmark-done" label="Jobs Done" tint={COLORS.primary} value={totalJobs} />
        </View>

        <View style={{ marginTop: 18 }}>
          {completed.map((r) => (
            <ListRow key={r.workId} icon="receipt-outline" title={r.serviceType || 'Service'}
              subtitle={`${formatDate(r.workDate)} · ${minutesToLabel(r.durationMinutes)}`}
              value={formatCurrency(r.amount)} />
          ))}
          {completed.length === 0 && (
            <AppEmptyState title="No completed jobs yet" subtitle="Your completed work will show here." />
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}
