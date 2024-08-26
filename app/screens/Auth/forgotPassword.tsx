import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

interface PageProps {
  navigation: NavigationProp<ParamListBase>;
}

const PasswordReset: React.FC<PageProps> = ({ navigation }) => {
  const { onForgotPassword, onVerifyResetCode, onResetPassword } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleNext = async () => {
    try {
        if (step === 1) {
          if (!onForgotPassword) return;
          await onForgotPassword(email);
          setStep(2);
        } else if (step === 2) {
          if (!onVerifyResetCode) return;
          await onVerifyResetCode(email, resetCode);
          setStep(3);
        } else if (step === 3) {
          if (!onResetPassword) return;
          await onResetPassword(email, newPassword);
          Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Başarılı',
            text2: 'Şifreniz başarıyla değiştirildi.',
          });
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error in handleNext:', error);
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Hata',
          text2:  'Bir hata oluştu.',
        });
      }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };
  const handleBackArrow = () => {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRightShape} />
      <View style={styles.bottomLeftShape} />
      <TouchableOpacity onPress={handleBackArrow} style={styles.backArrow}>
        <Ionicons name="arrow-back" size={28} color="#81A263" />
      </TouchableOpacity>
      <View style={styles.mainSection}>
        {step === 1 && (
          <View>
            <Text style={styles.subtitle}>Email Adresi:</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={24}
                color="#03346E"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#03346E"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        )}
        {step === 2 && (
          <View>
            <Text style={styles.subtitle}>E-postanıza gönderilen 6 haneli kodu giriniz:</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="key-outline"
                size={24}
                color="#03346E"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                value={resetCode}
                onChangeText={setResetCode}
                placeholder="Kod"
                placeholderTextColor="#03346E"
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
          </View>
        )}
        {step === 3 && (
          <View>
            <Text style={styles.subtitle}>Yeni Şifre:</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color="#03346E"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Yeni Şifre"
                placeholderTextColor="#03346E"
                secureTextEntry
              />
            </View>
          </View>
        )}
        <View style={styles.buttonContainer}>
        <TouchableOpacity
  onPress={handleBack}
  style={styles.backButton}
>
<Text style={styles.backButtonText}>Geri</Text>
</TouchableOpacity>
<TouchableOpacity
  onPress={handleNext}
  style={styles.nextButton}
>
  <Text style={styles.nextButtonText}>İleri</Text>
</TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  backArrow: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
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
    marginBottom: 20,
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
    flex: 1,
    color: '#03346E',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  backButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth:2,
    borderColor: '#03346E',
    alignSelf: 'center',
    marginTop: 20, 
  },
  backButtonText: {
    color: '#03346E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: '#03346E',
    alignSelf: 'center', 
    marginTop: 20,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PasswordReset;
