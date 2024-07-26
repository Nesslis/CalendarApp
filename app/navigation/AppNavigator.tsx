import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

// navigator
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomePage from '../screens/Auth/welcome';
import LoginPage from '../screens/Auth/login';
import RegisterPage from '../screens/Auth/register';
import HomePage from '../screens/Home/home';


const Stack = createNativeStackNavigator();

export const AppNavigator = () => {

  const hideHeader = () => ({
    headerShown: false,
  });
  const showHeader = () => ({
    headerTitleStyle: {
      color: '#000',
    },
    headerTintColor: '#000',
  });

  const theme = extendTheme({
    colors: {
      background: '#ECEFEF',
      orange: '#FF8727',
      blue: '#688DA2',
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
            <>
              <Stack.Screen name='Welcome' component={WelcomePage} options={hideHeader} />
              <Stack.Screen name='Login' component={LoginPage} options={hideHeader} />
              <Stack.Screen name='Register' component={RegisterPage} options={hideHeader} />
              <Stack.Screen name='Home' component={HomePage} options={hideHeader} />
            </>
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};
