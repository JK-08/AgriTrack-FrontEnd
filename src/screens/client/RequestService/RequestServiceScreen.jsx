import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppInput from '../../../components/ui/appcomponents/AppInput';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../providers/AuthProvider';
import { bookingService } from '../../../api/services';

export default function RequestServiceScreen({ navigation, route }) {
  const toast = useToast();
  const { ownerId: myId } = useAuth();
  const tractor = route?.params?.tractor || {};
  const [form, setForm] = useState({ serviceType: '', fieldSize: '', duration: '', location: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = async () => {
    if (!form.serviceType) { toast?.error?.('Enter the service you need'); return; }
    setSaving(true);
    try {
      await bookingService.create({
        clientId: myId, ownerId: tractor.ownerId, tractorId: tractor.tractorId || null,
        serviceType: form.serviceType, fieldSize: form.fieldSize, duration: form.duration,
        location: form.location, notes: form.notes, requestedDate: new Date().toISOString(), status: 'PENDING',
      });
      toast?.success?.('Request sent to owner');
      navigation.navigate('ClientTabs', { screen: 'Bookings' });
    } catch (e) { toast?.error?.(e?.message || 'Could not send request'); }
    finally { setSaving(false); }
  };

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Request Service" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <AppInput label="Service needed (Ploughing...)" leftIcon="construct-outline" value={form.serviceType} onChangeText={set('serviceType')} required />
        <AppInput label="Field size (acres)" leftIcon="leaf-outline" value={form.fieldSize} onChangeText={set('fieldSize')} />
        <AppInput label="Estimated duration" leftIcon="time-outline" value={form.duration} onChangeText={set('duration')} />
        <AppInput label="Location" leftIcon="location-outline" value={form.location} onChangeText={set('location')} />
        <AppInput label="Notes" leftIcon="create-outline" value={form.notes} onChangeText={set('notes')} multiline />
        <AppButton label="Send Request" onPress={onSubmit} loading={saving} style={{ marginTop: 8 }} />
      </View>
    </ScreenWrapper>
  );
}
