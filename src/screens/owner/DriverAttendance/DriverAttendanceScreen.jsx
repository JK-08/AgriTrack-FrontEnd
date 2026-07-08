import React, { useCallback, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppInput from '../../../components/ui/appcomponents/AppInput';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppModal from '../../../components/ui/appcomponents/AppModal';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import ListRow from '../../../components/agri/ListRow';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../providers/AuthProvider';
import { attendanceService } from '../../../api/services';
import { formatDate, formatDateTime, minutesToLabel, statusVariant } from '../../../utils/agriHelpers';

export default function DriverAttendanceScreen({ route }) {
  const { COLORS, SIZES } = useTheme();
  const toast = useToast();
  const { ownerId } = useAuth();
  const driver = route?.params?.driver || {};

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reason, setReason] = useState('');
  const [leaveDate, setLeaveDate] = useState(new Date().toISOString().slice(0, 10));

  const load = useCallback(async () => {
    if (!ownerId || !driver.driverId) return;
    try {
      const res = await attendanceService.searchPaged(ownerId, {
        driverId: driver.driverId, page: 0, size: 60, sortBy: 'attendanceDate', sortDir: 'desc',
      });
      setItems(res?.content || []);
    } catch (e) {
      toast?.error?.('Could not load attendance');
    } finally {
      setLoading(false);
    }
  }, [ownerId, driver.driverId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const submitLeave = async () => {
    setSaving(true);
    try {
      await attendanceService.markLeave({ driverId: driver.driverId, date: leaveDate, reason });
      toast?.success?.('Leave marked');
      setOpen(false);
      setReason('');
      load();
    } catch (e) {
      toast?.error?.(e?.message || 'Failed to mark leave');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenWrapper paddingHorizontal={0} onRefresh={onRefresh} refreshing={refreshing}
      header={
        <AppHeader title="Attendance" subtitle={driver.licenseNumber ? `License ${driver.licenseNumber}` : `Driver #${driver.driverId}`}
          variant="primary" showBack actions={[{ iconName: 'add', onPress: () => setOpen(true) }]} />
      }
    >
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.attendanceId)}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding.container, paddingTop: 14, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <ListRow
            icon={item.status === 'LEAVE' ? 'airplane-outline' : item.status === 'ABSENT' ? 'close-circle-outline' : 'checkmark-circle-outline'}
            title={formatDate(item.attendanceDate)}
            subtitle={item.clockInTime
              ? `${formatDateTime(item.clockInTime)} ${item.clockOutTime ? '→ ' + formatDateTime(item.clockOutTime) : '(active)'}`
              : (item.leaveReason || 'No clock-in recorded')}
            value={item.overtimeMinutes > 0 ? `+${minutesToLabel(item.overtimeMinutes)} OT` : undefined}
            status={item.status} statusVariant={statusVariant(item.status)}
          />
        )}
        ListEmptyComponent={
          !loading && (
            <AppEmptyState variant="no-data" title="No attendance records"
              subtitle="Clock-ins and leave for this driver will show here."
              cta={{ label: 'Mark Leave', onPress: () => setOpen(true), icon: '🗓️' }} />
          )
        }
      />

      <AppModal visible={open} onClose={() => setOpen(false)} title="Mark Leave" position="bottom">
        <AppInput label="Date (YYYY-MM-DD)" value={leaveDate} onChangeText={setLeaveDate} />
        <AppInput label="Reason" value={reason} onChangeText={setReason} />
        <AppButton label="Mark as Leave" onPress={submitLeave} loading={saving} style={{ marginTop: 8 }} />
      </AppModal>
    </ScreenWrapper>
  );
}
