import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext'; 

export default function HomePage() {
  const { authState } = useAuth();
  const user = authState?.user || { firstName: '', lastName: '' };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeBox}>
        <Text style={styles.welcomeText}>Hoşgeldiniz,</Text>
        <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
  },
  welcomeBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 18,
    color: '#333',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
});
