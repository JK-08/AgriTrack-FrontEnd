import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ClientTabNavigator from './ClientTabNavigator';
import TractorOwnerProfileScreen from '../screens/client/TractorOwnerProfile/TractorOwnerProfileScreen';
import RequestServiceScreen from '../screens/client/RequestService/RequestServiceScreen';
import BookingStatusScreen from '../screens/client/BookingStatus/BookingStatusScreen';
import PaymentScreen from '../screens/client/Payment/PaymentScreen';
import InvoiceViewScreen from '../screens/client/InvoiceView/InvoiceViewScreen';
import RatingScreen from '../screens/client/Rating/RatingScreen';
import NotificationsScreen from '../screens/owner/Notifications/NotificationsScreen';
import ChatListScreen from '../screens/shared/ChatList/ChatListScreen';
import ChatScreen from '../screens/shared/Chat/ChatScreen';
import LanguageScreen from '../screens/shared/Language/LanguageScreen';
import ThemeScreen from '../screens/shared/Theme/ThemeScreen';
import RateAlertScreen from '../screens/shared/RateAlert/RateAlertScreen';

const Stack = createNativeStackNavigator();

export default function ClientNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="ClientTabs"          component={ClientTabNavigator} />
      <Stack.Screen name="TractorOwnerProfile" component={TractorOwnerProfileScreen} />
      <Stack.Screen name="RequestService"      component={RequestServiceScreen} />
      <Stack.Screen name="BookingStatus"       component={BookingStatusScreen} />
      <Stack.Screen name="Payment"             component={PaymentScreen} />
      <Stack.Screen name="InvoiceView"         component={InvoiceViewScreen} />
      <Stack.Screen name="Rating"              component={RatingScreen} />
      <Stack.Screen name="Notifications"       component={NotificationsScreen} />
      <Stack.Screen name="ChatList"            component={ChatListScreen} />
      <Stack.Screen name="Chat"                component={ChatScreen} />
      <Stack.Screen name="Language"            component={LanguageScreen} />
      <Stack.Screen name="Theme"               component={ThemeScreen} />
      <Stack.Screen name="RateAlerts"          component={RateAlertScreen} />
    </Stack.Navigator>
  );
}
