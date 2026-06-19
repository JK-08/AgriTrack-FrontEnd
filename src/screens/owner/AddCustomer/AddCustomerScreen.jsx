import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppInput from '../../../components/ui/appcomponents/AppInput';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppChip from '../../../components/ui/appcomponents/AppChip';
import AppText from '../../../components/ui/appcomponents/AppText';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../providers/AuthProvider';
import { customerService } from '../../../api/services';

export default function AddCustomerScreen({ navigation, route }) {
  const { COLORS } = useTheme();
  const toast = useToast();
  const { ownerId } = useAuth();
  const editing = route?.params?.customer;

  const [form, setForm] = useState({
    name: editing?.name || '', mobileNo: editing?.mobileNo || '',
    village: editing?.village || '', address: editing?.address || '',
    farmSize: editing?.farmSize || '', notes: editing?.notes || '',
    customerType: editing?.customerType || 'NEW',
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const onSave = async () => {
    if (!form.name) { toast?.error?.('Name is required'); return; }
    setSaving(true);
    try {
      if (editing) await customerService.update(editing.customerId, { ...editing, ...form });
      else await customerService.create({ ...form, ownerId });
      toast?.success?.(editing ? 'Customer updated' : 'Customer added');
      navigation.goBack();
    } catch (e) { toast?.error?.(e?.message || 'Could not save'); }
    finally { setSaving(false); }
  };

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title={editing ? 'Edit Customer' : 'Add Customer'} variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <AppInput label="Full Name" leftIcon="person-outline" value={form.name} onChangeText={set('name')} required />
        <AppInput label="Mobile Number" leftIcon="call-outline" value={form.mobileNo} onChangeText={set('mobileNo')} keyboardType="phone-pad" />
        <AppInput label="Village / Area" leftIcon="location-outline" value={form.village} onChangeText={set('village')} />
        <AppInput label="Address" leftIcon="home-outline" value={form.address} onChangeText={set('address')} />
        <AppInput label="Farm Size (acres)" leftIcon="leaf-outline" value={form.farmSize} onChangeText={set('farmSize')} />
        <AppInput label="Notes" leftIcon="create-outline" value={form.notes} onChangeText={set('notes')} multiline />

        <AppText variant="label" style={{ marginTop: 8, marginBottom: 8 }}>Customer Type</AppText>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 18 }}>
          <AppChip label="New" selected={form.customerType === 'NEW'} onPress={() => set('customerType')('NEW')} />
          <AppChip label="Existing" selected={form.customerType === 'EXISTING'} onPress={() => set('customerType')('EXISTING')} />
        </View>

        <AppButton label={editing ? 'Update Customer' : 'Save Customer'} onPress={onSave} loading={saving} />
      </View>
    </ScreenWrapper>
  );
}
