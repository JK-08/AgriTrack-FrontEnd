import React, { useState } from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppInput from '../../../components/ui/appcomponents/AppInput';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../providers/AuthProvider';

export default function RegisterScreen({ navigation, route }) {
  const { COLORS } = useTheme();
  const toast = useToast();
  const { register, loading } = useAuth();
  const role = route?.params?.role || 'OWNER';

  const [form, setForm] = useState({ name: '', email: '', mobileNo: '', password: '' });
  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const onRegister = async () => {
    if (!form.name || !form.password || (!form.email && !form.mobileNo)) {
      toast?.error?.('Fill name, password and email/mobile');
      return;
    }
    try {
      await register({ ...form, role });
      toast?.success?.('Account created. Please login.');
      navigation.replace('Login', { role });
    } catch (e) {
      toast?.error?.(e?.message || 'Registration failed');
    }
  };

  return (
    <ScreenWrapper scroll>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 8 }}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={{ marginTop: 24, marginBottom: 16 }}>
          <AppText variant="h1">Create account</AppText>
          <AppText variant="body" color={COLORS.textSecondary}>
            Register as {role === 'OWNER' ? 'Tractor Owner' : 'Farmer'}
          </AppText>
        </View>

        <AppInput label="Full Name" leftIcon="person-outline" value={form.name} onChangeText={set('name')} />
        <AppInput label="Email" leftIcon="mail-outline" value={form.email} onChangeText={set('email')}
          autoCapitalize="none" keyboardType="email-address" />
        <AppInput label="Mobile Number" leftIcon="call-outline" value={form.mobileNo} onChangeText={set('mobileNo')}
          keyboardType="phone-pad" />
        <AppInput label="Password" leftIcon="lock-closed-outline" value={form.password} onChangeText={set('password')} isPassword />

        <AppButton label="Register" onPress={onRegister} loading={loading} style={{ marginTop: 8 }} />

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 22 }}>
          <AppText variant="body" color={COLORS.textSecondary}>Already registered? </AppText>
          <TouchableOpacity onPress={() => navigation.replace('Login', { role })}>
            <AppText variant="bodyMedium" color={COLORS.primary}>Login</AppText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
