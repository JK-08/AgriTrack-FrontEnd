import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppInput from '../../../components/ui/appcomponents/AppInput';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppText from '../../../components/ui/appcomponents/AppText';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../providers/AuthProvider';
import { authService, driverService } from '../../../api/services';

// Adding a driver creates a USERS row (ROLE = DRIVER) the driver can log in
// with, plus a DRIVERS profile linking that user to this owner.
export default function AddDriverScreen({ navigation }) {
  const { COLORS } = useTheme();
  const toast = useToast();
  const { ownerId } = useAuth();

  const [form, setForm] = useState({
    name: '', mobileNo: '', email: '', password: '',
    licenseNumber: '', notes: '', monthlySalary: '',
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const onSave = async () => {
    if (!form.name || !form.password || (!form.email && !form.mobileNo)) {
      toast?.error?.('Fill name, password and email/mobile');
      return;
    }
    setSaving(true);
    try {
      const newUser = await authService.register({
        name: form.name, mobileNo: form.mobileNo, email: form.email,
        password: form.password, role: 'DRIVER',
      });
      await driverService.create({
        userId: newUser.userId,
        ownerId,
        licenseNumber: form.licenseNumber,
        notes: form.notes,
        monthlySalary: form.monthlySalary ? Number(form.monthlySalary) : null,
      });
      toast?.success?.('Driver added');
      navigation.goBack();
    } catch (e) {
      toast?.error?.(e?.message || 'Could not add driver');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Add Driver" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <AppText variant="label" color={COLORS.textSecondary} style={{ marginBottom: 8 }}>LOGIN DETAILS</AppText>
        <AppInput label="Full Name" leftIcon="person-outline" value={form.name} onChangeText={set('name')} required />
        <AppInput label="Mobile Number" leftIcon="call-outline" value={form.mobileNo} onChangeText={set('mobileNo')} keyboardType="phone-pad" />
        <AppInput label="Email" leftIcon="mail-outline" value={form.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" />
        <AppInput label="Password" leftIcon="lock-closed-outline" value={form.password} onChangeText={set('password')} isPassword />

        <AppText variant="label" color={COLORS.textSecondary} style={{ marginTop: 12, marginBottom: 8 }}>DRIVER DETAILS</AppText>
        <AppInput label="License Number" leftIcon="card-outline" value={form.licenseNumber} onChangeText={set('licenseNumber')} />
        <AppInput label="Monthly Salary (₹)" leftIcon="cash-outline" value={form.monthlySalary} onChangeText={set('monthlySalary')} keyboardType="numeric" />
        <AppInput label="Notes" leftIcon="create-outline" value={form.notes} onChangeText={set('notes')} multiline />

        <AppButton label="Add Driver" onPress={onSave} loading={saving} style={{ marginTop: 8 }} />
      </View>
    </ScreenWrapper>
  );
}
