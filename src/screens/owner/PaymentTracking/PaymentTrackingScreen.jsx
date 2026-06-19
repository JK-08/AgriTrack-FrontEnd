import React, { useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppChip from '../../../components/ui/appcomponents/AppChip';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import AppLoader from '../../../components/ui/appcomponents/AppLoader';
import ListRow from '../../../components/agri/ListRow';
import { useAuth } from '../../../providers/AuthProvider';
import { paymentService } from '../../../api/services';
import { formatCurrency, formatDateTime, statusVariant } from '../../../utils/agriHelpers';

export default function PaymentTrackingScreen({ navigation }) {
  const { SIZES } = useTheme();
  const { ownerId } = useAuth();
  const [tab, setTab] = useState('ALL');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const r = tab === 'PENDING' ? await paymentService.pending(ownerId) : await paymentService.ownerHistory(ownerId);
      setData(Array.isArray(r) ? r : []);
    } catch (e) { setData([]); } finally { setLoading(false); }
  }, [ownerId, tab]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <ScreenWrapper paddingHorizontal={0}
      header={<AppHeader title="Payments" variant="primary" showBack />}>
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: SIZES.padding.container, paddingTop: 12 }}>
        <AppChip label="All" selected={tab === 'ALL'} onPress={() => setTab('ALL')} size="sm" />
        <AppChip label="Pending" selected={tab === 'PENDING'} onPress={() => setTab('PENDING')} size="sm" />
      </View>
      {loading ? <AppLoader mode="inline" message="Loading..." /> : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.paymentId)}
          contentContainerStyle={{ paddingHorizontal: SIZES.padding.container, paddingTop: 12, paddingBottom: 30 }}
          renderItem={({ item }) => (
            <ListRow icon="cash-outline" title={formatCurrency(item.amount)}
              subtitle={`${item.paymentMethod || 'CASH'} · ${formatDateTime(item.paymentDate)}`}
              status={item.paymentStatus} statusVariant={statusVariant(item.paymentStatus)} />
          )}
          ListEmptyComponent={<AppEmptyState title="No payments" subtitle="Payments will appear here." />}
        />
      )}
    </ScreenWrapper>
  );
}
