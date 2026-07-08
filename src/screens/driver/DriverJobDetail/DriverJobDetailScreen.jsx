import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Linking } from 'react-native';
import * as Location from 'expo-location';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppBadge from '../../../components/ui/appcomponents/AppBadge';
import WorkTimerControls from '../../../components/agri/WorkTimerControls';
import { useToast } from '../../../components/ui/Toast';
import { bookingService, workService, locationService } from '../../../api/services';
import { formatDateTime, statusVariant } from '../../../utils/agriHelpers';

const LOCATION_PING_MS = 15000;

function Line({ label, value }) {
  const { COLORS } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 }}>
      <AppText variant="body" color={COLORS.textSecondary}>{label}</AppText>
      <AppText variant="bodyMedium" style={{ flex: 1, textAlign: 'right' }}>{value}</AppText>
    </View>
  );
}

export default function DriverJobDetailScreen({ navigation, route }) {
  const { COLORS } = useTheme();
  const toast = useToast();
  const [booking, setBooking] = useState(route?.params?.booking || {});
  const driverId = route?.params?.driverId;

  const [work, setWork] = useState(null);
  const [status, setStatus] = useState('IDLE');
  const [seconds, setSeconds] = useState(0);
  const tickRef = useRef(null);
  const locationPingRef = useRef(null);

  useEffect(() => {
    if (status === 'RUNNING') {
      tickRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (tickRef.current) {
      clearInterval(tickRef.current); tickRef.current = null;
    }
    return () => tickRef.current && clearInterval(tickRef.current);
  }, [status]);

  // While the job is running, ping the current GPS position so the
  // farmer/owner can see the driver's live location on their booking screen.
  const pingLocation = useCallback(async () => {
    try {
      const { status: perm } = await Location.requestForegroundPermissionsAsync();
      if (perm !== 'granted') return;
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      await locationService.update({
        driverId,
        bookingId: booking.bookingId,
        workId: work?.workId,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    } catch (e) { /* ignore single ping failures */ }
  }, [driverId, booking.bookingId, work?.workId]);

  useEffect(() => {
    if (status === 'RUNNING') {
      pingLocation();
      locationPingRef.current = setInterval(pingLocation, LOCATION_PING_MS);
    } else if (locationPingRef.current) {
      clearInterval(locationPingRef.current); locationPingRef.current = null;
    }
    return () => locationPingRef.current && clearInterval(locationPingRef.current);
  }, [status, pingLocation]);

  const openMaps = () => {
    if (booking.latitude && booking.longitude) {
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${booking.latitude},${booking.longitude}`);
    } else if (booking.location) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.location)}`);
    } else {
      toast?.error?.('No location available for this job');
    }
  };

  const onStart = useCallback(async () => {
    try {
      const res = await workService.start({
        ownerId: booking.ownerId,
        driverId,
        bookingId: booking.bookingId,
        tractorId: booking.tractorId || null,
        serviceType: booking.serviceType || 'Service',
      });
      setWork(res); setStatus('RUNNING'); setSeconds(0);
      toast?.success?.('Work started');
    } catch (e) { toast?.error?.(e?.message || 'Could not start'); }
  }, [booking, driverId]);

  const onPause = async () => {
    try { await workService.pause(work.workId); setStatus('PAUSED'); } catch (e) { toast?.error?.('Pause failed'); }
  };
  const onResume = async () => {
    try { await workService.resume(work.workId); setStatus('RUNNING'); } catch (e) { toast?.error?.('Resume failed'); }
  };
  const onStop = async () => {
    try {
      await workService.stop(work.workId);
      setStatus('IDLE'); setSeconds(0); setWork(null);
      await bookingService.complete(booking.bookingId);
      setBooking((b) => ({ ...b, status: 'COMPLETED' }));
      toast?.success?.('Job completed');
    } catch (e) { toast?.error?.('Stop failed'); }
  };

  const accepted = booking.status === 'ACCEPTED';
  const completed = booking.status === 'COMPLETED';

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Job Detail" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <AppCard>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <AppText variant="h5">{booking.serviceType || 'Service'}</AppText>
            <AppBadge label={booking.status || 'PENDING'} variant={statusVariant(booking.status)} />
          </View>
          <Line label="Requested" value={formatDateTime(booking.requestedDate)} />
          <Line label="Field size" value={booking.fieldSize || '-'} />
          <Line label="Duration" value={booking.duration || '-'} />
          <Line label="Location" value={booking.location || '-'} />
          {!!booking.notes && <Line label="Notes" value={booking.notes} />}
        </AppCard>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <AppButton label="Navigate" leftIcon="navigate-outline" variant="outline" style={{ flex: 1 }} onPress={openMaps} />
          <AppButton label="Message Farmer" leftIcon="chatbubble-outline" variant="outline" style={{ flex: 1 }}
            onPress={() => navigation.navigate('Chat', { ownerId: booking.ownerId, clientId: booking.clientId })} />
        </View>

        {accepted && (
          <View style={{ marginTop: 24 }}>
            <AppText variant="h5" align="center" style={{ marginBottom: 6 }}>Work Timer</AppText>
            <WorkTimerControls
              seconds={seconds} status={status}
              onStart={onStart} onPause={onPause} onResume={onResume} onStop={onStop}
            />
          </View>
        )}

        {completed && (
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <AppText variant="body" color={COLORS.success}>This job is completed.</AppText>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}
