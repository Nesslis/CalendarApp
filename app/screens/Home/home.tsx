import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const events = [
  { time: '09:00 - 11:00', title: 'Toplantı Başlığı' },
  { time: '14:00 - 15:00', title: 'Ziyaretçi Başlığı' },
];
export default function HomePage() {

  return (
    <View style={styles.container}>
      <Text style={styles.eventTitle}>Bugünkü etkinlikleriniz:</Text>
      <View style={styles.separator} />
      {events.length > 0 ? (
        events.map((event, index) => (
          <View key={index} style={styles.eventBox}>
            <Text style={styles.eventTime}>{event.time}</Text>
            <Text style={styles.eventsTitle}>{event.title}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noEvents}>Bugün için kayıtlı etkinliğiniz yok.</Text>
      )}
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
    alignItems:'flex-start',
    padding: 20,
    paddingRight: 45,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
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
  eventTitle: {
    fontSize: 18,
    color: '#333',
    marginVertical: 10,
    alignItems:'center',
    alignSelf:'center',
    marginTop:85,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCC',
    alignSelf: 'stretch',
    marginVertical: 10,
    marginTop:25,
    marginBottom:45,
  },
  eventBox: {
    backgroundColor: '#FFB6C1',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    width: '90%',
    alignSelf:'center',
    marginBottom:15,
  },
  eventTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventsTitle: {
    fontSize: 18,
    color: '#333',
    marginTop: 5,
    alignItems:'center',
    alignSelf:'center',
  },
  noEvents: {
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});