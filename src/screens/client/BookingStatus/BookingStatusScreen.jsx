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

const STEPS = ['PENDING', 'ACCEPTED', 'COMPLETED'];

export default function BookingStatusScreen({ navigation, route }) {
  const { COLORS } = useTheme();
  const toast = useToast();
  const [booking, setBooking] = useState(route?.params?.booking || {});
  const stepIndex = STEPS.indexOf((booking.status || 'PENDING').toUpperCase());

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
