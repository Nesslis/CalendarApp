import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SettingsPage() {

  return (
    <View style={styles.container}>
        <Text style={styles.welcomeText}>Ayarlar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A33B3B',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#333',
  },
});
