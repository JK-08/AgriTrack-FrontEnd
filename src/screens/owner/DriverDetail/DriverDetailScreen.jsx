import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppLoader from '../../../components/ui/appcomponents/AppLoader';
import ListRow from '../../../components/agri/ListRow';
import { useToast } from '../../../components/ui/Toast';
import { driverService, bookingService } from '../../../api/services';
import { formatDateTime, statusVariant } from '../../../utils/agriHelpers';

function Line({ label, value }) {
  const { COLORS } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 }}>
      <AppText variant="body" color={COLORS.textSecondary}>{label}</AppText>
      <AppText variant="bodyMedium" style={{ flex: 1, textAlign: 'right' }}>{value}</AppText>
    </View>
  );
}

export default function DriverDetailScreen({ navigation, route }) {
  const { COLORS } = useTheme();
  const toast = useToast();
  const [driver, setDriver] = useState(route?.params?.driver || {});
  const [jobs, setJobs] = useState([]);

  const load = useCallback(async () => {
    try {
      const r = await bookingService.byDriver(driver.driverId);
      setJobs(Array.isArray(r) ? r : []);
    } catch (e) {}
  }, [driver.driverId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onDelete = async () => {
    try { await driverService.remove(driver.driverId); toast?.success?.('Driver removed'); navigation.goBack(); }
    catch (e) { toast?.error?.(e?.message || 'Delete failed'); }
  };

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title={`Driver #${driver.driverId}`} variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <AppCard>
          <Line label="License number" value={driver.licenseNumber || '-'} />
          <Line label="Status" value={driver.status || 'ACTIVE'} />
          <Line label="Available" value={driver.isAvailable ? 'Yes' : 'No'} />
          {!!driver.notes && <Line label="Notes" value={driver.notes} />}
        </AppCard>

        <View style={{ flexDirection: 'row', marginTop: 14 }}>
          <AppButton label="Attendance" leftIcon="calendar-outline" variant="outline" size="sm"
            onPress={() => navigation.navigate('DriverAttendance', { driver })} style={{ flex: 1, marginRight: 8 }} />
          <AppButton label="Payroll" leftIcon="cash-outline" variant="outline" size="sm"
            onPress={() => navigation.navigate('DriverPayroll', { driver })} style={{ flex: 1 }} />
        </View>

        <AppText variant="h5" style={{ marginTop: 20, marginBottom: 10 }}>Assigned Jobs</AppText>
        {jobs.length === 0 ? (
          <AppText variant="bodySmall" color={COLORS.textSecondary}>No jobs assigned yet.</AppText>
        ) : jobs.map((j) => (
          <ListRow key={j.bookingId} icon="calendar-outline" title={j.serviceType || 'Service'}
            subtitle={formatDateTime(j.requestedDate)} status={j.status} statusVariant={statusVariant(j.status)}
            onPress={() => navigation.navigate('BookingDetail', { booking: j })} />
        ))}

        <AppButton label="Remove Driver" variant="danger" leftIcon="trash-outline" onPress={onDelete} style={{ marginTop: 24 }} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({});
