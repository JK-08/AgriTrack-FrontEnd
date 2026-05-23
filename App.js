import 'react-native-gesture-handler';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { store, persistor } from './src/store';
import { ThemeProvider } from './src/providers/ThemeProvider';
import { LanguageProvider } from './src/providers/LanguageProvider';
import { ToastProvider } from './src/components/ui/Toast';
import RootNavigator from './src/navigation/RootNavigator';
import useFonts from './src/utils/Fonts';

const queryClient = new QueryClient();

export default function App() {
  const fontsLoaded = useFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider>
                <LanguageProvider>
                  <ToastProvider>
                    <StatusBar style="auto" />
                    <RootNavigator />
                  </ToastProvider>
                </LanguageProvider>
              </ThemeProvider>
            </QueryClientProvider>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
