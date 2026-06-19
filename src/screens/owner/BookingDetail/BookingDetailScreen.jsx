import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppBadge from '../../../components/ui/appcomponents/AppBadge';
import { useToast } from '../../../components/ui/Toast';
import { bookingService } from '../../../api/services';
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

export default function BookingDetailScreen({ navigation, route }) {
  const toast = useToast();
  const [booking, setBooking] = useState(route?.params?.booking || {});
  const [busy, setBusy] = useState(false);

  const act = async (fn, status) => {
    setBusy(true);
    try { await fn(booking.bookingId); setBooking({ ...booking, status }); toast?.success?.(status); }
    catch (e) { toast?.error?.(e?.message || 'Action failed'); }
    finally { setBusy(false); }
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
          <AppButton label="Mark Completed" leftIcon="checkmark-done" onPress={() => act(bookingService.complete, 'COMPLETED')} loading={busy} style={{ marginTop: 18 }} />
        )}
        <AppButton label="Message Customer" variant="outline" leftIcon="chatbubble-outline" style={{ marginTop: 12 }}
          onPress={() => navigation.navigate('Chat', { ownerId: booking.ownerId, clientId: booking.clientId })} />
      </View>
    </ScreenWrapper>
  );
}
