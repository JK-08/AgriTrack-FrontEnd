import React, { useState } from 'react';
import { View } from 'react-native';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppInput from '../../../components/ui/appcomponents/AppInput';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../providers/AuthProvider';
import { tractorService } from '../../../api/services';

export default function AddTractorScreen({ navigation }) {
  const toast = useToast();
  const { ownerId } = useAuth();
  const [form, setForm] = useState({ model: '', registrationNumber: '', machineType: '', capacity: '', hourlyRate: '' });
  const [saving, setSaving] = useState(false);
  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const onSave = async () => {
    if (!form.model && !form.machineType) { toast?.error?.('Enter model or machine type'); return; }
    setSaving(true);
    try {
      await tractorService.create({ ...form, hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : null, ownerId, status: 'AVAILABLE' });
      toast?.success?.('Tractor added');
      navigation.goBack();
    } catch (e) { toast?.error?.(e?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Add Tractor" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <AppInput label="Model" leftIcon="construct-outline" value={form.model} onChangeText={set('model')} />
        <AppInput label="Registration Number" leftIcon="card-outline" value={form.registrationNumber} onChangeText={set('registrationNumber')} />
        <AppInput label="Machine Type (Tractor/Harvester...)" leftIcon="cog-outline" value={form.machineType} onChangeText={set('machineType')} />
        <AppInput label="Capacity (HP / tons)" leftIcon="barbell-outline" value={form.capacity} onChangeText={set('capacity')} />
        <AppInput label="Hourly Rate (₹)" leftIcon="cash-outline" value={form.hourlyRate} onChangeText={set('hourlyRate')} keyboardType="numeric" />
        <AppButton label="Save Tractor" onPress={onSave} loading={saving} style={{ marginTop: 8 }} />
      </View>
    </ScreenWrapper>
  );
}
