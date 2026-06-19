import React, { useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import AppLoader from '../../../components/ui/appcomponents/AppLoader';
import ListRow from '../../../components/agri/ListRow';
import { useAuth } from '../../../providers/AuthProvider';
import { paymentService } from '../../../api/services';
import { formatCurrency, formatDateTime, statusVariant } from '../../../utils/agriHelpers';

export default function PaymentHistoryScreen() {
  const { SIZES } = useTheme();
  const { ownerId: myId } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!myId) return;
    try { const r = await paymentService.customerHistory(myId); setData(Array.isArray(r) ? r : []); }
    catch (e) { setData([]); } finally { setLoading(false); }
  }, [myId]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <ScreenWrapper paddingHorizontal={0}
      header={<AppHeader title="Payments" variant="primary" />}>
      {loading ? <AppLoader mode="inline" message="Loading..." /> : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.paymentId)}
          contentContainerStyle={{ paddingHorizontal: SIZES.padding.container, paddingTop: 14, paddingBottom: 30 }}
          renderItem={({ item }) => (
            <ListRow icon="cash-outline" title={formatCurrency(item.amount)}
              subtitle={`${item.paymentMethod || 'CASH'} · ${formatDateTime(item.paymentDate)}`}
              status={item.paymentStatus} statusVariant={statusVariant(item.paymentStatus)} />
          )}
          ListEmptyComponent={<AppEmptyState title="No payments yet" subtitle="Your payment history will appear here." />}
        />
      )}
    </ScreenWrapper>
  );
}
