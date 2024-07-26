import React, { Suspense, useEffect } from 'react';
import { ActivityIndicator, LogBox } from 'react-native';
import { AppNavigator } from './app/navigation/AppNavigator';
import AppProvider from './app/hooks';
import { StatusBar } from 'native-base';

// INFO: required for upload image bug fixes
import 'react-native-get-random-values';
import { decode, encode } from 'base-64';
import { AuthProvider } from './app/context/AuthContext';
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

export default function App() {
  useEffect(() => {
    LogBox.ignoreLogs(['In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.']);
  }, []);

  return (
    <Suspense fallback={<ActivityIndicator size='large' color='#00ff00' />}>
      <StatusBar barStyle='dark-content' />
      <AppProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </AppProvider>
    </Suspense>
  );
}
