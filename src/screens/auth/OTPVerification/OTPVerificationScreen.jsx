import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppOTPInput from '../../../components/ui/appcomponents/AppOTPInput';
import { useToast } from '../../../components/ui/Toast';

export default function OTPVerificationScreen({ navigation, route }) {
  const { COLORS } = useTheme();
  const toast = useToast();
  const [otp, setOtp] = useState('');
  const contact = route?.params?.contact;

  const onVerify = () => {
    if ((otp || '').length < 4) { toast?.error?.('Enter the OTP'); return; }
    toast?.success?.('Verified');
    navigation.replace('RoleSelection');
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
      <AppButton label="Verify" onPress={onVerify} style={{ marginTop: 24 }} />
    </ScreenWrapper>
  );
}
