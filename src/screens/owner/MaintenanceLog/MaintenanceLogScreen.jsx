import React, { useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppInput from '../../../components/ui/appcomponents/AppInput';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppModal from '../../../components/ui/appcomponents/AppModal';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import ListRow from '../../../components/agri/ListRow';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../providers/AuthProvider';
import { maintenanceService } from '../../../api/services';
import { formatCurrency, formatDate } from '../../../utils/agriHelpers';

export default function MaintenanceLogScreen({ route }) {
  const toast = useToast();
  const { ownerId } = useAuth();
  const tractor = route?.params?.tractor;
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ maintenanceType: '', cost: '', notes: '' });
  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const load = useCallback(async () => {
    if (!tractor?.tractorId) return;
    try { const r = await maintenanceService.byTractor(tractor.tractorId); setData(Array.isArray(r) ? r : []); } catch (e) {}
  }, [tractor]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onAdd = async () => {
    if (!form.maintenanceType) { toast?.error?.('Enter maintenance type'); return; }
    try {
      await maintenanceService.create({ ...form, cost: form.cost ? Number(form.cost) : null, tractorId: tractor.tractorId, ownerId });
      toast?.success?.('Logged'); setOpen(false); setForm({ maintenanceType: '', cost: '', notes: '' }); load();
    } catch (e) { toast?.error?.('Failed'); }
  };

  return (
    <ScreenWrapper paddingHorizontal={0}
      header={<AppHeader title="Maintenance" subtitle={tractor?.model || tractor?.machineType} variant="primary" showBack
        actions={[{ iconName: 'add', onPress: () => setOpen(true) }]} />}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.maintenanceId)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <ListRow icon="build-outline" title={item.maintenanceType}
            subtitle={formatDate(item.maintenanceDate)} value={formatCurrency(item.cost)} />
        )}
        ListEmptyComponent={<AppEmptyState title="No maintenance logs" subtitle="Record servicing & repair costs here." />}
      />

      <AppModal visible={open} onClose={() => setOpen(false)} title="Add Maintenance" position="bottom">
        <AppInput label="Type (Oil change, Repair...)" value={form.maintenanceType} onChangeText={set('maintenanceType')} />
        <AppInput label="Cost (₹)" value={form.cost} onChangeText={set('cost')} keyboardType="numeric" />
        <AppInput label="Notes" value={form.notes} onChangeText={set('notes')} />
        <AppButton label="Save" onPress={onAdd} style={{ marginTop: 8 }} />
      </AppModal>
    </ScreenWrapper>
  );
}
