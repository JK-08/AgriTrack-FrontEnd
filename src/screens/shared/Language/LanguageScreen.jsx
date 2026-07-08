import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import ScreenWrapper from '../../../components/ui/appcomponents/ScreenWrapper';
import AppHeader from '../../../components/ui/appcomponents/AppHeader';
import AppText from '../../../components/ui/appcomponents/AppText';
import AppCard from '../../../components/ui/appcomponents/AppCard';
import { useLanguage } from '../../../providers/LanguageProvider';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
];

export default function LanguageScreen({ navigation }) {
  const { COLORS } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <ScreenWrapper paddingHorizontal={0}
      header={<AppHeader title="Language" variant="primary" showBack />}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
        <AppCard padding="none">
          {LANGUAGES.map((l, i) => (
            <TouchableOpacity key={l.code} onPress={() => setLanguage(l.code)} activeOpacity={0.8}
              style={[styles.row, i < LANGUAGES.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.border }]}>
              <View style={{ flex: 1 }}>
                <AppText variant="body">{l.label}</AppText>
                <AppText variant="caption" color={COLORS.textSecondary}>{l.native}</AppText>
              </View>
              {language === l.code && <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />}
            </TouchableOpacity>
          ))}
        </AppCard>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16 },
});
