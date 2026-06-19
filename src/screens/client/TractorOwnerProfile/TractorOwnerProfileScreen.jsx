import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import { ratingService } from '../../../api/services';
import { formatCurrency } from '../../../utils/agriHelpers';

export default function TractorOwnerProfileScreen({ navigation, route }) {
  const { COLORS } = useTheme();
  const tractor = route?.params?.tractor || {};
  const [avg, setAvg] = useState(0);

  const load = useCallback(async () => {
    if (!tractor.ownerId) return;
    try { const r = await ratingService.average(tractor.ownerId); setAvg(r?.averageRating ?? 0); } catch (e) {}
  }, [tractor.ownerId]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Tractor Details" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <AppCard>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.icon, { backgroundColor: COLORS.primaryPale }]}>
              <Ionicons name="construct" size={28} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <AppText variant="h5">{tractor.model || tractor.machineType || 'Tractor'}</AppText>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Ionicons name="star" size={14} color={COLORS.secondary} />
                <AppText variant="caption" color={COLORS.textSecondary} style={{ marginLeft: 4 }}>{avg} rating</AppText>
              </View>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 12 }} />
          <Row label="Type" value={tractor.machineType || '-'} />
          <Row label="Capacity" value={tractor.capacity || '-'} />
          <Row label="Hourly Rate" value={tractor.hourlyRate ? formatCurrency(tractor.hourlyRate) : '-'} />
          <Row label="Registration" value={tractor.registrationNumber || '-'} />
        </AppCard>

        <AppButton label="Request Service" leftIcon="add-circle-outline" style={{ marginTop: 18 }}
          onPress={() => navigation.navigate('RequestService', { tractor })} />
        <AppButton label="Message Owner" variant="outline" leftIcon="chatbubble-outline" style={{ marginTop: 12 }}
          onPress={() => navigation.navigate('Chat', { ownerId: tractor.ownerId })} />
      </View>
    </ScreenWrapper>
  );
}

function Row({ label, value }) {
  const { COLORS } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <AppText variant="body" color={COLORS.textSecondary}>{label}</AppText>
      <AppText variant="bodyMedium">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: { width: 60, height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
