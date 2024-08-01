import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';

export default function LoginPage({ navigation }: { navigation: any }) {
  const { onLogin } = useAuth();
  const [email, setEmail] = useState('basicuser@example.com');
  const [password, setPassword] = useState('S1+tring');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const result = await onLogin?.(email, password);
    if (result?.error) {
      console.log(result.msg); 
    } else {
      console.log('Login Successful');
      navigation.navigate('Home');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const topRightX = useSharedValue(0);
  const topRightY = useSharedValue(0);
  const bottomLeftX = useSharedValue(0);
  const bottomLeftY = useSharedValue(0);

  useFocusEffect(
    React.useCallback(() => {
      // Animasyon başladığında
      topRightX.value = withTiming(-100, { duration: 1000, easing: Easing.inOut(Easing.ease) });
      topRightY.value = withTiming(-100, { duration: 1000, easing: Easing.inOut(Easing.ease) });
      bottomLeftX.value = withTiming(100, { duration: 1000, easing: Easing.inOut(Easing.ease) });
      bottomLeftY.value = withTiming(100, { duration: 1000, easing: Easing.inOut(Easing.ease) });

      return () => {
        // Animasyon sıfırlanırken
        topRightX.value = 0;
        topRightY.value = 0;
        bottomLeftX.value = 0;
        bottomLeftY.value = 0;
      };
    }, [])
  );

  const topRightStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: topRightX.value }, { translateY: topRightY.value }],
  }));

  const bottomLeftStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: bottomLeftX.value }, { translateY: bottomLeftY.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={ styles.bottomLeftShape}/>
      <View style={ styles.bottomLeftShape2}/>
      <View style={ styles.topRightShape}/>
        <TouchableOpacity
          onPress={() => navigation.navigate('Welcome')}
          style={styles.backButton}
        >
          <Ionicons name='arrow-back' size={28} color='#81A263 ' />
        </TouchableOpacity>
      <View style={styles.mainSection}>
        <Text style={styles.subtitle}>Hesabınıza giriş yapın</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name='mail-outline'
            size={24}
            color='white'
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder='Email :'
            placeholderTextColor='#fff'
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name='lock-closed-outline'
            size={24}
            color='white'
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder='Şifre :'
            placeholderTextColor='#fff'
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="#03346E"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.signupText}>Hesabın yok mu? Kayıt ol</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  topRightShape: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 150,
    height: 120,
    backgroundColor: 'rgba(129,162,99, 0.3)',
    borderBottomLeftRadius: 250,
  },
  bottomLeftShape: {
    position: 'absolute',
    bottom: -70,
    left: -90,
    width: 230,
    height: 230,
    backgroundColor: 'rgba(129, 162, 99, 0.4)',
    borderRadius: 250,
  },
  bottomLeftShape2: {
    position: 'absolute',
    bottom: -110,
    left: -10,
    width: 230,
    height: 230,
    backgroundColor: 'rgba(129, 162, 99, 0.3)',
    borderRadius: 250,
  },
  mainSection: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 22,
    color: '#03346E',
    marginBottom: 70,
  },
  buttonContainer: {
    marginTop: 25,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#03346E',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#03346E',
    marginBottom: 25,
    width: '80%',
  },
  icon: {
    marginRight: 10,
    color: '#03346E',
  },
  input: {
    width: '80%',
    color: '#03346E',
    fontSize: 16,
  },
  signupText: {
    color: '#03346E',
    fontSize: 16,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    marginLeft: 10,
    marginTop: 10,
    alignSelf:'flex-start',
  },
});
