import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppInput from '../../../components/ui/appcomponents/AppInput';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import { useToast } from '../../../components/ui/Toast';

export default function ForgotPasswordScreen({ navigation }) {
  const { COLORS } = useTheme();
  const toast = useToast();
  const [contact, setContact] = useState('');

  const onSend = () => {
    if (!contact) { toast?.error?.('Enter your email or mobile'); return; }
    toast?.success?.('OTP sent (demo)');
    navigation.navigate('OTPVerification', { contact });
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
      <AppButton label="Send OTP" onPress={onSend} style={{ marginTop: 8 }} />
    </ScreenWrapper>
  );
}
