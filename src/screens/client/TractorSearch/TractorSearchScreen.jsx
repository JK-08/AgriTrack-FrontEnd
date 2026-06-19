import React, { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppSearchBar from '../../../components/ui/appcomponents/AppSearchBar';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppBadge from '../../../components/ui/appcomponents/AppBadge';
import AppEmptyState from '../../../components/ui/appcomponents/AppEmptyState';
import { tractorService } from '../../../api/services';
import { formatCurrency, statusVariant } from '../../../utils/agriHelpers';

export default function TractorSearchScreen({ navigation }) {
  const { COLORS, SIZES } = useTheme();
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    try { const r = await tractorService.getAll(); setData(Array.isArray(r) ? r : []); } catch (e) { setData([]); }
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const filtered = data.filter((t) => !query ||
    (t.model || '').toLowerCase().includes(query.toLowerCase()) ||
    (t.machineType || '').toLowerCase().includes(query.toLowerCase()));

  return (
    <ScreenWrapper paddingHorizontal={0}
      header={<AppHeader title="Find Tractors" variant="primary" />}>
      <View style={{ paddingHorizontal: SIZES.padding.container, paddingTop: 12 }}>
        <AppSearchBar placeholder="Search by model or type" value={query} onChangeText={setQuery} />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.tractorId)}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding.container, paddingTop: 12, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9}
            onPress={() => navigation.navigate('TractorOwnerProfile', { tractor: item })}>
            <AppCard style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.icon, { backgroundColor: COLORS.primaryPale }]}>
                  <Ionicons name="construct" size={22} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <AppText variant="bodyMedium">{item.model || item.machineType || `Tractor ${item.tractorId}`}</AppText>
                  <AppText variant="caption" color={COLORS.textSecondary}>
                    {item.machineType || 'Tractor'} {item.hourlyRate ? `· ${formatCurrency(item.hourlyRate)}/hr` : ''}
                  </AppText>
                </View>
                <AppBadge label={item.status || 'AVAILABLE'} variant={statusVariant(item.status)} size="sm" />
              </View>
            </AppCard>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<AppEmptyState title="No tractors found" subtitle="Try a different search." />}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  icon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
