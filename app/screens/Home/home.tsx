import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import moment from 'moment';
import { useAuth } from '../../context/AuthContext';
interface Event {
  event_id: number;
  user_id: number;
  category_id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  participant: string | null;
  content: string | null;
}
export default function HomePage() {
  const { onSearchEvents } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if(!onSearchEvents) return;
        const today = moment().format('YYYY-MM-DD');
        const fetchedEvents = await onSearchEvents(undefined, today, today); // Fetch events for today
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [onSearchEvents]);

  const formatTime = (time : string) => {
    return moment(time, 'HH:mm:ss').format('HH:mm');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#03346E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Bugünkü etkinlikleriniz:</Text>
      <View style={styles.separator} />
      {events.length > 0 ? (
        events.map((event, index) => (
          <View key={index} style={styles.eventBox}>
            <Text style={styles.eventTime}>{formatTime(event.time)}</Text>
            <Text style={styles.eventTitle}>{event.title}</Text>
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03346E',
    marginBottom: 30,
    marginTop: 20,
    textAlign: 'left',
  },
  eventTitle: {
    fontSize: 18,
    color: '#03346E',
    marginVertical: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#7FA1C3',
    alignSelf: 'stretch',
    marginVertical: 10,
    marginTop: 25,
    marginBottom: 55,
  },
  eventBox: {
    backgroundColor: 'rgba(182, 199, 170, 0.5)',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 25,
  },
  eventTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#03346E',
  },
  eventsTitle: {
    fontSize: 18,
    color: '#03346E',
    marginTop: 5,
    alignItems: 'center',
    alignSelf: 'center',
  },
  noEvents: {
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});
