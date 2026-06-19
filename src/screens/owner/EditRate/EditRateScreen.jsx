import React, { useState } from 'react';
import { View } from 'react-native';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppInput from '../../../components/ui/appcomponents/AppInput';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppSwitch from '../../../components/ui/appcomponents/AppSwitch';
import AppText from '../../../components/ui/appcomponents/AppText';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../providers/AuthProvider';
import { rateService } from '../../../api/services';

export default function EditRateScreen({ navigation, route }) {
  const toast = useToast();
  const { ownerId } = useAuth();
  const editing = route?.params?.rate;
  const [form, setForm] = useState({
    serviceType: editing?.serviceType || '', machineType: editing?.machineType || '',
    pricePerMinute: editing?.pricePerMinute?.toString() || '',
    pricePerTenMinutes: editing?.pricePerTenMinutes?.toString() || '',
    pricePerHour: editing?.pricePerHour?.toString() || '',
    isActive: editing?.isActive !== false,
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const num = (v) => (v === '' || v == null ? null : Number(v));

  const onSave = async () => {
    if (!form.serviceType) { toast?.error?.('Enter a service name'); return; }
    setSaving(true);
    const payload = {
      serviceType: form.serviceType, machineType: form.machineType,
      pricePerMinute: num(form.pricePerMinute), pricePerTenMinutes: num(form.pricePerTenMinutes),
      pricePerHour: num(form.pricePerHour), isActive: form.isActive,
    };
    try {
      if (editing) await rateService.update(editing.rateId, payload);
      else await rateService.create({ ...payload, ownerId });
      toast?.success?.(editing ? 'Rate updated' : 'Rate added');
      navigation.goBack();
    } catch (e) { toast?.error?.(e?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const onDelete = async () => {
    try { await rateService.remove(editing.rateId); toast?.success?.('Rate deleted'); navigation.goBack(); }
    catch (e) { toast?.error?.('Delete failed'); }
  };

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title={editing ? 'Edit Rate' : 'Add Rate'} variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <AppInput label="Service Name (e.g. Ploughing)" leftIcon="pricetag-outline" value={form.serviceType} onChangeText={set('serviceType')} required />
        <AppInput label="Machine Type (optional)" leftIcon="construct-outline" value={form.machineType} onChangeText={set('machineType')} />
        <AppInput label="Price per minute (₹)" leftIcon="cash-outline" value={form.pricePerMinute} onChangeText={set('pricePerMinute')} keyboardType="numeric" />
        <AppInput label="Price per 10 minutes (₹)" leftIcon="cash-outline" value={form.pricePerTenMinutes} onChangeText={set('pricePerTenMinutes')} keyboardType="numeric" />
        <AppInput label="Price per hour (₹)" leftIcon="cash-outline" value={form.pricePerHour} onChangeText={set('pricePerHour')} keyboardType="numeric" />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 14 }}>
          <AppText variant="bodyMedium">Active</AppText>
          <AppSwitch value={form.isActive} onValueChange={set('isActive')} />
        </View>
        <AppButton label={editing ? 'Update Rate' : 'Save Rate'} onPress={onSave} loading={saving} />
        {editing && <AppButton label="Delete" variant="danger" leftIcon="trash-outline" onPress={onDelete} style={{ marginTop: 12 }} />}
      </View>
    </ScreenWrapper>
  );
}
