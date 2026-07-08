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

export default function LoginScreen({ navigation, route }) {
  const { COLORS } = useTheme();
  const toast = useToast();
  const { login, loading } = useAuth();
  const role = route?.params?.role || 'OWNER';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    if (!username || !password) { toast?.error?.('Enter email/mobile and password'); return; }
    try {
      await login(username.trim(), password, role);
      // RootNavigator switches automatically on auth state change
    } catch (e) {
      toast?.error?.(e?.message || 'Login failed');
    }
  };

  return (
    <ScreenWrapper scroll>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 8 }}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={{ marginTop: 24, marginBottom: 24 }}>
          <AppText variant="h1">Welcome back</AppText>
          <AppText variant="body" color={COLORS.textSecondary}>
            Sign in as {role === 'OWNER' ? 'Tractor Owner' : role === 'DRIVER' ? 'Driver' : 'Farmer'}
          </AppText>
        </View>

        <AppInput label="Email or Mobile" leftIcon="person-outline" value={username}
          onChangeText={setUsername} autoCapitalize="none" keyboardType="email-address" />
        <AppInput label="Password" leftIcon="lock-closed-outline" value={password}
          onChangeText={setPassword} isPassword />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={{ alignSelf: 'flex-end', marginBottom: 18 }}>
          <AppText variant="bodySmall" color={COLORS.primary}>Forgot password?</AppText>
        </TouchableOpacity>

        <AppButton label="Login" onPress={onLogin} loading={loading} />

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 22 }}>
          <AppText variant="body" color={COLORS.textSecondary}>New here? </AppText>
          <TouchableOpacity onPress={() => navigation.navigate('Register', { role })}>
            <AppText variant="bodyMedium" color={COLORS.primary}>Create account</AppText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
