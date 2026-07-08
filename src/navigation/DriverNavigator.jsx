import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DriverTabNavigator from './DriverTabNavigator';
import DriverJobDetailScreen from '../screens/driver/DriverJobDetail/DriverJobDetailScreen';
import ChatListScreen from '../screens/shared/ChatList/ChatListScreen';
import ChatScreen from '../screens/shared/Chat/ChatScreen';
import LanguageScreen from '../screens/shared/Language/LanguageScreen';
import ThemeScreen from '../screens/shared/Theme/ThemeScreen';

const Stack = createNativeStackNavigator();

export default function DriverNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="DriverTabs"     component={DriverTabNavigator} />
      <Stack.Screen name="DriverJobDetail" component={DriverJobDetailScreen} />
      <Stack.Screen name="ChatList"        component={ChatListScreen} />
      <Stack.Screen name="Chat"            component={ChatScreen} />
      <Stack.Screen name="Language"        component={LanguageScreen} />
      <Stack.Screen name="Theme"           component={ThemeScreen} />
    </Stack.Navigator>
  );
}
