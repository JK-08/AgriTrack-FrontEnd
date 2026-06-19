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
import { bookingService } from '../../../api/services';
import { formatDateTime, statusVariant } from '../../../utils/agriHelpers';

export default function BookingRequestsScreen({ navigation }) {
  const { SIZES } = useTheme();
  const { ownerId } = useAuth();
  const [tab, setTab] = useState('PENDING');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const r = tab === 'PENDING' ? await bookingService.pending(ownerId) : await bookingService.byOwner(ownerId);
      setData(Array.isArray(r) ? r : []);
    } catch (e) { setData([]); } finally { setLoading(false); }
  }, [ownerId, tab]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <ScreenWrapper paddingHorizontal={0}
      header={<AppHeader title="Booking Requests" variant="primary" showBack />}>
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: SIZES.padding.container, paddingTop: 12 }}>
        <AppChip label="Pending" selected={tab === 'PENDING'} onPress={() => setTab('PENDING')} size="sm" />
        <AppChip label="All" selected={tab === 'ALL'} onPress={() => setTab('ALL')} size="sm" />
      </View>
      {loading ? <AppLoader mode="inline" message="Loading..." /> : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.bookingId)}
          contentContainerStyle={{ paddingHorizontal: SIZES.padding.container, paddingTop: 12, paddingBottom: 30 }}
          renderItem={({ item }) => (
            <ListRow icon="calendar-outline" title={item.serviceType || 'Service request'}
              subtitle={`${item.fieldSize ? item.fieldSize + ' · ' : ''}${formatDateTime(item.requestedDate)}`}
              status={item.status} statusVariant={statusVariant(item.status)}
              onPress={() => navigation.navigate('BookingDetail', { booking: item })} />
          )}
          ListEmptyComponent={<AppEmptyState title="No requests" subtitle="New service requests will show here." />}
        />
      )}
    </ScreenWrapper>
  );
}
