import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../theme';
import AppText from '../ui/appcomponents/AppText';

export default function StatCard({ icon = 'stats-chart', label, value, tint, onPress }) {
  const { COLORS, SHADOWS, SIZES } = useTheme();
  const color = tint || COLORS.primary;
  const Wrap = onPress ? TouchableOpacity : View;
  return (
    <Wrap
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, { backgroundColor: COLORS.card, borderRadius: SIZES.radius.lg, ...SHADOWS.sm }]}
    >
      <View style={[styles.iconWrap, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <AppText variant="h4" style={{ marginTop: 8 }}>{value}</AppText>
      <AppText variant="caption" color={COLORS.textSecondary}>{label}</AppText>
    </Wrap>
  );
}

const styles = StyleSheet.create({
  card:    { flex: 1, padding: 14, minHeight: 96 },
  iconWrap:{ width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
});
