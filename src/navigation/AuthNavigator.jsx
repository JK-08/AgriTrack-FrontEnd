import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/auth/Splash/SplashScreen';
import OnboardingScreen from '../screens/auth/Onboarding/OnboardingScreen';
import LoginScreen from '../screens/auth/Login/LoginScreen';
import RegisterScreen from '../screens/auth/Register/RegisterScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelection/RoleSelectionScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPassword/ForgotPasswordScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerification/OTPVerificationScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen name="Splash"           component={SplashScreen} />
      <Stack.Screen name="Onboarding"       component={OnboardingScreen} />
      <Stack.Screen name="RoleSelection"    component={RoleSelectionScreen} />
      <Stack.Screen name="Login"            component={LoginScreen} />
      <Stack.Screen name="Register"         component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword"   component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPVerification"  component={OTPVerificationScreen} />
    </Stack.Navigator>
  );
}
