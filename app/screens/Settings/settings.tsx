import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const {  onLogout } = useAuth();

  
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
      <View style={styles.topRightShape} />
      <View style={styles.bottomLeftShape} />
      <View style={styles.bottomLeftShape2} />

      <View style = {styles.sectionConteiner}>
      <Text style={styles.sectionTitle}>Ayarlar</Text>
      <View style={styles.separator} />

      <TouchableOpacity style={styles.button} onPress={() => { /* update information screen */ }}>
        <Text style={styles.buttonText}>Bilgilerimi Güncelle</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Çıkış</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => { /* delete account */ }}>
        <Text style={styles.buttonText}>Hesabımı Sil</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
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
  sectionConteiner: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  sectionTitle: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#03346E',
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
