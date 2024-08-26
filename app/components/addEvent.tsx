import React, { useState, useEffect } from 'react';
import {  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import moment from 'moment-timezone';
import { NavigationProp, ParamListBase, RouteProp } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

interface Category {
  category_id: number;
  category_name: string;
}

interface AddEventModalProps {
  defaultCategoryId?: number;
  onEventAdded ?: () => void;
  selectedDate?: string;
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase, string>;
}

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

export default function AddEvent({ route, navigation }: AddEventModalProps) {
  const { onGetEventCategories, onAddEvent, onSearchEvents, authState } = useAuth();
  const { selectedDate, defaultCategoryId, onEventAdded } = route.params as AddEventModalProps || {};
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(defaultCategoryId || null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date(selectedDate || Date.now()));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [participant, setParticipant] = useState('');
  const [content, setContent] = useState('');
  const [existingEvents, setExistingEvents] = useState([]);

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

    const fetchEvents = async () => {
      try {
        if (!onSearchEvents) return;
        const eventsData = await onSearchEvents(null, '', '');
        setExistingEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchCategories();
    fetchEvents();
  }, [onGetEventCategories, onSearchEvents, authState]);
  useEffect(() => {
    if (defaultCategoryId) {
      setSelectedCategory(defaultCategoryId);
    } else {
      setSelectedCategory(null);
    }
  }, [defaultCategoryId]);
  const handleAddEvent = async () => {
    if (!selectedCategory || !title || !date || !time) {
      Alert.alert('Lütfen tüm gerekli alanları doldurun.');
      return;
    }

    const newEventDateTime = moment(`${moment(date).format('YYYY-MM-DD')}T${time}`, moment.ISO_8601);
    const conflict = existingEvents.some((event: Event) => {
      const eventDate = moment(event.date).format('YYYY-MM-DD');
      const eventTime = moment(event.time, 'HH:mm:ss').format('HH:mm');
      const eventDateTime = moment(`${eventDate}T${eventTime}`, moment.ISO_8601);
      return eventDateTime.isSame(newEventDateTime);
    });

    if (conflict) {
      Alert.alert('Bu tarih ve saatte zaten bir etkinlik var.');
      return;
    }

    try {
      if (!onAddEvent) return;
      const eventData = {
        category_id: selectedCategory,
        title,
        date: moment(date).tz('UTC').format('YYYY-MM-DD'),
        time,
        location,
        participant,
        content,
      };
      await onAddEvent(eventData);
      if (onEventAdded) onEventAdded();
      clearFormFields();
      Alert.alert('Etkinlik başarıyla eklendi.');
      navigation.goBack()
    } catch (error) {
      console.error('Error adding event:', error);
      Alert.alert('Etkinlik eklenirken bir hata oluştu.');
    }
  };
  const clearFormFields = () => {
    setSelectedCategory(defaultCategoryId || null);
    setTitle('');
    setDate(new Date());
    setTime('');
    setLocation('');
    setParticipant('');
    setContent('');
  };

  const renderInputs = () => {
    switch (selectedCategory) {
      case 1:
        return (
          <>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Yer:</Text>
              <TextInput style={styles.input} value={location} onChangeText={setLocation} />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Katılımcı:</Text>
              <TextInput style={styles.input} value={participant} onChangeText={setParticipant} />
            </View>
          </>
        );
      case 2:
        return (
          <View style={styles.inputRow}>
            <Text style={styles.label}>Katılımcı:</Text>
            <TextInput style={styles.input} value={participant} onChangeText={setParticipant} />
          </View>
        );
      case 3:
      case 4:
      case 5:
      case 6:
        return (
          <View style={styles.inputRow}>
            <Text style={styles.label}>Yer:</Text>
            <TextInput style={styles.input} value={location} onChangeText={setLocation} />
          </View>
        );
      case 7:
      case 8:
        return (
          <View style={styles.inputRow}>
            <Text style={styles.label}>İçerik:</Text>
            <TextInput style={styles.input} value={content} onChangeText={setContent} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
        <View style={styles.modalContainer}>
          <Svg height="100%" width="100%" style={styles.topRightWave}>
        <Path
          d="M 0,100 Q 50,150 100,100 Q 150,50 200,100 Q 250,150 300,100"
          fill="transparent"
          stroke="rgba(71, 140, 207, 0.5)"
          strokeWidth="20"
        />
      </Svg>

      <Svg height="100%" width="100%" style={styles.bottomLeftWave}>
        <Path
          d="M 0,100 Q 50,150 100,100 Q 150,50 200,100 Q 250,150 300,100"
          fill="transparent"
          stroke="rgba(71, 140, 207, 0.5)"
          strokeWidth="20"
        />
      </Svg>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#478CCF" />
          </TouchableOpacity>
          <Text style={styles.title}>Etkinlik Ekle</Text>
          
          <View style={styles.picker}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Kategori Seçin" value={null} />
              {categories.map((category: Category) => (
                <Picker.Item key={category.category_id} label={category.category_name} value={category.category_id} />
              ))}
            </Picker>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Başlık:</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Tarih:</Text>
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.datePickerButtonText}>{date ? date.toLocaleDateString('tr-TR') : 'Tarih Seçiniz'}</Text>
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate ?? new Date());
              }}
            />
          )}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Saat:</Text>
            <TextInput style={styles.input} value={time} onChangeText={setTime} placeholder="HH:MM" />
          </View>
          {renderInputs()}
          <TouchableOpacity style={styles.applyButton} onPress={handleAddEvent}>
            <Text style={styles.applyButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  topRightWave: {
    position: 'absolute',
    top: -100,
    right: 50,
    width: 300,  
    height: 200,  
    transform: [{ rotate: '45deg' }],
  },
  bottomLeftWave: {
    position: 'absolute',
    bottom: -100,
    left: 50,
    width: 300,
    height: 200,
    transform: [{ rotate: '225deg' }],
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    color: '#03346E',
    fontWeight: 'bold',
    alignSelf:'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#03346E',
    marginRight: 15,
  },
  input: {
    height: 40,
    borderColor: '#7FA1C3',
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 8,
    width: '60%',
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#7FA1C3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 17,
  },
  datePickerButton: {
    padding: 10,
    width: '60%',
    textAlign: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#7FA1C3',
  },
  datePickerButtonText: {
    textAlign: 'center',
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 17,
  },
  applyButton: {
    backgroundColor: '#478CCF',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFF',
  },
});
