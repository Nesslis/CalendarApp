import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useCallback, useEffect, useState } from 'react';
import { FloatingAction } from "react-native-floating-action";
import AddEventModal from '../../components/addEventModal';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EventDetail from '../../components/eventDetail';
import { useAuth } from '../../context/AuthContext';
import { styles } from './meetingsStyle';
import moment from 'moment';
const actions = [
  {
    text: "Toplantı Ekle",
    name: "bt_accessibility",
    position: 2
  }
];
interface Event {
  event_id: number;
  user_id: number;
  category_id: number;
  title: string;
  date: string;
  time: string;
  location?: string;
  participant?: string;
  created_at: string;
  updated_at: string;
  content?: string;
}


export default function MeetingsPage() {
  const { onSearchEvents, authState } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalVisible, setModalVisible] = useState(false);


  const fetchEvents = async () => {
    if (authState?.authenticated) {
      try {
        if (!onSearchEvents) return;
        const startDateString = startDate ? startDate.toISOString().split('T')[0] : '';
        const endDateString = endDate ? endDate.toISOString().split('T')[0] : '';
        const eventsData = await onSearchEvents(1, startDateString, endDateString);
        const sortedMeetings = eventsData.sort((a: Event, b: Event) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          if (dateA === dateB) {
            // If dates are the same, compare times
            const timeA = a.time ? new Date(`1970-01-01T${a.time}Z`).getTime() : 0;
            const timeB = b.time ? new Date(`1970-01-01T${b.time}Z`).getTime() : 0;
            return timeA - timeB;
          } else {
            return dateA - dateB;
          }
        });
        setEvents(sortedMeetings);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [startDate, endDate]);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [authState, startDate, endDate])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#03346E" />
      </View>
    );
  }

  const handleFetchEvents = () => {
    setLoading(true);
    fetchEvents();
  };

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    handleFetchEvents();
  };

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}.${month}.${year}`;
  };

  const renderEvent = ({ item }: { item: Event }) => {
    const eventTime = item.time ? moment.tz(item.time, 'HH:mm:ss', 'Europe/Istanbul').format('HH:mm') : '-';
    const truncatedTitle = item.title.length > 10 ? `${item.title.substring(0, 10)}...` : item.title;
    return (
      <TouchableOpacity style={styles.eventRow} onPress={() => handleEventPress(item)}>
        <Text style={styles.eventText}>{truncatedTitle}</Text>
        <Text style={styles.eventText}>{formatDate(item.date)}</Text>
        <Text style={styles.eventText}>{eventTime}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartDatePicker(true)}>
          <Text style={styles.dateButtonText}>Başlangıç Tarihi</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowStartDatePicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndDatePicker(true)}>
          <Text style={styles.dateButtonText}>Bitiş Tarihi </Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowEndDatePicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}
        <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
          <Icon name="times" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={handleFetchEvents}>
          <Icon name="check" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.welcomeText}>Toplantılarım</Text>
      <View style={styles.eventsBox}>
        <FlatList
          data={events}
          renderItem={renderEvent}
          keyExtractor={(item) => item.event_id.toString()}
          ListHeaderComponent={() => (
            <View style={styles.headerRow}>
              <Text style={styles.headerText}>Başlık</Text>
              <Text style={styles.headerText}>Tarih</Text>
              <Text style={styles.headerText}>Saat</Text>
            </View>
          )}
        />
      </View>
      <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        <AddEventModal visible={modalVisible} onClose={()=> setModalVisible(false)} defaultCategoryId={1} onEventAdded={() => fetchEvents} />
      <FloatingAction
      color='#478CCF'
    actions={actions}
    onPressItem={() => {
      setModalVisible(true);
    }}
  />
    </View>
  );
}