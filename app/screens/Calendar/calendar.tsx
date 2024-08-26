import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import calendarStyles from './calendarStyles';
import {  NavigationProp, ParamListBase, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

type RootStackParamList = {
  Calendar: undefined;
  Days: { selectedDate: string; events: Event[] };
  navigation: NavigationProp<ParamListBase>;
};

interface Event {
  event_id: number;
  user_id: number;
  category_id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  participant: string;
  created_at: string;
  updated_at: string;
  content: string | null;
}
const CalendarPage = ({navigation}: {navigation: RootStackParamList}) => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [isYearPickerVisible, setIsYearPickerVisible] = useState(false);
  const [isMonthPickerVisible, setIsMonthPickerVisible] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const { onGetEvents } = useAuth();
  const yearScrollViewRef = useRef<ScrollView>(null);
  const monthScrollViewRef = useRef<ScrollView>(null);

  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const daysOfWeek = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  useEffect(() => {
    if (isYearPickerVisible && yearScrollViewRef.current) {
      const index = selectedYear - (currentDate.getFullYear() - 50);
      yearScrollViewRef.current.scrollTo({
        y: index * 50,
        animated: true,
      });
    }
  }, [isYearPickerVisible]);

  useEffect(() => {
    if (isMonthPickerVisible && monthScrollViewRef.current) {
      monthScrollViewRef.current.scrollTo({
        y: selectedMonth * 50,
        animated: true,
      });
    }
  }, [isMonthPickerVisible]);

  useEffect(() => {
    
    fetchAndFilterEvents();
  }, [selectedYear, selectedMonth]);
  const fetchAndFilterEvents = async () => {
    if(!onGetEvents) return;
    const allEvents = await onGetEvents();
    const filteredEvents = allEvents.filter((event: { date: string }) => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === selectedYear && eventDate.getMonth() === selectedMonth;
    });
    setEvents(filteredEvents);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAndFilterEvents();
    }, [selectedYear, selectedMonth])
  );

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleAddEvent = () => {
    navigation.navigate('AddEvent');
  };

  const renderDays = () => {
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const days = [];

    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    for (let i = 0; i < startDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={calendarStyles.dayContainer} />
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = 
        selectedYear === currentDate.getFullYear() && 
        selectedMonth === currentDate.getMonth() && 
        i === currentDate.getDate();
        const hasEvent = events.some(event => new Date(event.date).getDate() === i);
      days.push(
        <TouchableOpacity 
        key={i} 
        style={[
          calendarStyles.dayContainer, 
          isToday && calendarStyles.todayContainer
        ]}
        onPress={() => navigation.navigate('Days', { selectedDate: `${selectedYear}-${selectedMonth + 1}-${i}`, events })}
      >
        <Text style={[
          calendarStyles.dayText, 
          isToday && calendarStyles.todayText
        ]}>{i}</Text>
        {hasEvent && <View style={calendarStyles.dot} />}
        </TouchableOpacity>
      );
    }
    return days;
  };

  return (
    <View style={calendarStyles.container}>
      <View style={calendarStyles.header}>
        <TouchableOpacity onPress={() => setIsYearPickerVisible(true)}>
          <Text style={calendarStyles.headerText}>{selectedYear}</Text>
        </TouchableOpacity>
        <Modal
          visible={isYearPickerVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsYearPickerVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsYearPickerVisible(false)}>
            <View style={calendarStyles.modalContainer}>
              <TouchableWithoutFeedback>
                <ScrollView style={calendarStyles.pickerContainer} ref={yearScrollViewRef}>
                  {[...Array(100).keys()].map(i => (
                    <TouchableOpacity 
                      key={i} 
                      style={[
                        calendarStyles.pickerItem,
                        selectedYear === currentDate.getFullYear() - 50 + i && calendarStyles.selectedItem
                      ]}
                      onPress={() => {
                        setSelectedYear(currentDate.getFullYear() - 50 + i);
                        setIsYearPickerVisible(false);
                      }}
                    >
                      <Text style={[
                        calendarStyles.pickerText,
                        selectedYear === currentDate.getFullYear() - 50 + i && calendarStyles.selectedItemText
                      ]}>
                        {currentDate.getFullYear() - 50 + i}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        
        <View style={calendarStyles.monthContainer}>
          <TouchableOpacity onPress={handlePrevMonth}>
            <Ionicons style={calendarStyles.arrowText} name='arrow-back' size={28} color='#81A263 ' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsMonthPickerVisible(true)}>
            <Text style={calendarStyles.headerText}>{months[selectedMonth]}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextMonth}>
          <Ionicons style={calendarStyles.arrowText} name='arrow-forward' size={28} color='#81A263 ' />
          </TouchableOpacity>
        </View>
        <Modal
          visible={isMonthPickerVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsMonthPickerVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsMonthPickerVisible(false)}>
            <View style={calendarStyles.modalContainer}>
              <TouchableWithoutFeedback>
                <ScrollView style={calendarStyles.pickerContainer} ref={monthScrollViewRef}>
                  {months.map((month, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={[
                        calendarStyles.pickerItem,
                        selectedMonth === index && calendarStyles.selectedItem
                      ]}
                      onPress={() => {
                        setSelectedMonth(index);
                        setIsMonthPickerVisible(false);
                      }}
                    >
                      <Text style={[
                        calendarStyles.pickerText,
                        selectedMonth === index && calendarStyles.selectedItemText
                      ]}>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>

      <View style={calendarStyles.daysOfWeekContainer}>
        {daysOfWeek.map((day, index) => (
          <View key={index} style={calendarStyles.dayOfWeekContainer}>
            <Text style={calendarStyles.dayOfWeekText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={calendarStyles.calendarContainer}>
        {renderDays()}
      </View>
      <TouchableOpacity style={calendarStyles.addButton} onPress={handleAddEvent}>
        <Text style={calendarStyles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CalendarPage;
