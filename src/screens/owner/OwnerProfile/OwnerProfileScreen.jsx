import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import AppSwitch from '../../../components/ui/appcomponents/AppSwitch';
import { useAuth } from '../../../providers/AuthProvider';
import { useLanguage } from '../../../providers/LanguageProvider';

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

export default function OwnerProfileScreen({ navigation }) {
  const { COLORS, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();

  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Profile" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, alignItems: 'center' }}>
        <View style={[styles.avatar, { backgroundColor: COLORS.primary }]}>
          <AppText variant="h1" color={COLORS.white}>{(user?.name || '?')[0]?.toUpperCase()}</AppText>
        </View>
        <AppText variant="h4" style={{ marginTop: 12 }}>{user?.name || 'Owner'}</AppText>
        <View style={[styles.roleChip, { backgroundColor: COLORS.primaryPale }]}>
          <AppText variant="caption" color={COLORS.primary}>{user?.role || 'OWNER'}</AppText>
        </View>
        {!!user?.username && <AppText variant="caption" color={COLORS.textSecondary} style={{ marginTop: 4 }}>{user.username}</AppText>}
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <AppText variant="label" color={COLORS.textSecondary} style={{ marginBottom: 8 }}>BUSINESS</AppText>
        <AppCard padding="none">
          <Row icon="people-outline" label="Customers" onPress={() => navigation.navigate('OwnerTabs', { screen: 'Customers' })} />
          <Row icon="pricetags-outline" label="Rate Management" onPress={() => navigation.navigate('Rates')} />
          <Row icon="construct-outline" label="My Tractors" onPress={() => navigation.navigate('TractorManagement')} />
          <Row icon="receipt-outline" label="Invoices" onPress={() => navigation.navigate('InvoiceList')} />
          <Row icon="cash-outline" label="Payments" onPress={() => navigation.navigate('PaymentTracking')} />
          <Row icon="bar-chart-outline" label="Reports" onPress={() => navigation.navigate('Reports')} last />
        </AppCard>

        <AppText variant="label" color={COLORS.textSecondary} style={{ marginTop: 18, marginBottom: 8 }}>GENERAL</AppText>
        <AppCard padding="none">
          <Row icon="chatbubbles-outline" label="Messages" onPress={() => navigation.navigate('ChatList')} />
          <Row icon="notifications-outline" label="Notifications" onPress={() => navigation.navigate('Notifications')} />
          <Row icon="moon-outline" label="Dark Mode" right={<AppSwitch value={isDark} onValueChange={toggleTheme} />} />
          <Row icon="language-outline" label={`Language · ${language === 'ta' ? 'தமிழ்' : 'English'}`}
            onPress={() => setLanguage(language === 'ta' ? 'en' : 'ta')} last />
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
