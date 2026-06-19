import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import AppSwitch from '../../../components/ui/appcomponents/AppSwitch';
import AppButton from '../../../components/ui/appcomponents/AppButton';
import { useAuth } from '../../../providers/AuthProvider';
import { useLanguage } from '../../../providers/LanguageProvider';

function Row({ icon, label, onPress, right }) {
  const { COLORS } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.row}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
      <AppText variant="body" style={{ flex: 1, marginLeft: 12 }}>{label}</AppText>
      {right || <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />}
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }) {
  const { COLORS, isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  return (
    <ScreenWrapper scroll paddingHorizontal={0}
      header={<AppHeader title="Settings" variant="primary" />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <AppCard padding="sm">
          <Row icon="person-outline" label="Profile" onPress={() => navigation.navigate('OwnerProfile')} />
          <Row icon="pricetags-outline" label="Rate Management" onPress={() => navigation.navigate('Rates')} />
          <Row icon="construct-outline" label="My Tractors" onPress={() => navigation.navigate('TractorManagement')} />
          <Row icon="bar-chart-outline" label="Reports" onPress={() => navigation.navigate('Reports')} />
          <Row icon="chatbubbles-outline" label="Messages" onPress={() => navigation.navigate('ChatList')} />
        </AppCard>

        <AppCard padding="sm" style={{ marginTop: 14 }}>
          <Row icon="moon-outline" label="Dark Mode"
            right={<AppSwitch value={isDark} onValueChange={toggleTheme} />} />
          <Row icon="language-outline" label={language === 'ta' ? 'தமிழ்' : 'English'}
            onPress={() => setLanguage(language === 'ta' ? 'en' : 'ta')} />
        </AppCard>

        <AppButton label="Logout" variant="danger" leftIcon="log-out-outline" onPress={logout} style={{ marginTop: 24 }} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4 },
});
