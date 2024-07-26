import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface User {
    firstName: string;
    lastName: string;
  }
  interface AuthState {
    token: string | null;
    authenticated: boolean | null;
    user: User | null;
  }
interface AuthProps {
    authState?: AuthState;

  onRegister?: (
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

export const TOKEN_KEY = 'jwt-token';
export const API_URL = 'http://192.168.1.101:3000';

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
    user: { firstName: string; lastName: string } | null;
  }>({
    token: null,
    authenticated: null,
    user: null,
  });

  axios.defaults.baseURL = API_URL;

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        axios.defaults.headers.common[`Authorization`] = `${token}`;
        setAuthState((prevState) => ({
            ...prevState,
            token: token,
            authenticated: true,
          }));
      }
    };
    loadToken();
  }, []);
  

  const register = async (
    first_name: string,
    last_name: string,
    email: string,
    password: string
) => {
    try {
        console.log('Register request payload:', { first_name, last_name, email, password });
        const result = await axios.post(`${API_URL}/register`, {
            first_name,
            last_name,
            email,
            password,
        });
        console.log('Register result:', result); 
        console.log('result.data ', result.data)
        return result.data;
    } catch (e){
      if (e.response) {
        // The server responded with a status code outside the 2xx range
        console.log('Error response:', e.response);
      } else if (e.request) {
        // The request was made but no response was received
        console.log('Error request:', e.request);
      } else {
        // Something happened in setting up the request that triggered an error
        console.log('Error message:', e.message);
      }
        return { error: true, msg: (e as any).response?.data || 'An error occurred' };
    }
};

  const login = async (email: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      console.log("Login result",result)

      setAuthState({
        token: result.data.token,
        authenticated: true,
        user: { firstName: result.data.firstName, lastName: result.data.lastName },
      });
      
      axios.defaults.headers.common[`Authorization`] = `${result.data.token}`;

      await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
      return result;
    } catch (e) {
      return { error: true, msg: (e as any).response.data };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    axios.defaults.headers.common[`Authorization`] = '';

    setAuthState({
      token: null,
      authenticated: false,
      user: null,
    });
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
