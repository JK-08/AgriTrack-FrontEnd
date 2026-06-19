import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../theme';
import AppText from '../ui/appcomponents/AppText';
import AppBadge from '../ui/appcomponents/AppBadge';

// Generic two-line row with optional status badge + right value. Reused across history/payments/bookings/invoices.
export default function ListRow({ icon = 'document-text-outline', title, subtitle, value, status, statusVariant, onPress }) {
  const { COLORS, SHADOWS, SIZES } = useTheme();
  const Wrap = onPress ? TouchableOpacity : View;
  return (
    <Wrap onPress={onPress} activeOpacity={0.85}
      style={[styles.row, { backgroundColor: COLORS.card, borderRadius: SIZES.radius.lg, ...SHADOWS.sm }]}>
      <View style={[styles.iconWrap, { backgroundColor: COLORS.primaryPale }]}>
        <Ionicons name={icon} size={18} color={COLORS.primary} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <AppText variant="bodyMedium" numberOfLines={1}>{title}</AppText>
        {!!subtitle && <AppText variant="caption" color={COLORS.textSecondary} numberOfLines={1}>{subtitle}</AppText>}
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        {!!value && <AppText variant="bodyMedium">{value}</AppText>}
        {!!status && <AppBadge label={status} variant={statusVariant || 'neutral'} size="sm" style={{ marginTop: 4 }} />}
      </View>
    </Wrap>
  );
}

const styles = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 10 },
  iconWrap:{ width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
});
