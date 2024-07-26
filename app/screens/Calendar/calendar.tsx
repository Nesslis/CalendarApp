import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CalendarPage() {

  return (
    <View style={styles.container}>
        <Text style={styles.welcomeText}>Takvim</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#558FAA',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#333',
  },
});
