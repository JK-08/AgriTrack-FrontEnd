import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import AppText from '../../../components/ui/appcomponents/AppText';

export default function SplashScreen({ navigation }) {
  const { COLORS } = useTheme();

  useEffect(() => {
    const t = setTimeout(async () => {
      const onboarded = await AsyncStorage.getItem('@onboarding_complete');
      navigation.replace(onboarded ? 'RoleSelection' : 'Onboarding');
    }, 1300);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={[styles.c, { backgroundColor: COLORS.primary }]}>
      <View style={styles.logo}>
        <Ionicons name="leaf" size={54} color={COLORS.primary} />
      </View>
      <AppText variant="h1" color={COLORS.white} style={{ marginTop: 18 }}>AgriTrack</AppText>
      <AppText variant="body" color={COLORS.white} style={{ opacity: 0.9 }}>
        Tractor service made simple
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  c:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 110, height: 110, borderRadius: 32, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
});
