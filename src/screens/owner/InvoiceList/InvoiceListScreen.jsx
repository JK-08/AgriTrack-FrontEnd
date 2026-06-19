import React, { useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import AppLoader from '../../../components/ui/appcomponents/AppLoader';
import ListRow from '../../../components/agri/ListRow';
import { useAuth } from '../../../providers/AuthProvider';
import { invoiceService } from '../../../api/services';
import { formatCurrency, formatDate, statusVariant } from '../../../utils/agriHelpers';

export default function InvoiceListScreen({ navigation }) {
  const { SIZES } = useTheme();
  const { ownerId } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!ownerId) return;
    try { const r = await invoiceService.byOwner(ownerId); setData(Array.isArray(r) ? r : []); }
    catch (e) { setData([]); } finally { setLoading(false); }
  }, [ownerId]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <ScreenWrapper paddingHorizontal={0}
      header={<AppHeader title="Invoices" variant="primary" showBack
        actions={[{ iconName: 'add', onPress: () => navigation.navigate('InvoiceGenerate') }]} />}>
      {loading ? <AppLoader mode="inline" message="Loading..." /> : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.invoiceId)}
          contentContainerStyle={{ paddingHorizontal: SIZES.padding.container, paddingTop: 14, paddingBottom: 30 }}
          renderItem={({ item }) => (
            <ListRow icon="receipt-outline" title={item.invoiceNumber || `Invoice #${item.invoiceId}`}
              subtitle={formatDate(item.invoiceDate)} value={formatCurrency(item.totalAmount)}
              status={item.status} statusVariant={statusVariant(item.status)}
              onPress={() => navigation.navigate('InvoicePreview', { invoice: item })} />
          )}
          ListEmptyComponent={<AppEmptyState title="No invoices yet" subtitle="Generate an invoice from completed work." />}
        />
      )}
    </ScreenWrapper>
  );
}
