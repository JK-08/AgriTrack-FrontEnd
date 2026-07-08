import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppBadge from '../../../components/ui/appcomponents/AppBadge';
import { useToast } from '../../../components/ui/Toast';
import { bookingService, locationService } from '../../../api/services';
import { formatDateTime, statusVariant } from '../../../utils/agriHelpers';

const STEPS = ['PENDING', 'ACCEPTED', 'COMPLETED'];
const LOCATION_POLL_MS = 15000;

export default function BookingStatusScreen({ navigation, route }) {
  const { COLORS } = useTheme();
  const toast = useToast();
  const [booking, setBooking] = useState(route?.params?.booking || {});
  const [driverLocation, setDriverLocation] = useState(null);
  const pollRef = useRef(null);
  const stepIndex = STEPS.indexOf((booking.status || 'PENDING').toUpperCase());

  // While the booking is accepted (i.e. a driver may be on the way / working),
  // poll for the driver's last known GPS position and show it on a small map.
  useEffect(() => {
    const poll = async () => {
      if (!booking.bookingId || booking.status !== 'ACCEPTED') return;
      try {
        const loc = await locationService.latestByBooking(booking.bookingId);
        if (loc) setDriverLocation(loc);
      } catch (e) { /* no location yet */ }
    };
    if (booking.status === 'ACCEPTED') {
      poll();
      pollRef.current = setInterval(poll, LOCATION_POLL_MS);
    }
    return () => pollRef.current && clearInterval(pollRef.current);
  }, [booking.bookingId, booking.status]);

  const cancel = async () => {
    try { await bookingService.cancel(booking.bookingId); setBooking({ ...booking, status: 'CANCELLED' }); toast?.success?.('Cancelled'); }
    catch (e) { toast?.error?.('Could not cancel'); }
  };

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Booking Status" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <AppCard>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <AppText variant="h5">{booking.serviceType || 'Service'}</AppText>
            <AppBadge label={booking.status || 'PENDING'} variant={statusVariant(booking.status)} />
          </View>
          {STEPS.map((s, i) => (
            <View key={s} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center',
                backgroundColor: i <= stepIndex ? COLORS.success : COLORS.border }}>
                <AppText variant="caption" color={COLORS.white}>{i + 1}</AppText>
              </View>
              <AppText variant="body" style={{ marginLeft: 12 }}
                color={i <= stepIndex ? COLORS.textPrimary : COLORS.textTertiary}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </AppText>
            </View>
          ))}
          <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 10 }} />
          <AppText variant="caption" color={COLORS.textSecondary}>Requested {formatDateTime(booking.requestedDate)}</AppText>
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

        {booking.status === 'COMPLETED' && (
          <AppButton label="Rate & Review" leftIcon="star" style={{ marginTop: 18 }}
            onPress={() => navigation.navigate('Rating', { booking })} />
        )}
        {(booking.status === 'PENDING' || booking.status === 'ACCEPTED') && (
          <AppButton label="Cancel Booking" variant="danger" leftIcon="close-circle-outline" style={{ marginTop: 18 }} onPress={cancel} />
        )}
        <AppButton label="Message Owner" variant="outline" leftIcon="chatbubble-outline" style={{ marginTop: 12 }}
          onPress={() => navigation.navigate('Chat', { ownerId: booking.ownerId, clientId: booking.clientId })} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  map: { width: '100%', height: 200, borderRadius: 14, overflow: 'hidden' },
});
