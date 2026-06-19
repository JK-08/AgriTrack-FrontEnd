import React, { useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppSearchBar from '../../../components/ui/appcomponents/AppSearchBar';
import AppChip from '../../../components/ui/appcomponents/AppChip';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import AppLoader from '../../../components/ui/appcomponents/AppLoader';
import CustomerCard from '../../../components/agri/CustomerCard';
import { useAuth } from '../../../providers/AuthProvider';
import { customerService } from '../../../api/services';

const FILTERS = ['ALL', 'NEW', 'EXISTING'];

export default function CustomerListScreen({ navigation }) {
  const { COLORS, SIZES } = useTheme();
  const { ownerId } = useAuth();
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const res = filter === 'ALL'
        ? await customerService.byOwner(ownerId)
        : await customerService.filter(ownerId, filter);
      setData(Array.isArray(res) ? res : []);
    } catch (e) { setData([]); }
    finally { setLoading(false); }
  }, [ownerId, filter]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const filtered = data.filter((c) =>
    !query || (c.name || '').toLowerCase().includes(query.toLowerCase()) || (c.mobileNo || '').includes(query));

  return (
    <ScreenWrapper
      paddingHorizontal={0}
      header={
        <AppHeader title="Customers" variant="primary"
          actions={[{ iconName: 'add', onPress: () => navigation.navigate('AddCustomer') }]} />
      }
    >
      <View style={{ paddingHorizontal: SIZES.padding.container, paddingTop: 12 }}>
        <AppSearchBar placeholder="Search by name or number" value={query} onChangeText={setQuery} />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 4 }}>
          {FILTERS.map((f) => (
            <AppChip key={f} label={f === 'ALL' ? 'All' : f === 'NEW' ? 'New' : 'Existing'}
              selected={filter === f} onPress={() => setFilter(f)} size="sm" />
          ))}
        </View>
      </View>

      {loading ? (
        <AppLoader mode="inline" message="Loading customers..." />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.customerId)}
          contentContainerStyle={{ paddingHorizontal: SIZES.padding.container, paddingTop: 8, paddingBottom: 30 }}
          renderItem={({ item }) => (
            <CustomerCard customer={item} onPress={() => navigation.navigate('CustomerDetail', { id: item.customerId })} />
          )}
          ListEmptyComponent={
            <AppEmptyState title="No customers yet" subtitle="Add your first customer to get started."
              cta={{ label: 'Add Customer', onPress: () => navigation.navigate('AddCustomer') }} />
          }
        />
      )}
    </ScreenWrapper>
  );
}
