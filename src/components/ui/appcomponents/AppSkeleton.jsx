// components/AppSkeleton.tsx
// Module 8 — UI/UX Modernization. Shared shimmer loading placeholder so
// data screens no longer render blank while their first fetch is in
// flight. Wraps the already-installed react-native-shimmer-placeholder
// dependency instead of introducing a new one.
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { useTheme } from '../../../theme';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export default function AppSkeleton({ width = '100%', height = 16, radius, style }) {
  const { COLORS, SIZES } = useTheme();
  return (
    <ShimmerPlaceholder
      style={[{ borderRadius: radius ?? SIZES.radius.sm, width, height }, style]}
      shimmerColors={[COLORS.gray100, COLORS.gray200, COLORS.gray100]}
    />
  );
}

/** A stack of skeleton rows shaped like a stat-card / list-row grid, for whole-screen loading states. */
export function AppSkeletonCard({ lines = 3, style }) {
  const { COLORS, SIZES, SHADOWS } = useTheme();
  return (
    <View style={[{
      backgroundColor: COLORS.card, borderRadius: SIZES.radius.lg,
      padding: SIZES.padding.lg, marginBottom: 12, ...SHADOWS.md,
    }, style]}>
      <AppSkeleton width="50%" height={14} style={{ marginBottom: 10 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <AppSkeleton key={i} width={i % 2 === 0 ? '100%' : '70%'} height={12} style={{ marginBottom: 8 }} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({});
