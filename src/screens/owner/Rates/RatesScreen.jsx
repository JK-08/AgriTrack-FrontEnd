import React, { useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppBadge from '../../../components/ui/appcomponents/AppBadge';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import AppLoader from '../../../components/ui/appcomponents/AppLoader';
import { TouchableOpacity } from 'react-native';
import { useAuth } from '../../../providers/AuthProvider';
import { rateService } from '../../../api/services';
import { formatCurrency } from '../../../utils/agriHelpers';

export default function RatesScreen({ navigation }) {
  const { COLORS } = useTheme();
  const { ownerId } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!ownerId) return;
    try { const r = await rateService.byOwner(ownerId); setData(Array.isArray(r) ? r : []); }
    catch (e) { setData([]); } finally { setLoading(false); }
  }, [ownerId]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <ScreenWrapper paddingHorizontal={0}
      header={<AppHeader title="Rate Management" variant="primary" showBack
        actions={[{ iconName: 'add', onPress: () => navigation.navigate('EditRate') }]} />}>
      {loading ? <AppLoader mode="inline" message="Loading rates..." /> : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.rateId)}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 30 }}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('EditRate', { rate: item })}>
              <AppCard style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Ionicons name="pricetag" size={18} color={COLORS.primary} />
                    <AppText variant="bodyMedium" style={{ marginLeft: 8 }}>{item.serviceType}</AppText>
                  </View>
                  <AppBadge label={item.isActive === false ? 'Inactive' : 'Active'}
                    variant={item.isActive === false ? 'neutral' : 'success'} size="sm" />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                  <View><AppText variant="caption" color={COLORS.textTertiary}>Per min</AppText>
                    <AppText variant="bodyMedium">{item.pricePerMinute ? formatCurrency(item.pricePerMinute) : '-'}</AppText></View>
                  <View><AppText variant="caption" color={COLORS.textTertiary}>Per 10 min</AppText>
                    <AppText variant="bodyMedium">{item.pricePerTenMinutes ? formatCurrency(item.pricePerTenMinutes) : '-'}</AppText></View>
                  <View><AppText variant="caption" color={COLORS.textTertiary}>Per hour</AppText>
                    <AppText variant="bodyMedium">{item.pricePerHour ? formatCurrency(item.pricePerHour) : '-'}</AppText></View>
                </View>
              </AppCard>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<AppEmptyState title="No rates set" subtitle="Add a service rate to start tracking work."
            cta={{ label: 'Add Rate', onPress: () => navigation.navigate('EditRate') }} />}
        />
      )}
    </ScreenWrapper>
  );
}
