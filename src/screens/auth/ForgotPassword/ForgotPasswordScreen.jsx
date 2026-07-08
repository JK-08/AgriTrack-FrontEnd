import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppInput from '../../../components/ui/appcomponents/AppInput';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import { useToast } from '../../../components/ui/Toast';
import { authService } from '../../../api/services';

export default function ForgotPasswordScreen({ navigation }) {
  const { COLORS } = useTheme();
  const toast = useToast();
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    if (!contact) { toast?.error?.('Enter your email or mobile'); return; }
    setLoading(true);
    try {
      const res = await authService.forgotPassword(contact);
      toast?.success?.(res?.message || 'OTP sent');

      // DEV_OTP_MODE: no SMS/Email provider is configured yet, so the
      // backend echoes the OTP back here for testing. Once a real
      // provider is wired in, res.otp will simply be absent and this
      // Alert never fires.
      if (res?.otp) {
        Alert.alert('Development OTP', `Your OTP is: ${res.otp}`);
      }

      navigation.navigate('OTPVerification', { contact, purpose: 'password' });
    } catch (e) {
      toast?.error?.(e?.message || 'Failed to send OTP');
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
        <AppText variant="h1">Reset password</AppText>
        <AppText variant="body" color={COLORS.textSecondary}>We'll send a verification code to reset it.</AppText>
      </View>
      <AppInput label="Email or Mobile" leftIcon="person-outline" value={contact} onChangeText={setContact} autoCapitalize="none" />
      <AppButton label="Send OTP" onPress={onSend} loading={loading} style={{ marginTop: 8 }} />
    </ScreenWrapper>
  );
}
