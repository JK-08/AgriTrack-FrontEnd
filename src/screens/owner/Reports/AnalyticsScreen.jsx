import React, { useState, useCallback } from 'react';
import { View, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import { AppSkeletonCard } from '../../../components/ui/appcomponents/AppSkeleton';
import SectionHeader from '../../../components/agri/SectionHeader';
import { useAuth } from '../../../providers/AuthProvider';
import { reportService } from '../../../api/services';
import { formatCurrency } from '../../../utils/agriHelpers';

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const HOUR_LABEL = (h) => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? 'AM' : 'PM'}`;

function periodLabel(period) {
  const [, m] = period.split('-');
  return MONTH_SHORT[Number(m) - 1] || period;
}

function TrendChart({ points, formatValue, tint }) {
  const { COLORS } = useTheme();
  const [selected, setSelected] = useState(null);
  const max = Math.max(1, ...points.map((p) => Number(p.value)));
  const active = selected ?? points[points.length - 1];

  return (
    <View>
      {active && (
        <AppText variant="bodySmall" color={COLORS.textSecondary} style={{ marginBottom: 10 }}>
          {periodLabel(active.period)}: <AppText variant="bodySmall" style={{ fontWeight: '700' }}>{formatValue(active.value)}</AppText>
        </AppText>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 100 }}>
        {points.map((p) => {
          const heightPct = Math.max(4, (Number(p.value) / max) * 100);
          const isActive = active?.period === p.period;
          return (
            <Pressable
              key={p.period}
              onPress={() => setSelected(p)}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}
            >
              <View style={{
                width: '55%', height: `${heightPct}%`, borderRadius: 4,
                backgroundColor: isActive ? tint : `${tint}55`,
              }} />
            </Pressable>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', marginTop: 6 }}>
        {points.map((p, i) => (
          <View key={p.period} style={{ flex: 1, alignItems: 'center' }}>
            {i % 2 === 0 && (
              <AppText variant="caption" color={COLORS.textSecondary}>{periodLabel(p.period)}</AppText>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

function Row({ left, right }) {
  const { COLORS } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <AppText variant="bodySmall" numberOfLines={1} style={{ flex: 1, marginRight: 8 }}>{left}</AppText>
      <AppText variant="bodySmall" color={COLORS.textSecondary}>{right}</AppText>
    </View>
  );
}

export default function AnalyticsScreen() {
  const { COLORS } = useTheme();
  const navigation = useNavigation();
  const { ownerId } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    setError(false);
    try {
      const [a, adv] = await Promise.all([
        reportService.analytics(ownerId),
        reportService.advanced(ownerId),
      ]);
      setAnalytics(a);
      setTopCustomers(adv?.topCustomers || []);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [ownerId]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const topDrivers = (analytics?.driverProductivity || []).slice(0, 5);
  const peakHours = Object.entries(analytics?.peakBookingHours || {})
    .sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 5);
  const seasonalMax = Math.max(1, ...Object.values(analytics?.seasonalBookingPattern || {}).map(Number));

  if (loading && !analytics) {
    return (
      <ScreenWrapper scroll paddingHorizontal={0}
        header={<AppHeader title="Analytics" subtitle="Trends & business insights" variant="primary" showBack />}>
        <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
          <AppSkeletonCard lines={2} />
          <AppSkeletonCard lines={2} />
          <AppSkeletonCard lines={3} />
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper paddingHorizontal={0}
        header={<AppHeader title="Analytics" subtitle="Trends & business insights" variant="primary" showBack />}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <AppEmptyState variant="error" cta={{ label: 'Try Again', onPress: load, variant: 'outline' }} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Analytics" subtitle="Trends & business insights" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <TouchableOpacity onPress={() => navigation.navigate('AiInsights')} style={{ alignSelf: 'flex-end', marginBottom: 8 }}>
          <AppText variant="bodySmall" color={COLORS.primary}>View AI Insights ›</AppText>
        </TouchableOpacity>

        <SectionHeader title="Revenue Trend (12 months)" />
        <AppCard>
          {analytics?.revenueTrend ? (
            <TrendChart points={analytics.revenueTrend} formatValue={formatCurrency} tint={COLORS.success} />
          ) : (
            <AppText variant="bodySmall" color={COLORS.textSecondary}>No data yet.</AppText>
          )}
        </AppCard>

        <SectionHeader title="Booking Trend (12 months)" />
        <AppCard>
          {analytics?.bookingTrend ? (
            <TrendChart points={analytics.bookingTrend} formatValue={(v) => `${v} bookings`} tint={COLORS.primary} />
          ) : (
            <AppText variant="bodySmall" color={COLORS.textSecondary}>No data yet.</AppText>
          )}
        </AppCard>

        <SectionHeader title="Customer Growth (12 months)" />
        <AppCard>
          {analytics?.customerGrowthTrend ? (
            <TrendChart points={analytics.customerGrowthTrend} formatValue={(v) => `${v} new customers`} tint={COLORS.secondary} />
          ) : (
            <AppText variant="bodySmall" color={COLORS.textSecondary}>No data yet.</AppText>
          )}
        </AppCard>

        <SectionHeader title="Tractor Usage Hours (12 months)" />
        <AppCard>
          {analytics?.tractorUsageTrend ? (
            <TrendChart points={analytics.tractorUsageTrend} formatValue={(v) => `${v} hrs`} tint={COLORS.warning} />
          ) : (
            <AppText variant="bodySmall" color={COLORS.textSecondary}>No data yet.</AppText>
          )}
        </AppCard>

        <SectionHeader title="Top Drivers by Productivity" />
        <AppCard>
          {topDrivers.length === 0 ? (
            <AppText variant="bodySmall" color={COLORS.textSecondary}>No completed jobs yet.</AppText>
          ) : topDrivers.map((d) => (
            <Row key={d.driverId} left={d.licenseNumber || `Driver #${d.driverId}`}
              right={`${d.jobsPerHour} jobs/hr · ${d.completedJobs} jobs`} />
          ))}
        </AppCard>

        <SectionHeader title="Top Customers" />
        <AppCard>
          {topCustomers.length === 0 ? (
            <AppText variant="bodySmall" color={COLORS.textSecondary}>No customer spend recorded yet.</AppText>
          ) : topCustomers.slice(0, 5).map((c) => (
            <Row key={c.customerId} left={c.name} right={formatCurrency(c.totalSpent)} />
          ))}
        </AppCard>

        <SectionHeader title="Seasonal Booking Pattern" />
        <AppCard>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 90 }}>
            {Object.entries(analytics?.seasonalBookingPattern || {}).map(([month, count]) => (
              <View key={month} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <View style={{
                  width: '55%', height: `${Math.max(4, (Number(count) / seasonalMax) * 100)}%`,
                  borderRadius: 4, backgroundColor: COLORS.primary,
                }} />
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', marginTop: 6 }}>
            {MONTH_SHORT.map((m, i) => (
              <View key={m} style={{ flex: 1, alignItems: 'center' }}>
                {i % 2 === 0 && <AppText variant="caption" color={COLORS.textSecondary}>{m}</AppText>}
              </View>
            ))}
          </View>
        </AppCard>

        <SectionHeader title="Peak Booking Hours" />
        <AppCard>
          {peakHours.length === 0 ? (
            <AppText variant="bodySmall" color={COLORS.textSecondary}>No bookings yet.</AppText>
          ) : peakHours.map(([hour, count]) => (
            <Row key={hour} left={HOUR_LABEL(Number(hour))} right={`${count} bookings`} />
          ))}
        </AppCard>
      </View>
    </ScreenWrapper>
  );
}
