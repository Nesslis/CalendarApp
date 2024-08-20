import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal, TextInput} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useCallback, useEffect, useState } from 'react';
import { FloatingAction } from "react-native-floating-action";
import { NavigationProp, ParamListBase, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
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
type PageProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function MeetingsPage({ navigation }: PageProps) {
  const { onSearchEvents, authState } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      fetchEvents();
    } else {
      fetchEvents();
    }
  };
  const handleAddEvent = () => {
    navigation.navigate('AddEvent', { defaultCategoryId: 1});
  };

  const fetchEvents = async () => {
    if (authState?.authenticated) {
      try {
        if (!onSearchEvents) return;
        const startDateString = startDate ? startDate.toISOString().split('T')[0] : '';
        const endDateString = endDate ? endDate.toISOString().split('T')[0] : '';
        const eventsData = await onSearchEvents(1, startDateString, endDateString, searchText);
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
    setFilterModalVisible(false);
  };

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchText("");
    handleFetchEvents();
    setFilterModalVisible(false);
  };

  const handleEventPress = (event: Event) => {
    navigation.navigate('EventDetail', {event})
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
      <TouchableOpacity style={styles.filterIcon} onPress={() => setFilterModalVisible(true)}>
    <Icon name="filter" size={25} color="#03346E" />
  </TouchableOpacity>
  <Modal
  transparent={true}
  animationType="slide"
  visible={filterModalVisible}
  onRequestClose={() => setFilterModalVisible(false)}
>
  <View style={styles.modalContainer2}>
    <View style={styles.modalContent2}>
      <Text style={styles.modalTitle}>Filtrele</Text>
      <View style={styles.modalSeparator} />
      <TextInput
        style={styles.textInput}
        placeholder="Ara"
        value={searchText}
        onChangeText={handleSearchTextChange}
      />
      <View style={styles.modalRow2}>
        <Text style={styles.modalLabel}>Başlangıç Tarihi:</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowStartDatePicker(true)}>
          <Text style={styles.datePickerButtonText}>{startDate ? startDate.toLocaleDateString('tr-TR') : 'Seç'}</Text>
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
      </View>
      <View style={styles.modalRow2}>
        <Text style={styles.modalLabel}>Bitiş Tarihi:</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowEndDatePicker(true)}>
          <Text style={styles.datePickerButtonText}>{endDate ? endDate.toLocaleDateString('tr-TR') : 'Seç'}</Text>
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
      </View>
      <View style={styles.modalButtonRow}>
        <TouchableOpacity style={styles.closeButton2} onPress={() => setFilterModalVisible(false)}>
          <Text style={styles.closeButtonText2}>Kapat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
          <Text style={styles.clearButtonText}>Temizle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton2} onPress={handleFetchEvents}>
          <Text style={styles.applyButtonText}>Uygula</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

      <Text style={styles.welcomeText}>Toplantılarım</Text>
      <View style={styles.eventContainer}>
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
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}