import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppInput from '../../../components/ui/appcomponents/AppInput';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../providers/AuthProvider';
import { ratingService } from '../../../api/services';

export default function RatingScreen({ navigation, route }) {
  const { COLORS } = useTheme();
  const toast = useToast();
  const { ownerId: myId } = useAuth();
  const booking = route?.params?.booking || {};
  const [stars, setStars] = useState(5);
  const [review, setReview] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      await ratingService.create({
        bookingId: booking.bookingId, clientId: myId, ownerId: booking.ownerId,
        ratingValue: stars, review,
      });
      toast?.success?.('Thanks for your feedback');
      navigation.goBack();
    } catch (e) { toast?.error?.(e?.message || 'Could not submit'); }
    finally { setBusy(false); }
  };

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Rate Service" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 20, alignItems: 'center' }}>
        <AppText variant="h5">How was the service?</AppText>
        <View style={{ flexDirection: 'row', marginVertical: 20 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity key={n} onPress={() => setStars(n)} style={{ paddingHorizontal: 4 }}>
              <Ionicons name={n <= stars ? 'star' : 'star-outline'} size={40} color={COLORS.secondary} />
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ width: '100%' }}>
          <AppInput label="Write a review (optional)" value={review} onChangeText={setReview} multiline />
          <AppButton label="Submit Review" onPress={submit} loading={busy} style={{ marginTop: 8 }} />
        </View>
      </View>
    </ScreenWrapper>
  );
}
