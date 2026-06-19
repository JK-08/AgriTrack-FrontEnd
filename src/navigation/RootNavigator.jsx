import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from '../theme';
import { useAuth } from '../providers/AuthProvider';

import AuthNavigator from './AuthNavigator';
import OwnerNavigator from './OwnerNavigator';
import ClientNavigator from './ClientNavigator';

export default function RootNavigator() {
  const { COLORS, isDark } = useTheme();
  const { isAuthenticated, role, booting } = useAuth();

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary:      COLORS.primary,
      background:   COLORS.background,
      card:         COLORS.card,
      text:         COLORS.textPrimary,
      border:       COLORS.border,
      notification: COLORS.secondary,
    },
  };

  if (booting) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const isOwner = role === 'OWNER' || role === 'DRIVER';

  return (
    <NavigationContainer theme={navigationTheme}>
      {!isAuthenticated
        ? <AuthNavigator />
        : isOwner
          ? <OwnerNavigator />
          : <ClientNavigator />}
    </NavigationContainer>
  );
}
