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

export default function LoginPage({ navigation }: { navigation: any }) {
  const {onLogin} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleLogin = async () => {
    const result = await onLogin?.(email, password);
    if (result?.error) {
      console.log(result.msg); 
    } else {
      console.log('Successs'); 
      console.log(result);
      navigation.navigate('Home');
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Welcome')}
          style={styles.backButton}
        >
          <Ionicons name='arrow-back' size={28} color='white' />
        </TouchableOpacity>
      </View>
      <View style={styles.mainSection}>
        <Text style={styles.subtitle}>Log in to your account</Text>
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
            placeholder='Password :'
            placeholderTextColor='#fff'
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
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
    backgroundColor: '#83c8f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    backgroundColor: '#49a5de',
    width: '100%',
    height: '18%',
    borderBottomLeftRadius: 250,
  },
  bottomSection: {
    backgroundColor: '#49a5de',
    width: '100%',
    height: '18%',
    borderTopRightRadius: 250,
  },
  mainSection: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 70,
  },
  buttonContainer: {
    marginTop: 25,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginRight: 10,
  },
  buttonText: {
    color: '#83c8f2',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginBottom: 25,
    width: '80%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    width: '80%',
    color: '#fff',
    fontSize: 16,
  },
  signupText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    marginLeft: 10,
    marginTop: 10,
  },
});
