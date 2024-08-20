import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationProp, ParamListBase, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment-timezone';
import styles from './eventStyles';

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
type EventsPageProps = {
  navigation: NavigationProp<ParamListBase>;
};
interface Category {
  category_id: number;
  category_name: string;
}

export default function EventsPage({navigation} : EventsPageProps) {
  const { onSearchEvents, onGetEventCategories, authState } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!onGetEventCategories) {
          console.log('onGetEventCategories function not available');
          return;
        }
        const categoriesData = await onGetEventCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [onGetEventCategories]);

  const handleAddEvent = () => {
    navigation.navigate('AddEvent');
  };

  const fetchEvents = async () => {
    if (authState?.authenticated) {
      try {
        if (!onSearchEvents) return;
        const startDateString = startDate ? startDate.toISOString().split('T')[0] : '';
        const endDateString = endDate ? endDate.toISOString().split('T')[0] : '';
        const eventsData = await onSearchEvents(selectedCategory, startDateString, endDateString);
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

  useEffect(() => {
    fetchEvents();
  }, [authState, selectedCategory, startDate, endDate]);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [authState, selectedCategory, startDate, endDate])
  );
  
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#03346E" />
      </View>
    );
  }

  const handleEventPress = (event: Event) => {
    navigation.navigate('EventDetail', {event})
  };

  const handleApplyFilters = (category: number | undefined, startDate: Date | undefined, endDate: Date | undefined) => {
    setSelectedCategory(category);
    setStartDate(startDate);
    setEndDate(endDate);
    setShowFilterModal(false);
    setLoading(true);
    fetchEvents();
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
      <TouchableOpacity
        style={styles.filterIconContainer}
        onPress={() => setShowFilterModal(true)}
      >
        <Icon name="filter" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.welcomeText}>Etkinliklerim</Text>
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
      <Modal
        transparent={true}
        animationType="slide"
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrele</Text>
            <View style={styles.modalSeparator} />
            <View style={styles.modalRow}>
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
            <View style={styles.modalRow}>
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
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Kategori Seçin" value={null} />
                {categories.map((category) => (
                  <Picker.Item
                    key={category.category_id}
                    label={category.category_name}
                    value={category.category_id}
                  />
                ))}
              </Picker>
            </View>

            
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowFilterModal(false)}>
                <Text style={styles.closeButtonText}>Kapat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.clearButton} onPress={() => handleApplyFilters(undefined, undefined, undefined)}>
                <Text style={styles.clearButtonText}>Temizle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={() => handleApplyFilters(selectedCategory, startDate, endDate)}>
                <Text style={styles.applyButtonText}>Uygula</Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}