import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import StatCard from '../../../components/agri/StatCard';
import SectionHeader from '../../../components/agri/SectionHeader';
import { useAuth } from '../../../providers/AuthProvider';
import { reportService } from '../../../api/services';
import { formatCurrency, formatDateTime } from '../../../utils/agriHelpers';

// Friendly, human-readable labels for raw AuditAction enum values coming
// back from the audit trail — reused as-is, never re-derived on the client.
const ACTION_LABEL = {
  CREATE: 'created',
  UPDATE: 'updated',
  DELETE: 'deleted',
  STATUS_CHANGE: 'changed status of',
  LOGIN: 'logged in',
  LOGIN_FAILED: 'failed to log in',
  LOGOUT: 'logged out',
  LOGOUT_ALL: 'logged out everywhere',
  PASSWORD_RESET: 'reset password',
  MPIN_RESET: 'reset MPIN',
};

function UtilizationBar({ label, percent, busy, total, tint, icon }) {
  const { COLORS } = useTheme();
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={styles.utilHeaderRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name={icon} size={16} color={tint} style={{ marginRight: 6 }} />
          <AppText variant="bodySmall">{label}</AppText>
        </View>
        <AppText variant="captionBold" color={tint}>
          {busy}/{total} · {percent}%
        </AppText>
      </View>
      <View style={[styles.trackBg, { backgroundColor: COLORS.borderLight }]}>
        <View style={[styles.trackFill, { width: `${Math.min(100, percent)}%`, backgroundColor: tint }]} />
      </View>
    </View>
  );
}

function MonthlyRevenueChart({ points }) {
  const { COLORS } = useTheme();
  const max = Math.max(1, ...points.map((p) => Number(p.revenue) || 0));
  return (
    <View style={styles.chartRow}>
      {points.map((p) => {
        const heightPct = Math.max(4, (Number(p.revenue) / max) * 100);
        const [, month] = String(p.month).split('-');
        return (
          <View key={p.month} style={styles.chartCol}>
            <View style={styles.chartBarTrack}>
              <View style={[styles.chartBarFill, { height: `${heightPct}%`, backgroundColor: COLORS.primary }]} />
            </View>
            <AppText variant="caption" color={COLORS.textSecondary} style={{ marginTop: 6 }}>
              {month}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

export default function FleetDashboardScreen({ navigation }) {
  const { COLORS, SHADOWS, SIZES } = useTheme();
  const { ownerId } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!ownerId) return;
    try {
      const res = await reportService.fleetDashboard(ownerId);
      setData(res);
    } catch (e) {
      // best-effort — keep last-known data on screen if a refresh fails
    } finally {
      setLoading(false);
    }
  }, [ownerId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  return (
    <ScreenWrapper
      scroll paddingHorizontal={0} onRefresh={onRefresh} refreshing={refreshing}
      header={<AppHeader title="Fleet Dashboard" subtitle="Live overview of your business" variant="primary" showBack />}
    >
      <View style={{ paddingHorizontal: SIZES.padding.container, paddingTop: 12 }}>

        {loading && !data ? (
          <AppCard style={{ alignItems: 'center', paddingVertical: 40 }}>
            <AppText variant="bodySmall" color={COLORS.textSecondary}>Loading your fleet overview…</AppText>
          </AppCard>
        ) : !data ? (
          <AppEmptyState variant="error" title="Couldn't load dashboard"
            subtitle="Pull down to try again." cta={{ label: 'Retry', onPress: load }} />
        ) : (
          <>
            {/* Revenue KPIs */}
            <View style={styles.row}>
              <StatCard icon="today" label="Today's Revenue" tint={COLORS.success}
                value={formatCurrency(data.todayRevenue)} onPress={() => navigation.navigate('PaymentTracking')} />
              <View style={{ width: 12 }} />
              <StatCard icon="calendar" label="This Month" tint={COLORS.info}
                value={formatCurrency(data.monthRevenue)} onPress={() => navigation.navigate('Reports')} />
            </View>
            <View style={[styles.row, { marginTop: 12 }]}>
              <StatCard icon="wallet" label="Total Revenue" tint={COLORS.primary}
                value={formatCurrency(data.totalRevenue)} onPress={() => navigation.navigate('Reports')} />
              <View style={{ width: 12 }} />
              <StatCard icon="alert-circle" label="Pending Payments" tint={COLORS.warning}
                value={formatCurrency(data.pendingPaymentsAmount)} onPress={() => navigation.navigate('PaymentTracking')} />
            </View>

            {/* Job / booking KPIs */}
            <View style={[styles.row, { marginTop: 12 }]}>
              <StatCard icon="timer" label="Active Jobs" tint={COLORS.secondary}
                value={data.activeJobsCount} onPress={() => navigation.navigate('OwnerTabs', { screen: 'Work' })} />
              <View style={{ width: 12 }} />
              <StatCard icon="calendar-outline" label="Today's Bookings" tint={COLORS.primary}
                value={data.todaysBookingsCount} onPress={() => navigation.navigate('BookingRequests')} />
            </View>
            <View style={[styles.row, { marginTop: 12 }]}>
              <StatCard icon="hourglass-outline" label="Upcoming Jobs" tint={COLORS.info}
                value={data.upcomingJobsCount} onPress={() => navigation.navigate('BookingRequests')} />
              <View style={{ width: 12 }} />
              <StatCard icon="construct-outline" label="Maintenance Due" tint={COLORS.error ?? COLORS.warning}
                value={data.upcomingMaintenance?.length ?? 0} onPress={() => navigation.navigate('MaintenanceLog')} />
            </View>

            {/* Utilization */}
            <SectionHeader title="Fleet Utilization" />
            <AppCard>
              <UtilizationBar
                label="Tractor Utilization" icon="construct" tint={COLORS.primary}
                percent={data.tractorUtilizationPercent} busy={data.busyTractors} total={data.totalTractors}
              />
              <UtilizationBar
                label="Driver Utilization" icon="person" tint={COLORS.secondary}
                percent={data.driverUtilizationPercent} busy={data.busyDrivers} total={data.totalDrivers}
              />
            </AppCard>

            {/* Monthly revenue chart */}
            <SectionHeader title="Revenue — Last 6 Months" />
            <AppCard>
              {(data.monthlyRevenueChart?.length ?? 0) === 0 ? (
                <AppText variant="bodySmall" color={COLORS.textSecondary}>No revenue recorded yet.</AppText>
              ) : (
                <MonthlyRevenueChart points={data.monthlyRevenueChart} />
              )}
            </AppCard>

            {/* Upcoming maintenance */}
            <SectionHeader title="Upcoming Maintenance"
              actionLabel={data.upcomingMaintenance?.length ? 'View all' : undefined}
              onAction={() => navigation.navigate('MaintenanceLog')} />
            {(data.upcomingMaintenance?.length ?? 0) === 0 ? (
              <AppCard>
                <AppText variant="bodySmall" color={COLORS.textSecondary}>All tractors are up to date. Nice work!</AppText>
              </AppCard>
            ) : (
              data.upcomingMaintenance.slice(0, 5).map((m) => (
                <AppCard key={m.tractorId} style={{ marginBottom: 10 }} onPress={() => navigation.navigate('MaintenanceLog')}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                      <AppText variant="bodyMedium">{m.model || 'Tractor'}</AppText>
                      <AppText variant="caption" color={COLORS.textSecondary}>{m.registrationNumber}</AppText>
                    </View>
                    <View style={[styles.badge, { backgroundColor: (COLORS.error ?? COLORS.warning) + '22' }]}>
                      <AppText variant="caption" color={COLORS.error ?? COLORS.warning}>
                        {m.lastMaintenanceDate ? `${m.daysSinceLastMaintenance}d ago` : 'Never serviced'}
                      </AppText>
                    </View>
                  </View>
                </AppCard>
              ))
            )}

            {/* Recent activity */}
            <SectionHeader title="Recent Activity" />
            {(data.recentActivities?.length ?? 0) === 0 ? (
              <AppCard>
                <AppText variant="bodySmall" color={COLORS.textSecondary}>No recent activity.</AppText>
              </AppCard>
            ) : (
              <AppCard>
                {data.recentActivities.map((a, idx) => (
                  <View key={a.auditId ?? idx}
                    style={[styles.activityRow, idx < data.recentActivities.length - 1 && { borderBottomWidth: 1, borderBottomColor: COLORS.borderLight }]}>
                    <View style={[styles.activityDot, { backgroundColor: COLORS.primary }]} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <AppText variant="bodySmall">
                        {ACTION_LABEL[a.action] || a.action?.toLowerCase()} {a.entityType}
                        {a.entityId ? ` #${a.entityId}` : ''}
                      </AppText>
                      <AppText variant="caption" color={COLORS.textSecondary}>{formatDateTime(a.createdAt)}</AppText>
                    </View>
                  </View>
                ))}
              </AppCard>
            )}
          </>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  utilHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  trackBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  trackFill: { height: 8, borderRadius: 4 },
  chartRow: { flexDirection: 'row', alignItems: 'flex-end', height: 140, justifyContent: 'space-between' },
  chartCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  chartBarTrack: { width: 18, height: '85%', justifyContent: 'flex-end' },
  chartBarFill: { width: 18, borderRadius: 6 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  activityRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10 },
  activityDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
});
