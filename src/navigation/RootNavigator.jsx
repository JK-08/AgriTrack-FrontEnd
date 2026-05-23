import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabNavigator, ComponentsUsageScreen } from './index';
import { useTheme } from '../theme';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { COLORS, isDark } = useTheme();

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

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background }, animation: 'fade' }}
      >
        <Stack.Screen name="Main"            component={BottomTabNavigator} />
        <Stack.Screen name="ComponentsUsage" component={ComponentsUsageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
