import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppText from '../../../components/ui/appcomponents/AppText';

const ROLES = [
  { role: 'OWNER',    icon: 'construct',   title: 'Tractor Owner', text: 'Manage customers, work, rates & invoices' },
  { role: 'CUSTOMER', icon: 'leaf',        title: 'Farmer',        text: 'Find tractors, book services & pay' },
];

export default function RoleSelectionScreen({ navigation }) {
  const { COLORS, SHADOWS, SIZES } = useTheme();
  return (
    <ScreenWrapper scroll>
      <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 24 }}>
        <View style={[styles.logo, { backgroundColor: COLORS.primaryPale }]}>
          <Ionicons name="leaf" size={40} color={COLORS.primary} />
        </View>
        <AppText variant="h2" style={{ marginTop: 16 }}>Welcome to AgriTrack</AppText>
        <AppText variant="body" color={COLORS.textSecondary}>Choose how you want to continue</AppText>
      </View>

      {ROLES.map((r) => (
        <TouchableOpacity
          key={r.role}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Login', { role: r.role })}
          style={[styles.card, { backgroundColor: COLORS.card, borderRadius: SIZES.radius.xl, ...SHADOWS.md }]}
        >
          <View style={[styles.icon, { backgroundColor: COLORS.primary }]}>
            <Ionicons name={r.icon} size={30} color={COLORS.white} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <AppText variant="h5">{r.title}</AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>{r.text}</AppText>
          </View>
          <Ionicons name="chevron-forward" size={22} color={COLORS.textTertiary} />
        </TouchableOpacity>
      ))}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  logo: { width: 84, height: 84, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', padding: 18, marginBottom: 16 },
  icon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
