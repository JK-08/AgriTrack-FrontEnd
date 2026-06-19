import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import AppText from '../ui/appcomponents/AppText';

export default function SectionHeader({ title, actionLabel, onAction }) {
  const { COLORS } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, marginBottom: 10 }}>
      <AppText variant="h5">{title}</AppText>
      {!!actionLabel && (
        <TouchableOpacity onPress={onAction}>
          <AppText variant="bodySmall" color={COLORS.primary}>{actionLabel}</AppText>
        </TouchableOpacity>
      )}
    </View>
  );
}
