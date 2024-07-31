import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { authState, onLogout } = useAuth();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    if (authState?.user) {
      setFirstName(authState.user.firstName);
      setLastName(authState.user.lastName);
      setEmail(authState.user.email);
    }
  }, [authState?.user]);
  
  const handleLogout = async () => {
    try {
      if(!onLogout) return;
      await onLogout();
      Alert.alert('Logout', 'You have been logged out successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.greetingText}>Merhaba,</Text>
        <Text style={styles.greetingName}>{firstName} {lastName}</Text>
      </View>
      <Text style={styles.sectionTitle}>Ayarlar</Text>
      <View style={styles.separator} />

      <TouchableOpacity style={styles.button} onPress={() => { /* update information screen */ }}>
        <Text style={styles.buttonText}>Bilgilerimi Güncelle</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Çıkış</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => { /* delete account functionality */ }}>
        <Text style={styles.buttonText}>Hesabımı Sil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EDED',
    padding: 20,
  },
  topSection: {
    backgroundColor: '#81A263',
    width: '100%',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  greetingName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#698474',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCC',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#478CCF',
    padding: 15,
    width:270,
    borderRadius: 15,
    margin: 50,
    marginTop:35,
    marginBottom:1,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#7FA1C3',
  },
  deleteButton: {
    backgroundColor: '#C80036',
    alignItems:'center',
    alignSelf:'center',
    width:150,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
  },
});
