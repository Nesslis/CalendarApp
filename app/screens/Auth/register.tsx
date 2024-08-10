import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; 
import { useAuth } from '../../context/AuthContext';
// import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
// import { useFocusEffect } from '@react-navigation/native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

type RegisterPageProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function RegisterPage({ navigation }: RegisterPageProps) {
  const { onRegister } = useAuth();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  // const topRightX = useSharedValue(0);
  // const topRightY = useSharedValue(0);
  // const bottomLeft1X = useSharedValue(0);
  // const bottomLeft1Y = useSharedValue(0);
  // const bottomLeft2X = useSharedValue(0);
  // const bottomLeft2Y = useSharedValue(0);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     topRightX.value = withTiming(-250, { duration: 1000, easing: Easing.ease});
  //     topRightY.value = withTiming(-100, { duration: 1000, easing: Easing.ease });
  //     bottomLeft1X.value = withTiming(-100, { duration: 1000, easing: Easing.ease });
  //     bottomLeft1Y.value = withTiming(-750, { duration: 1000, easing: Easing.ease });
  //     bottomLeft2X.value = withTiming(100, { duration: 1000, easing: Easing.ease });
  //     bottomLeft2Y.value = withTiming(100, { duration: 1000, easing: Easing.ease });

  //     return () => {
  //       topRightX.value = 0;
  //       topRightY.value = 0;
  //       bottomLeft1X.value = 0;
  //       bottomLeft1Y.value = 0;
  //       bottomLeft2X.value = 0;
  //       bottomLeft2Y.value = 0;
  //     };
  //   }, [])
  // );

  // const topRightStyle = useAnimatedStyle(() => ({
  //   transform: [{ translateX: topRightX.value }, { translateY: topRightY.value }],
  // }));

  // const bottomLeft1Style = useAnimatedStyle(() => ({
  //   transform: [{ translateX: bottomLeft1X.value }, { translateY: bottomLeft1Y.value }],
  // }));

  // const bottomLeft2Style = useAnimatedStyle(() => ({
  //   transform: [{ translateX: bottomLeft2X.value }, { translateY: bottomLeft2Y.value }],
  // }));

  return (
    <View style={styles.container}>
      <View style={ styles.bottomLeftShape}/>
      <View style={ styles.bottomLeftShape2}/>
      <View style={ styles.topRightShape}/>
        <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#81A263 " />
        </TouchableOpacity>
      <View style={styles.mainSection}>
        <Text style={styles.subtitle}>Hesap oluşturun</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={24} color="#03346E" style={styles.icon} />
          <TextInput style={styles.input} placeholder="İsim" placeholderTextColor="#03346E" value={name} onChangeText={setName} />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={24} color="#03346E" style={styles.icon} />
          <TextInput style={styles.input} placeholder="Soyisim" placeholderTextColor="#03346E" value={lastName} onChangeText={setLastName} />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#03346E" style={styles.icon} />
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#03346E" value={email} onChangeText={setEmail} />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#03346E" style={styles.icon} />
          <TextInput style={styles.input} placeholder="Şifre" placeholderTextColor="#03346E" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="#03346E"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Kayıt ol</Text>
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
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRightShape: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 180,
    height: 180,
    backgroundColor: 'rgba(129,162,99, 0.3)',
    borderRadius: 250,
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
    fontSize: 20,
    color: '#03346E',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#03346E',
    marginBottom: 20,
    width: '80%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#03346E',
    fontSize: 16,
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
  loginText: {
    color: '#03346E',
    fontSize: 16,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    marginLeft: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  successMessage: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
  },
});
