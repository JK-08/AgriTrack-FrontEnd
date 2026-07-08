import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import { useAuth } from '../../../providers/AuthProvider';
import { driverService } from '../../../api/services';
import { formatDate } from '../../../utils/agriHelpers';

function Row({ icon, label, onPress, right, last }) {
  const { COLORS } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}
      style={[styles.row, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.border }]}>
      <View style={[styles.rowIcon, { backgroundColor: COLORS.primaryPale }]}>
        <Ionicons name={icon} size={18} color={COLORS.primary} />
      </View>
      <AppText variant="body" style={{ flex: 1, marginLeft: 12 }}>{label}</AppText>
      {right || <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />}
    </TouchableOpacity>
  );
}

export default function DriverProfileScreen({ navigation }) {
  const { COLORS } = useTheme();
  const { user, ownerId: userId, logout } = useAuth();
  const [driver, setDriver] = useState(null);

  const load = useCallback(async () => {
    if (!userId) return;
    try { setDriver(await driverService.byUser(userId)); } catch (e) {}
  }, [userId]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Profile" variant="primary" />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, alignItems: 'center' }}>
        <View style={[styles.avatar, { backgroundColor: COLORS.primary }]}>
          <AppText variant="h1" color={COLORS.white}>{(user?.name || '?')[0]?.toUpperCase()}</AppText>
        </View>
        <AppText variant="h4" style={{ marginTop: 12 }}>{user?.name || 'Driver'}</AppText>
        <View style={[styles.roleChip, { backgroundColor: COLORS.primaryPale }]}>
          <AppText variant="caption" color={COLORS.primary}>DRIVER</AppText>
        </View>
      </View>

      {!!driver && (
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <AppText variant="label" color={COLORS.textSecondary} style={{ marginBottom: 8 }}>LICENSE</AppText>
          <AppCard>
            <AppText variant="bodyMedium">{driver.licenseNumber || 'Not set'}</AppText>
            {!!driver.licenseExpiry && (
              <AppText variant="caption" color={COLORS.textSecondary}>Expires {formatDate(driver.licenseExpiry)}</AppText>
            )}
          </AppCard>
        </View>
      )}

      <View style={{ paddingHorizontal: 20, marginTop: 18 }}>
        <AppText variant="label" color={COLORS.textSecondary} style={{ marginBottom: 8 }}>GENERAL</AppText>
        <AppCard padding="none">
          <Row icon="chatbubbles-outline" label="Messages" onPress={() => navigation.navigate('ChatList')} />
          <Row icon="moon-outline" label="Theme" onPress={() => navigation.navigate('Theme')} />
          <Row icon="language-outline" label="Language" onPress={() => navigation.navigate('Language')} last />
        </AppCard>

        <AppButton label="Logout" variant="danger" leftIcon="log-out-outline" onPress={logout} style={{ marginTop: 24 }} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  avatar:   { width: 92, height: 92, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  roleChip: { paddingHorizontal: 12, paddingVertical: 3, borderRadius: 999, marginTop: 8 },
  row:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14 },
  rowIcon:  { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
});
