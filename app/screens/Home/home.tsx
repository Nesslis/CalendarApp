import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { styles } from './homeStyles';
import moment from 'moment';
import 'moment/locale/tr';
import 'moment-timezone';
import { useFocusEffect } from '@react-navigation/native';
import EventDetail from '../../components/eventDetail';

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
  const { onSearchEvents, authState } = useAuth();
  const [name, setName] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(moment().tz('Europe/Istanbul').format('YYYY-MM-DD'));
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (authState?.user) {
      setName(authState.user.firstName);
    }
  }, [authState?.user]);

  useEffect(() => {
    fetchEvents(selectedDate);
  }, [onSearchEvents, selectedDate]);

 

  const fetchEvents = async (date: string) => {
    if (authState?.authenticated) {
      try {
        if (!onSearchEvents) return;
        const eventsData = await onSearchEvents(undefined, date, date);
        const sortedEvents = eventsData.sort((a: Event, b: Event) => {
          const dateTimeA = moment.tz(`${a.date} ${a.time}`, 'YYYY-MM-DD HH:mm:ss', 'Europe/Istanbul').toDate();
          const dateTimeB = moment.tz(`${b.date} ${b.time}`, 'YYYY-MM-DD HH:mm:ss', 'Europe/Istanbul').toDate();
        return dateTimeA.getTime() - dateTimeB.getTime();
        });
        setEvents(sortedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
    setLoading(false);
  };
  

  useFocusEffect(
    useCallback(() => {
      fetchEvents(selectedDate);
    }, [authState, selectedDate])
  );

  const renderWeekDays = () => {
    const startOfWeek = moment().tz('Europe/Istanbul').startOf('isoWeek');
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = startOfWeek.clone().add(i, 'days');
      const isSelected = day.format('YYYY-MM-DD') === selectedDate;
      days.push(
        <TouchableOpacity key={i} onPress={() => setSelectedDate(day.format('YYYY-MM-DD'))}>
            <View style={[styles.dayContainer, isSelected && styles.selectedDay]}>
            <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{day.format('dd')}</Text>
            <Text style={[styles.dateText, isSelected && styles.selectedDayText]}>{day.date()}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const formatTime = (time: string) => {
    return moment.tz(time, 'HH:mm:ss', 'Europe/Istanbul').format('HH:mm');
  };

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    console.log(event)
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#03346E" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>Merhaba, {name}</Text>
      <View style={styles.weekContainer}>
        {renderWeekDays()}
      </View>
      <Text style={styles.headerText}>Günlük Etkinlikleriniz :</Text>
      <View style={styles.separator} />
      {events.length > 0 ? (
        events.map((event, index) => (
          <TouchableOpacity key={index} onPress={() => handleEventPress(event)}>
              <View style={styles.eventBox}>
              <Text style={styles.eventTime}>{formatTime(event.time)}</Text>
              <Text style={styles.eventTitle}>{event.title}</Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noEvents}>Bugün için kayıtlı etkinliğiniz yok.</Text>
      )}
      {selectedEvent && (
          <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </ScrollView>
  );
}
