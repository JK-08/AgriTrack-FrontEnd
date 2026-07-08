import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppInput from '../../../components/ui/appcomponents/AppInput';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import { useToast } from '../../../components/ui/Toast';
import { authService } from '../../../api/services';

export default function ResetPasswordScreen({ navigation, route }) {
  const { COLORS } = useTheme();
  const toast = useToast();
  const { contact, resetToken } = route?.params || {};
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast?.error?.('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast?.error?.('Passwords do not match');
      return;
    }
    if (!resetToken) {
      toast?.error?.('Reset session expired. Please start again.');
      navigation.navigate('ForgotPassword');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword(contact, resetToken, newPassword);
      toast?.success?.(res?.message || 'Password reset successfully');
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (e) {
      toast?.error?.(e?.message || 'Failed to reset password');
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
        <AppText variant="h1">Set a new password</AppText>
        <AppText variant="body" color={COLORS.textSecondary}>Choose a new password for your account.</AppText>
      </View>
      <AppInput
        label="New password"
        leftIcon="lock-closed-outline"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <AppInput
        label="Confirm password"
        leftIcon="lock-closed-outline"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
        style={{ marginTop: 12 }}
      />
      <AppButton label="Reset password" onPress={onSubmit} loading={loading} style={{ marginTop: 24 }} />
    </ScreenWrapper>
  );
}
