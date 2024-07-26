import { View, Text, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; 
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage({ navigation }: { navigation: any }) {
    const {onRegister} = useAuth();
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] =useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleRegister = async () => {
        if (!onRegister) return;
        const result = await onRegister(name, lastName, email, password);
        console.log('In register page result : ', result);
        if (result?.error) {
          console.log('Registration error:', result.msg); 
        } else {
          console.log('Registration successful:', result); 
          setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                navigation.navigate('Login');
            }, 2000);
        }
    };

      const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.mainSection}>
        <Text style={styles.subtitle}>Create an account</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={24} color="white" style={styles.icon} />
          <TextInput style={styles.input} placeholder="First Name :" placeholderTextColor="#fff" value = {name } onChangeText={setName} />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={24} color="white" style={styles.icon} />
          <TextInput style={styles.input} placeholder="Last Name :" placeholderTextColor="#fff" value={lastName} onChangeText={setLastName} />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="white" style={styles.icon} />
          <TextInput style={styles.input} placeholder="Email :" placeholderTextColor="#fff" value={email} onChangeText={setEmail} />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="white" style={styles.icon} />
          <TextInput style={styles.input} placeholder="Password :" placeholderTextColor="#fff" value={password} onChangeText={setPassword} secureTextEntry={!showPassword}/>
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
        {showSuccessMessage && (
                    <Text style={styles.successMessage}>Kayıt başarılı!</Text>
                )}
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
      <Text style={styles.loginText}>Hesabın var mı? Giriş Yap</Text>
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
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginBottom: 20,
    width: '80%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
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
  loginText: {
    color: '#fff',
    fontSize: 16,
    marginBottom:20,
  },
  backButton: {
    padding: 10,
    marginLeft:10,
    marginTop:10,
  },
  successMessage: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
},
});