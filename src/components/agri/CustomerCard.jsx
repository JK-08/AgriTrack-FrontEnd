import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../theme';
import AppText from '../ui/appcomponents/AppText';
import AppBadge from '../ui/appcomponents/AppBadge';

export default function CustomerCard({ customer, onPress }) {
  const { COLORS, SHADOWS, SIZES } = useTheme();
  const initial = (customer?.name || '?').charAt(0).toUpperCase();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, { backgroundColor: COLORS.card, borderRadius: SIZES.radius.lg, ...SHADOWS.sm }]}
    >
      <View style={[styles.avatar, { backgroundColor: COLORS.primaryPale }]}>
        <AppText variant="h4" color={COLORS.primary}>{initial}</AppText>
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <AppText variant="bodyMedium" numberOfLines={1}>{customer?.name}</AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
          <Ionicons name="call-outline" size={12} color={COLORS.textTertiary} />
          <AppText variant="caption" color={COLORS.textSecondary} style={{ marginLeft: 4 }}>
            {customer?.mobileNo || 'No number'}
          </AppText>
        </View>
        {!!customer?.village && (
          <AppText variant="caption" color={COLORS.textTertiary} numberOfLines={1}>
            {customer.village}
          </AppText>
        )}
      </View>
      {!!customer?.customerType && (
        <AppBadge label={customer.customerType} variant={customer.customerType === 'NEW' ? 'info' : 'neutral'} size="sm" />
      )}
      <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} style={{ marginLeft: 6 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card:   { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 10 },
  avatar: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
