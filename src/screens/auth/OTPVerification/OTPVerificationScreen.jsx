import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppOTPInput from '../../../components/ui/appcomponents/AppOTPInput';
import { useToast } from '../../../components/ui/Toast';
import { authService, mpinService } from '../../../api/services';

export default function OTPVerificationScreen({ navigation, route }) {
  const { COLORS } = useTheme();
  const toast = useToast();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const contact = route?.params?.contact;
  // 'password' (default) or 'mpin' — determines which backend flow this OTP belongs to
  const purpose = route?.params?.purpose || 'password';

  const onVerify = async () => {
    if ((otp || '').length < 6) { toast?.error?.('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = purpose === 'mpin'
        ? await mpinService.forgotVerify(contact, otp)
        : await authService.verifyOtp(contact, otp);

      toast?.success?.(res?.message || 'Verified');

      navigation.replace(purpose === 'mpin' ? 'ResetMpin' : 'ResetPassword', {
        contact,
        resetToken: res?.resetToken,
      });
    } catch (e) {
      toast?.error?.(e?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper scroll>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 8 }}>
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <View style={{ marginTop: 24, marginBottom: 24 }}>
        <AppText variant="h1">Verify OTP</AppText>
        <AppText variant="body" color={COLORS.textSecondary}>Enter the code sent to {contact || 'your contact'}.</AppText>
      </View>
      <AppOTPInput length={6} onChangeText={setOtp} onComplete={setOtp} />
      <AppButton label="Verify" onPress={onVerify} loading={loading} style={{ marginTop: 24 }} />
    </ScreenWrapper>
  );
}
