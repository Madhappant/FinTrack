import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SecurityProvider } from './src/context/SecurityContext';
import { LedgerProvider } from './src/context/LedgerContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <SecurityProvider>
        <LedgerProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </LedgerProvider>
      </SecurityProvider>
    </SafeAreaProvider>
  );
}
