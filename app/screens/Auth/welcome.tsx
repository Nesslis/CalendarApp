import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

type WelcomePageProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function WelcomePage({ navigation }: WelcomePageProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRightShape} />
      <View style={styles.bottomLeftShape} />
      <View style={styles.bottomLeftShape2} />
      <View style={styles.mainSection}>
        <Text style={styles.title}>Başlayalım</Text>
        <Text style={styles.subtitle}>Etkinliklerinizi kolaylıkla yönetin</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.outlineButton]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.outlineButtonText}>Kayıt ol</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>
          
        </View>
      </View>
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
    zIndex: -1,
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
  title: {
    fontSize: 32,
    color: '#03346E',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  outlineButton: {
    borderColor: '#03346E',
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginRight: 10,
  },
  outlineButtonText: {
    color: '#03346E',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
