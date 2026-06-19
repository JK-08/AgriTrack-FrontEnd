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
import { bookingService } from '../../../api/services';
import { formatDateTime, statusVariant } from '../../../utils/agriHelpers';

export default function MyBookingsScreen({ navigation }) {
  const { SIZES } = useTheme();
  const { ownerId: myId } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!myId) return;
    try { const r = await bookingService.byClient(myId); setData(Array.isArray(r) ? r : []); }
    catch (e) { setData([]); } finally { setLoading(false); }
  }, [myId]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <ScreenWrapper paddingHorizontal={0}
      header={<AppHeader title="My Bookings" variant="primary" />}>
      {loading ? <AppLoader mode="inline" message="Loading..." /> : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.bookingId)}
          contentContainerStyle={{ paddingHorizontal: SIZES.padding.container, paddingTop: 14, paddingBottom: 30 }}
          renderItem={({ item }) => (
            <ListRow icon="calendar-outline" title={item.serviceType || 'Service'}
              subtitle={formatDateTime(item.requestedDate)} status={item.status} statusVariant={statusVariant(item.status)}
              onPress={() => navigation.navigate('BookingStatus', { booking: item })} />
          )}
          ListEmptyComponent={<AppEmptyState title="No bookings" subtitle="Find a tractor to request a service." />}
        />
      )}
    </ScreenWrapper>
  );
}
