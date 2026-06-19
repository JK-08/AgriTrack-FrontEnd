import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../theme';

import OwnerDashboardScreen from '../screens/owner/OwnerDashboard/OwnerDashboardScreen';
import CustomerListScreen from '../screens/owner/CustomerList/CustomerListScreen';
import StartWorkScreen from '../screens/owner/StartWork/StartWorkScreen';
import WorkHistoryScreen from '../screens/owner/WorkHistory/WorkHistoryScreen';
import SettingsScreen from '../screens/owner/Settings/SettingsScreen';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home:      ['home-outline', 'home'],
  Customers: ['people-outline', 'people'],
  Work:      ['timer-outline', 'timer'],
  History:   ['receipt-outline', 'receipt'],
  Settings:  ['settings-outline', 'settings'],
};

export default function OwnerTabNavigator() {
  const { COLORS } = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarStyle: { backgroundColor: COLORS.card, borderTopColor: COLORS.border, height: 60, paddingBottom: 6, paddingTop: 6 },
        tabBarLabelStyle: { fontFamily: 'Poppins-Medium', fontSize: 11 },
        tabBarIcon: ({ focused, color, size }) => {
          const [out, fill] = ICONS[route.name] || ['ellipse-outline', 'ellipse'];
          return <Ionicons name={focused ? fill : out} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"      component={OwnerDashboardScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Customers" component={CustomerListScreen} />
      <Tab.Screen name="Work"      component={StartWorkScreen} />
      <Tab.Screen name="History"   component={WorkHistoryScreen} />
      <Tab.Screen name="Settings"  component={SettingsScreen} />
    </Tab.Navigator>
  );
}
