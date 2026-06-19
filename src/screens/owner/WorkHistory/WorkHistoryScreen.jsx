import React, { useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppSearchBar from '../../../components/ui/appcomponents/AppSearchBar';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import AppLoader from '../../../components/ui/appcomponents/AppLoader';
import ListRow from '../../../components/agri/ListRow';
import { useAuth } from '../../../providers/AuthProvider';
import { workService } from '../../../api/services';
import { formatCurrency, formatDate, statusVariant } from '../../../utils/agriHelpers';

export default function WorkHistoryScreen({ navigation }) {
  const { SIZES } = useTheme();
  const { ownerId } = useAuth();
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!ownerId) return;
    try { const res = await workService.byOwner(ownerId); setData(Array.isArray(res) ? res : []); }
    catch (e) { setData([]); } finally { setLoading(false); }
  }, [ownerId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const filtered = data.filter((w) => !query || (w.serviceType || '').toLowerCase().includes(query.toLowerCase()));

  return (
    <ScreenWrapper paddingHorizontal={0}
      header={<AppHeader title="Work History" variant="primary" />}>
      <View style={{ paddingHorizontal: SIZES.padding.container, paddingTop: 12 }}>
        <AppSearchBar placeholder="Search service..." value={query} onChangeText={setQuery} />
      </View>
      {loading ? <AppLoader mode="inline" message="Loading..." /> : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.workId)}
          onRefresh={onRefresh} refreshing={refreshing}
          contentContainerStyle={{ paddingHorizontal: SIZES.padding.container, paddingTop: 12, paddingBottom: 30 }}
          renderItem={({ item }) => (
            <ListRow icon="construct-outline" title={item.serviceType || 'Service'}
              subtitle={formatDate(item.workDate)} value={formatCurrency(item.amount)}
              status={item.status} statusVariant={statusVariant(item.status)}
              onPress={() => navigation.navigate('WorkDetail', { id: item.workId })} />
          )}
          ListEmptyComponent={<AppEmptyState title="No work recorded" subtitle="Completed jobs will show up here." />}
        />
      )}
    </ScreenWrapper>
  );
}
