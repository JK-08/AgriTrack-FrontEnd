import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppChip from '../../../components/ui/appcomponents/AppChip';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import AppLoader from '../../../components/ui/appcomponents/AppLoader';
import ListRow from '../../../components/agri/ListRow';
import { useAuth } from '../../../providers/AuthProvider';
import { driverService, bookingService } from '../../../api/services';
import { formatDateTime, statusVariant } from '../../../utils/agriHelpers';

const FILTERS = ['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED'];

export default function DriverJobListScreen({ navigation }) {
  const { SIZES } = useTheme();
  const { ownerId: userId } = useAuth();
  const [driverId, setDriverId] = useState(null);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const d = await driverService.byUser(userId);
      setDriverId(d?.driverId ?? null);
      if (d?.driverId) {
        const r = await bookingService.byDriver(d.driverId);
        setData(Array.isArray(r) ? r : []);
      }
    } catch (e) { setData([]); }
    finally { setLoading(false); }
  }, [userId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const filtered = filter === 'ALL' ? data : data.filter((j) => j.status === filter);

  return (
    <ScreenWrapper paddingHorizontal={0}
      header={<AppHeader title="My Jobs" variant="primary" />}>
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: SIZES.padding.container, paddingTop: 12, flexWrap: 'wrap' }}>
        {FILTERS.map((f) => (
          <AppChip key={f} label={f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            selected={filter === f} onPress={() => setFilter(f)} size="sm" />
        ))}
      </View>

      {loading ? <AppLoader mode="inline" message="Loading jobs..." /> : (
        <View style={{ paddingHorizontal: SIZES.padding.container, paddingTop: 12 }}>
          {filtered.map((item) => (
            <ListRow key={item.bookingId} icon="calendar-outline" title={item.serviceType || 'Service request'}
              subtitle={`${item.location ? item.location + ' · ' : ''}${formatDateTime(item.requestedDate)}`}
              status={item.status} statusVariant={statusVariant(item.status)}
              onPress={() => navigation.navigate('DriverJobDetail', { booking: item, driverId })} />
          ))}
          {filtered.length === 0 && (
            <AppEmptyState title="No jobs" subtitle="Jobs your owner assigns to you will show here." />
          )}
        </View>
      )}
    </ScreenWrapper>
  );
}
