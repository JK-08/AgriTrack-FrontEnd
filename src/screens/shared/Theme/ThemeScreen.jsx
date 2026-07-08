import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';

const OPTIONS = [
  { key: 'light', label: 'Light', icon: 'sunny-outline' },
  { key: 'dark',  label: 'Dark',  icon: 'moon-outline' },
];

export default function ThemeScreen() {
  const { COLORS, isDark, toggleTheme } = useTheme();
  const current = isDark ? 'dark' : 'light';

  const select = (key) => {
    if (key !== current) toggleTheme();
  };

  return (
    <ScreenWrapper paddingHorizontal={0}
      header={<AppHeader title="Theme" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
        <AppCard padding="none">
          {OPTIONS.map((o, i) => (
            <TouchableOpacity key={o.key} onPress={() => select(o.key)} activeOpacity={0.8}
              style={[styles.row, i < OPTIONS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.border }]}>
              <View style={[styles.rowIcon, { backgroundColor: COLORS.primaryPale }]}>
                <Ionicons name={o.icon} size={18} color={COLORS.primary} />
              </View>
              <AppText variant="body" style={{ flex: 1, marginLeft: 12 }}>{o.label}</AppText>
              {current === o.key && <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />}
            </TouchableOpacity>
          ))}
        </AppCard>
        <AppText variant="caption" color={COLORS.textSecondary} style={{ marginTop: 12 }}>
          Theme applies across the whole app immediately.
        </AppText>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16 },
  rowIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
});
