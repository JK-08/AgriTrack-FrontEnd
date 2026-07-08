import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppBadge from '../../../components/ui/appcomponents/AppBadge';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../providers/AuthProvider';
import { bookingService, driverService, locationService } from '../../../api/services';
import { formatDateTime, statusVariant } from '../../../utils/agriHelpers';

const LOCATION_POLL_MS = 15000;

function Line({ label, value }) {
  const { COLORS } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 }}>
      <AppText variant="body" color={COLORS.textSecondary}>{label}</AppText>
      <AppText variant="bodyMedium" style={{ flex: 1, textAlign: 'right' }}>{value}</AppText>
    </View>
  );
}

export default function BookingDetailScreen({ navigation, route }) {
  const toast = useToast();
  const { ownerId } = useAuth();
  const [booking, setBooking] = useState(route?.params?.booking || {});
  const [busy, setBusy] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState(booking.driverId || '');
  const [assigning, setAssigning] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);
  const pollRef = useRef(null);

  useEffect(() => {
    const poll = async () => {
      if (!booking.bookingId || booking.status !== 'ACCEPTED' || !booking.driverId) return;
      try {
        const loc = await locationService.latestByBooking(booking.bookingId);
        if (loc) setDriverLocation(loc);
      } catch (e) { /* no location yet */ }
    };
    if (booking.status === 'ACCEPTED' && booking.driverId) {
      poll();
      pollRef.current = setInterval(poll, LOCATION_POLL_MS);
    }
    return () => pollRef.current && clearInterval(pollRef.current);
  }, [booking.bookingId, booking.status, booking.driverId]);

  const loadDrivers = useCallback(async () => {
    if (!ownerId) return;
    try {
      const r = await driverService.byOwner(ownerId);
      setDrivers(Array.isArray(r) ? r : []);
    } catch (e) { setDrivers([]); }
  }, [ownerId]);

  useFocusEffect(useCallback(() => { loadDrivers(); }, [loadDrivers]));

  const act = async (fn, status) => {
    setBusy(true);
    try { await fn(booking.bookingId); setBooking({ ...booking, status }); toast?.success?.(status); }
    catch (e) { toast?.error?.(e?.message || 'Action failed'); }
    finally { setBusy(false); }
  };

  const onAssignDriver = async () => {
    if (!selectedDriverId) { toast?.error?.('Select a driver'); return; }
    setAssigning(true);
    try {
      const updated = await bookingService.assignDriver(booking.bookingId, selectedDriverId, booking.tractorId);
      setBooking(updated);
      toast?.success?.('Driver assigned');
    } catch (e) { toast?.error?.(e?.message || 'Could not assign driver'); }
    finally { setAssigning(false); }
  };

  const pending = booking.status === 'PENDING';
  const accepted = booking.status === 'ACCEPTED';

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Booking" variant="primary" showBack />}>
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

        {pending && (
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
            <AppButton label="Accept" leftIcon="checkmark" onPress={() => act(bookingService.accept, 'ACCEPTED')} loading={busy} style={{ flex: 1 }} />
            <AppButton label="Reject" variant="danger" leftIcon="close" onPress={() => act(bookingService.reject, 'REJECTED')} loading={busy} style={{ flex: 1 }} />
          </View>
        )}
        {accepted && (
          <>
            <AppCard style={{ marginTop: 18 }}>
              <AppText variant="label" style={{ marginBottom: 8 }}>Assign Driver</AppText>
              <View style={{ borderWidth: 1, borderRadius: 10, overflow: 'hidden' }}>
                <Picker selectedValue={selectedDriverId} onValueChange={setSelectedDriverId}>
                  <Picker.Item label="Select driver..." value="" />
                  {drivers.map((d) => (
                    <Picker.Item key={d.driverId} label={`Driver #${d.driverId}${d.isAvailable ? '' : ' (busy)'}`} value={d.driverId} />
                  ))}
                </Picker>
              </View>
              <AppButton label={booking.driverId ? 'Reassign Driver' : 'Assign Driver'} leftIcon="person-add-outline"
                onPress={onAssignDriver} loading={assigning} style={{ marginTop: 10 }} />
            </AppCard>

            {!!driverLocation && (
              <View style={{ marginTop: 14 }}>
                <AppText variant="label" style={{ marginBottom: 8 }}>Driver's Live Location</AppText>
                <MapView
                  style={styles.map}
                  region={{
                    latitude: driverLocation.latitude,
                    longitude: driverLocation.longitude,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                  }}
                >
                  <Marker coordinate={{ latitude: driverLocation.latitude, longitude: driverLocation.longitude }} title="Driver" />
                </MapView>
              </View>
            )}

            <AppButton label="Mark Completed" leftIcon="checkmark-done" onPress={() => act(bookingService.complete, 'COMPLETED')} loading={busy} style={{ marginTop: 12 }} />
          </>
        )}
        <AppButton label="Message Customer" variant="outline" leftIcon="chatbubble-outline" style={{ marginTop: 12 }}
          onPress={() => navigation.navigate('Chat', { ownerId: booking.ownerId, clientId: booking.clientId })} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  map: { width: '100%', height: 200, borderRadius: 14, overflow: 'hidden' },
});
