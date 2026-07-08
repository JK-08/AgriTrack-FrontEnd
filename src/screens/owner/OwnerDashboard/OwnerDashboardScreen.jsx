import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import StatCard from '../../../components/agri/StatCard';
import SectionHeader from '../../../components/agri/SectionHeader';
import { useAuth } from '../../../providers/AuthProvider';
import { reportService } from '../../../api/services';
import { formatCurrency } from '../../../utils/agriHelpers';

const QUICK = [
  { label: 'Start Work',  icon: 'timer',         to: 'Work',              tab: true },
  { label: 'Customers',   icon: 'people',        to: 'Customers',         tab: true },
  { label: 'Rates',       icon: 'pricetags',     to: 'Rates' },
  { label: 'Invoices',    icon: 'receipt',       to: 'InvoiceList' },
  { label: 'Tractors',    icon: 'construct',     to: 'TractorManagement' },
  { label: 'Bookings',    icon: 'calendar',      to: 'BookingRequests' },
  { label: 'Payments',    icon: 'cash',          to: 'PaymentTracking' },
  { label: 'Expenses',    icon: 'wallet',        to: 'ExpenseList' },
  { label: 'Profit/Loss', icon: 'stats-chart',   to: 'ProfitLoss' },
  { label: 'Reports',     icon: 'bar-chart',     to: 'Reports' },
];

export default function OwnerDashboardScreen({ navigation }) {
  const { COLORS, SHADOWS, SIZES, isDark, toggleTheme } = useTheme();
  const { user, ownerId } = useAuth();
  const [summary, setSummary] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!ownerId) return;
    try { setSummary(await reportService.ownerSummary(ownerId)); } catch (e) {}
  }, [ownerId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const go = (item) => {
    if (item.tab) navigation.navigate('OwnerTabs', { screen: item.to });
    else navigation.navigate(item.to);
  };

  return (
    <ScreenWrapper
      scroll onRefresh={onRefresh} refreshing={refreshing} paddingHorizontal={0}
      header={
        <AppHeader
          title={`Hi, ${user?.name || 'Owner'}`}
          subtitle="Here's your overview"
          variant="primary"
          actions={[
            { iconName: isDark ? 'sunny-outline' : 'moon-outline', onPress: toggleTheme },
            { iconName: 'notifications-outline', onPress: () => navigation.navigate('Notifications') },
            { iconName: 'person-circle-outline', onPress: () => navigation.navigate('OwnerProfile') },
          ]}
        />
      }
    >
      <View style={{ paddingHorizontal: SIZES.padding.container }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('FleetDashboard')}
          style={[styles.heroBanner, { backgroundColor: COLORS.primary, ...SHADOWS.md }]}
        >
          <View style={{ flex: 1 }}>
            <AppText variant="h5" color={COLORS.white}>Fleet Dashboard</AppText>
            <AppText variant="caption" color={COLORS.white} style={{ opacity: 0.85, marginTop: 2 }}>
              Live KPIs, utilization, revenue trends & more
            </AppText>
          </View>
          <View style={[styles.heroIcon, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Ionicons name="speedometer" size={22} color={COLORS.white} />
          </View>
        </TouchableOpacity>

        <View style={styles.row}>
          <StatCard icon="cash" label="Total Revenue" tint={COLORS.success}
            value={formatCurrency(summary?.totalRevenue)} onPress={() => navigation.navigate('PaymentTracking')} />
          <View style={{ width: 12 }} />
          <StatCard icon="time" label="Pending Due" tint={COLORS.warning}
            value={formatCurrency(summary?.pendingDue)} onPress={() => navigation.navigate('PaymentTracking')} />
        </View>
        <View style={[styles.row, { marginTop: 12 }]}>
          <StatCard icon="people" label="Customers" tint={COLORS.primary}
            value={summary?.totalCustomers ?? 0} onPress={() => navigation.navigate('OwnerTabs', { screen: 'Customers' })} />
          <View style={{ width: 12 }} />
          <StatCard icon="checkmark-done" label="Completed Jobs" tint={COLORS.info}
            value={summary?.completedWorks ?? 0} onPress={() => navigation.navigate('OwnerTabs', { screen: 'History' })} />
        </View>

        <SectionHeader title="Quick Actions" />
        <View style={styles.grid}>
          {QUICK.map((q) => (
            <TouchableOpacity key={q.label} activeOpacity={0.85} onPress={() => go(q)}
              style={[styles.tile, { backgroundColor: COLORS.card, borderRadius: SIZES.radius.lg, ...SHADOWS.sm }]}>
              <View style={[styles.tileIcon, { backgroundColor: COLORS.primaryPale }]}>
                <Ionicons name={q.icon} size={22} color={COLORS.primary} />
              </View>
              <AppText variant="caption" align="center" style={{ marginTop: 6 }}>{q.label}</AppText>
            </TouchableOpacity>
          ))}
        </View>

        {summary?.pendingBookings > 0 && (
          <TouchableOpacity onPress={() => navigation.navigate('BookingRequests')}
            style={[styles.alert, { backgroundColor: COLORS.primaryPale }]}>
            <Ionicons name="notifications" size={20} color={COLORS.primary} />
            <AppText variant="bodySmall" style={{ flex: 1, marginLeft: 10 }}>
              {summary.pendingBookings} pending booking request(s)
            </AppText>
            <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  row:        { flexDirection: 'row' },
  grid:       { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  tile:       { width: '22%', margin: '1.5%', paddingVertical: 14, alignItems: 'center' },
  tileIcon:   { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  alert:      { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginTop: 18 },
  heroBanner: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 18, marginBottom: 14 },
  heroIcon:   { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
