import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../theme';

import DriverDashboardScreen from '../screens/driver/DriverDashboard/DriverDashboardScreen';
import DriverJobListScreen from '../screens/driver/DriverJobList/DriverJobListScreen';
import DriverEarningsScreen from '../screens/driver/DriverEarnings/DriverEarningsScreen';
import DriverProfileScreen from '../screens/driver/DriverProfile/DriverProfileScreen';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home:     ['home-outline', 'home'],
  Jobs:     ['clipboard-outline', 'clipboard'],
  Earnings: ['wallet-outline', 'wallet'],
  Profile:  ['person-outline', 'person'],
};

export default function DriverTabNavigator() {
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
      <Tab.Screen name="Home"     component={DriverDashboardScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Jobs"     component={DriverJobListScreen} />
      <Tab.Screen name="Earnings" component={DriverEarningsScreen} />
      <Tab.Screen name="Profile"  component={DriverProfileScreen} />
    </Tab.Navigator>
  );
}
