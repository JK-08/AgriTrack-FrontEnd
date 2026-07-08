import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppSwitch from '../../../components/ui/appcomponents/AppSwitch';
import StatCard from '../../../components/agri/StatCard';
import SectionHeader from '../../../components/agri/SectionHeader';
import ListRow from '../../../components/agri/ListRow';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import AppLoader from '../../../components/ui/appcomponents/AppLoader';
import { useAuth } from '../../../providers/AuthProvider';
import { useToast } from '../../../components/ui/Toast';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import { driverService, bookingService, workService, attendanceService } from '../../../api/services';
import { formatDateTime, formatDuration, statusVariant } from '../../../utils/agriHelpers';

export default function DriverDashboardScreen({ navigation }) {
  const { COLORS, SIZES, isDark, toggleTheme } = useTheme();
  const { user, ownerId: userId } = useAuth();
  const toast = useToast();

  const [driver, setDriver] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [clockBusy, setClockBusy] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const d = await driverService.byUser(userId);
      setDriver(d);
      if (d?.driverId) {
        const today = new Date().toISOString().slice(0, 10);
        const [b, w, attendance] = await Promise.all([
          bookingService.byDriver(d.driverId),
          workService.byDriver(d.driverId),
          attendanceService.byDriver(d.driverId, today, today).catch(() => []),
        ]);
        const bookings = Array.isArray(b) ? b : [];
        setJobs(bookings.filter((x) => x.status === 'ACCEPTED' || x.status === 'PENDING'));
        setCompletedCount((Array.isArray(w) ? w : []).filter((x) => x.status === 'COMPLETED').length);
        setTodayAttendance((Array.isArray(attendance) && attendance[0]) || null);
      }
    } catch (e) {
      // no driver profile yet
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const toggleAvailability = async (value) => {
    if (!driver?.driverId) return;
    try {
      const updated = await driverService.setAvailability(driver.driverId, value);
      setDriver(updated);
    } catch (e) {}
  };

  const clockIn = async () => {
    if (!driver?.driverId) return;
    setClockBusy(true);
    try {
      const result = await attendanceService.clockIn(driver.driverId);
      setTodayAttendance(result);
      toast?.success?.('Clocked in');
    } catch (e) {
      toast?.error?.(e?.message || 'Could not clock in');
    } finally {
      setClockBusy(false);
    }
  };

  const clockOut = async () => {
    if (!driver?.driverId) return;
    setClockBusy(true);
    try {
      const result = await attendanceService.clockOut(driver.driverId);
      setTodayAttendance(result);
      toast?.success?.('Clocked out');
    } catch (e) {
      toast?.error?.(e?.message || 'Could not clock out');
    } finally {
      setClockBusy(false);
    }
  };

  if (loading && !driver) return <AppLoader mode="inline" message="Loading..." />;

  if (!driver) {
    return (
      <ScreenWrapper header={<AppHeader title={`Hi, ${user?.name || 'Driver'}`} variant="primary" />}>
        <AppEmptyState title="Driver profile not set up" subtitle="Ask your owner to add you as a driver." />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scroll onRefresh={onRefresh} refreshing={refreshing} paddingHorizontal={0}
      header={
        <AppHeader
          title={`Hi, ${user?.name || 'Driver'}`}
          subtitle="Here are your jobs today"
          variant="primary"
          actions={[{ iconName: isDark ? 'sunny-outline' : 'moon-outline', onPress: toggleTheme }]}
        />
      }
    >
      <View style={{ paddingHorizontal: SIZES.padding.container }}>
        <AppCard style={{ marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <AppText variant="bodyMedium">Today's Attendance</AppText>
              <AppText variant="caption" color={COLORS.textSecondary}>
                {todayAttendance?.clockInTime && !todayAttendance?.clockOutTime
                  ? `Clocked in at ${formatDateTime(todayAttendance.clockInTime)}`
                  : todayAttendance?.clockOutTime
                    ? `Clocked out at ${formatDateTime(todayAttendance.clockOutTime)}`
                    : 'Not clocked in yet'}
              </AppText>
            </View>
            <AppButton
              label={todayAttendance?.clockInTime && !todayAttendance?.clockOutTime ? 'Clock Out' : 'Clock In'}
              variant={todayAttendance?.clockInTime && !todayAttendance?.clockOutTime ? 'danger' : 'primary'}
              size="sm"
              loading={clockBusy}
              disabled={!!todayAttendance?.clockOutTime}
              onPress={todayAttendance?.clockInTime && !todayAttendance?.clockOutTime ? clockOut : clockIn}
            />
          </View>
        </AppCard>

        <View style={styles.availabilityRow}>
          <View style={{ flex: 1 }}>
            <AppText variant="bodyMedium">Available for jobs</AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>
              {driver.isAvailable ? 'You will receive new job assignments' : 'You will not receive new jobs'}
            </AppText>
          </View>
          <AppSwitch value={!!driver.isAvailable} onValueChange={toggleAvailability} />
        </View>

        <View style={styles.row}>
          <StatCard icon="clipboard" label="Active Jobs" tint={COLORS.primary}
            value={jobs.length} onPress={() => navigation.navigate('Jobs')} />
          <View style={{ width: 12 }} />
          <StatCard icon="checkmark-done" label="Completed" tint={COLORS.success}
            value={completedCount} onPress={() => navigation.navigate('Earnings')} />
        </View>

        <SectionHeader title="Your Jobs" actionLabel="See all" onAction={() => navigation.navigate('Jobs')} />
        {jobs.slice(0, 5).map((item) => (
          <ListRow key={item.bookingId} icon="calendar-outline" title={item.serviceType || 'Service request'}
            subtitle={`${item.location ? item.location + ' · ' : ''}${formatDateTime(item.requestedDate)}`}
            status={item.status} statusVariant={statusVariant(item.status)}
            onPress={() => navigation.navigate('DriverJobDetail', { booking: item, driverId: driver.driverId })} />
        ))}
        {jobs.length === 0 && (
          <AppEmptyState title="No jobs assigned" subtitle="New jobs assigned by your owner will show here." />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginTop: 12 },
  availabilityRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
});
