import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';

export default function WelcomePage({navigation}: {navigation: any}) {
  return (
    <View style={styles.container}>
      <View style={styles.topSection} />
      <View style={styles.mainSection}>
        <Text style={styles.title}>Lets Get Started</Text>
        <Text style={styles.subtitle}>Manage meetings with ease</Text>
        <View style={styles.buttonContainer}>
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          ><Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.outlineButton]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.outlineButtonText}>Register</Text> 
            </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomSection} />
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
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
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
  outlineButton: {
    borderColor: '#fff',
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  outlineButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});