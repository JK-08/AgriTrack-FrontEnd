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
import { driverService } from '../../../api/services';

export default function DriverListScreen({ navigation }) {
  const { SIZES } = useTheme();
  const { ownerId } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const res = await driverService.byOwner(ownerId);
      setData(Array.isArray(res) ? res : []);
    } catch (e) { setData([]); }
    finally { setLoading(false); }
  }, [ownerId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <ScreenWrapper paddingHorizontal={0}
      header={
        <AppHeader title="Drivers" variant="primary" showBack
          actions={[{ iconName: 'add', onPress: () => navigation.navigate('AddDriver') }]} />
      }
    >
      {loading ? (
        <AppLoader mode="inline" message="Loading drivers..." />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.driverId)}
          contentContainerStyle={{ paddingHorizontal: SIZES.padding.container, paddingTop: 12, paddingBottom: 30 }}
          renderItem={({ item }) => (
            <ListRow icon="person-outline" title={`Driver #${item.driverId}`}
              subtitle={item.licenseNumber ? `License · ${item.licenseNumber}` : 'No license on file'}
              status={item.isAvailable ? 'AVAILABLE' : 'BUSY'}
              statusVariant={item.isAvailable ? 'success' : 'info'}
              onPress={() => navigation.navigate('DriverDetail', { driver: item })} />
          )}
          ListEmptyComponent={
            <AppEmptyState title="No drivers yet" subtitle="Add a driver so you can assign them to jobs."
              cta={{ label: 'Add Driver', onPress: () => navigation.navigate('AddDriver') }} />
          }
        />
      )}
    </ScreenWrapper>
  );
}
