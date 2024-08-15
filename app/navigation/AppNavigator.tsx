import React, { createContext, useEffect, useState } from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

// navigator
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import WelcomePage from '../screens/Auth/welcome';
import LoginPage from '../screens/Auth/login';
import RegisterPage from '../screens/Auth/register';
import HomePage from '../screens/Home/home';
import CalendarPage from '../screens/Calendar/calendar';
import EventsPage from '../screens/Events/events';
import MeetingsPage from '../screens/Meetings/meetings';
import NotesPage from '../screens/Notes/notes';
import SettingsPage from '../screens/Settings/settings';
import { useAuth } from '../context/AuthContext';
import DayEventsPage from '../screens/Calendar/dayEvents';
import EditProfile from '../screens/Settings/editProfile';

// Authentication context
const AuthContext = createContext({ isLoggedIn: false, login: () => {}, logout: () => {} });

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CalendarStackNavigator = () => {
  const hideHeader = () => ({
    headerShown: false,
  });

  return (
    <Stack.Navigator>
      <Stack.Screen name="Calendar" component={CalendarPage} options={hideHeader} />
      <Stack.Screen name="Days" component={DayEventsPage} options={hideHeader} />
    </Stack.Navigator>
  );
};
const SettingsStackNavigator = () => {
  const hideHeader = () => ({
    headerShown: false,
  });

  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={SettingsPage} options={hideHeader} />
      <Stack.Screen name="Güncelle" component={EditProfile} options={hideHeader} />
    </Stack.Navigator>
  );
};

const MainTabNavigator = () => {
  const hideHeader = () => ({
    headerShown: false,
  });
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: '#478CCF', // Active tab color
        tabBarInactiveTintColor: 'gray', // Inactive tab color
        tabBarStyle: {
          display: 'flex', // Tab bar style
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'AnaSayfa':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Takvim':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Toplantılar':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Etkinlikler':
              iconName = focused ? 'today' : 'today-outline';
              break;
            case 'Notlarım':
              iconName = focused ? 'document' : 'document-outline';
              break;
            case 'Ayarlar':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'home-outline';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="AnaSayfa" component={HomePage} options={hideHeader} />
      <Tab.Screen name="Takvim" component={CalendarStackNavigator} options={hideHeader}/>
      <Tab.Screen name="Toplantılar" component={MeetingsPage} options={hideHeader}/>
      <Tab.Screen name="Etkinlikler" component={EventsPage} options={hideHeader}/>
      <Tab.Screen name="Notlarım" component={NotesPage} options={hideHeader}/>
      <Tab.Screen name="Ayarlar" component={SettingsStackNavigator} options={hideHeader}/>
    </Tab.Navigator>
  )
}
export const AppNavigator = () => {
  const {authState} = useAuth();

  const hideHeader = () => ({
    headerShown: false,
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
      {authState?.authenticated ? (
            <>
            <Stack.Screen name='Home' component={MainTabNavigator} options={hideHeader} />
            <Stack.Screen name='Days' component={DayEventsPage} options={hideHeader} />
            </>
          ) : (
            <>
            <Stack.Screen name="Welcome" component={WelcomePage} options={hideHeader} />
             <Stack.Screen name="Login" component={LoginPage} options={hideHeader} />
            <Stack.Screen name="Register" component={RegisterPage} options={hideHeader} />
            </>
          )}
      </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  useEffect(() => {
    const token = null; 
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      <AppNavigator />
    </AuthContext.Provider>
  );
};

export default App;