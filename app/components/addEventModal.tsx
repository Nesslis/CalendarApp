import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import moment from 'moment-timezone';

interface Category {
  category_id: number;
  category_name: string;
}

interface AddEventModalProps {
  visible: boolean;
  onClose: () => void;
  defaultCategoryId?: number;
  onEventAdded ?: () => void;
}

export default function AddEventModal({ visible, onClose, defaultCategoryId, onEventAdded }: AddEventModalProps) {
  const { onGetEventCategories, onAddEvent } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(defaultCategoryId || null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [participant, setParticipant] = useState('');
  const [content, setContent] = useState('');

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

  const handleAddEvent = async () => {
    if (!selectedCategory || !title || !date || !time) {
      Alert.alert('Lütfen tüm gerekli alanları doldurun.');
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
      onClose();
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
            <View style={styles.inputRow}>
              <Text style={styles.label}>Notlar:</Text>
              <TextInput style={styles.input} value={content} onChangeText={setContent} />
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
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#81A263" />
          </TouchableOpacity>
          <View style={styles.inputRow}>
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
                if (selectedDate) setDate(selectedDate);
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#F5EDED',
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  label: {
    fontSize: 16,
    color: '#03346E',
  },
  input: {
    height: 40,
    borderColor: '#7FA1C3',
    borderWidth: 1,
    paddingHorizontal: 8,
    width: '60%',
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 2,
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
    marginBottom: 12,
  },
  applyButton: {
    backgroundColor: 'rgba(182, 199, 170, 1)',
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
