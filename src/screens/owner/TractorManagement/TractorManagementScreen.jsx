import React, { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppBadge from '../../../components/ui/appcomponents/AppBadge';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import AppLoader from '../../../components/ui/appcomponents/AppLoader';
import { useAuth } from '../../../providers/AuthProvider';
import { tractorService } from '../../../api/services';
import { formatCurrency, statusVariant } from '../../../utils/agriHelpers';

export default function TractorManagementScreen({ navigation }) {
  const { COLORS } = useTheme();
  const { ownerId } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!ownerId) return;
    try { const r = await tractorService.byOwner(ownerId); setData(Array.isArray(r) ? r : []); }
    catch (e) { setData([]); } finally { setLoading(false); }
  }, [ownerId]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <ScreenWrapper paddingHorizontal={0}
      header={<AppHeader title="My Tractors" variant="primary" showBack
        actions={[{ iconName: 'add', onPress: () => navigation.navigate('AddTractor') }]} />}>
      {loading ? <AppLoader mode="inline" message="Loading..." /> : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.tractorId)}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 30 }}
          renderItem={({ item }) => (
            <AppCard style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Ionicons name="construct" size={20} color={COLORS.primary} />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <AppText variant="bodyMedium">{item.model || item.machineType || `Tractor ${item.tractorId}`}</AppText>
                    <AppText variant="caption" color={COLORS.textSecondary}>{item.registrationNumber || 'No reg.'}</AppText>
                  </View>
                </View>
                <AppBadge label={item.status || 'AVAILABLE'} variant={statusVariant(item.status)} size="sm" />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <AppText variant="caption" color={COLORS.textTertiary}>
                  {item.hourlyRate ? `${formatCurrency(item.hourlyRate)}/hr` : ''}
                </AppText>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => navigation.navigate('TractorDocuments', { tractor: item })} style={{ marginRight: 16 }}>
                    <AppText variant="bodySmall" color={COLORS.primary}>Documents ›</AppText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('MaintenanceLog', { tractor: item })}>
                    <AppText variant="bodySmall" color={COLORS.primary}>Maintenance ›</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            </AppCard>
          )}
          ListEmptyComponent={<AppEmptyState title="No tractors" subtitle="Add a tractor or machine to manage it."
            cta={{ label: 'Add Tractor', onPress: () => navigation.navigate('AddTractor') }} />}
        />
      )}
    </ScreenWrapper>
  );
}
