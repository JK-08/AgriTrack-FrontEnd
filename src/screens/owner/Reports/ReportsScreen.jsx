import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import StatCard from '../../../components/agri/StatCard';
import SectionHeader from '../../../components/agri/SectionHeader';
import { useAuth } from '../../../providers/AuthProvider';
import { reportService } from '../../../api/services';
import { formatCurrency } from '../../../utils/agriHelpers';

export default function ReportsScreen() {
  const { COLORS } = useTheme();
  const { ownerId } = useAuth();
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState({});

  const load = useCallback(async () => {
    if (!ownerId) return;
    try {
      const [s, r] = await Promise.all([reportService.ownerSummary(ownerId), reportService.revenue(ownerId)]);
      setSummary(s); setRevenue(r?.revenueByDate || {});
    } catch (e) {}
  }, [ownerId]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const rows = Object.entries(revenue).sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 10);
  const max = Math.max(1, ...rows.map(([, v]) => Number(v)));

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Reports" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <View style={{ flexDirection: 'row' }}>
          <StatCard icon="cash" tint={COLORS.success} label="Revenue" value={formatCurrency(summary?.totalRevenue)} />
          <View style={{ width: 12 }} />
          <StatCard icon="time" tint={COLORS.warning} label="Pending" value={formatCurrency(summary?.pendingDue)} />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <StatCard icon="construct" tint={COLORS.primary} label="Total Jobs" value={summary?.totalWorks ?? 0} />
          <View style={{ width: 12 }} />
          <StatCard icon="star" tint={COLORS.secondary} label="Avg Rating" value={summary?.averageRating ?? 0} />
        </View>

        <SectionHeader title="Revenue (recent days)" />
        <AppCard>
          {rows.length === 0 ? (
            <AppText variant="bodySmall" color={COLORS.textSecondary}>No revenue data yet.</AppText>
          ) : rows.map(([date, val]) => (
            <View key={date} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <AppText variant="caption" color={COLORS.textSecondary}>{date}</AppText>
                <AppText variant="caption">{formatCurrency(val)}</AppText>
              </View>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: COLORS.borderLight }}>
                <View style={{ height: 8, borderRadius: 4, width: `${(Number(val) / max) * 100}%`, backgroundColor: COLORS.primary }} />
              </View>
            </View>
          ))}
        </AppCard>
      </View>
    </ScreenWrapper>
  );
}
