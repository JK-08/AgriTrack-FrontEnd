import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../theme';

import ClientDashboardScreen from '../screens/client/ClientDashboard/ClientDashboardScreen';
import TractorSearchScreen from '../screens/client/TractorSearch/TractorSearchScreen';
import MyBookingsScreen from '../screens/client/MyBookings/MyBookingsScreen';
import PaymentHistoryScreen from '../screens/client/PaymentHistory/PaymentHistoryScreen';
import ClientProfileScreen from '../screens/client/ClientProfile/ClientProfileScreen';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home:     ['home-outline', 'home'],
  Search:   ['search-outline', 'search'],
  Bookings: ['calendar-outline', 'calendar'],
  Payments: ['card-outline', 'card'],
  Profile:  ['person-outline', 'person'],
};

export default function ClientTabNavigator() {
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
      <Tab.Screen name="Home"     component={ClientDashboardScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Search"   component={TractorSearchScreen} />
      <Tab.Screen name="Bookings" component={MyBookingsScreen} />
      <Tab.Screen name="Payments" component={PaymentHistoryScreen} />
      <Tab.Screen name="Profile"  component={ClientProfileScreen} />
    </Tab.Navigator>
  );
}
