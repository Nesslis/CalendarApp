import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FloatingAction } from "react-native-floating-action";
import { Picker } from '@react-native-picker/picker';


interface Event {
  event_id: number;
  user_id: number;
  category_id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  participant: string | null;
  created_at: string;
  updated_at: string;
  content: string | null;
}

const actions = [
  {
    text: "Etkinlik Ekle",
    name: "bt_accessibility",
    position: 2
  }
];

interface Category {
  category_id: number;
  category_name: string;
}

export default function EventsPage() {
  const { onSearchEvents, onGetEventCategories, authState } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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

  const fetchEvents = async () => {
    if (authState?.authenticated) {
      try {
        if (!onSearchEvents) return;
        const startDateString = startDate ? startDate.toISOString().split('T')[0] : '';
        const endDateString = endDate ? endDate.toISOString().split('T')[0] : '';
        const eventsData = await onSearchEvents(selectedCategory, startDateString, endDateString);
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [authState, selectedCategory, startDate, endDate]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#03346E" />
      </View>
    );
  }

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleApplyFilters = (category: number | undefined, startDate: Date | undefined, endDate: Date | undefined) => {
    setSelectedCategory(category);
    setStartDate(startDate);
    setEndDate(endDate);
    setShowFilterModal(false);
    setLoading(true);
    fetchEvents();
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity style={styles.eventRow} onPress={() => handleEventPress(item)}>
      <Text style={styles.eventText}>{item.title || '-'}</Text>
      <Text style={styles.eventText}>{item.date ? new Date(item.date).toLocaleDateString('tr-TR') : '-'}</Text>
      <Text style={styles.eventText}>{item.time ? new Date(`1970-01-01T${item.time}Z`).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterIconContainer}
        onPress={() => setShowFilterModal(true)}
      >
        <Icon name="filter" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.welcomeText}>Etkinliklerim</Text>
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
      {selectedEvent && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={!!selectedEvent}
          onRequestClose={() => setSelectedEvent(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.editIconContainer} onPress={() => console.log('Edit Event')}>
                <Icon name="pencil" size={20} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
              <View style={styles.modalSeparator} />
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Tarih:</Text>
                <Text style={styles.modalText}>{selectedEvent.date ? new Date(selectedEvent.date).toLocaleDateString('tr-TR') : '-'}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Saat:</Text>
                <Text style={styles.modalText}>{selectedEvent.time ? new Date(`1970-01-01T${selectedEvent.time}Z`).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-'}</Text>
              </View>
              {selectedEvent.location && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Yer:</Text>
                  <Text style={styles.modalText}>{selectedEvent.location}</Text>
                </View>
              )}
              {selectedEvent.participant && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Katılımcı:</Text>
                  <Text style={styles.modalText}>{selectedEvent.participant}</Text>
                </View>
              )}
              {selectedEvent.content && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Notlar:</Text>
                  <Text style={styles.modalText}>{selectedEvent.content}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedEvent(null)}>
                <Text style={styles.closeButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
      <FloatingAction
      color='#478CCF'
    actions={actions}
    onPressItem={name => {
      console.log(`selected button: ${name}`);
    }}
  />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  filterIconContainer: {
    position: 'absolute',
    top: 43,
    right: 30,
    zIndex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03346E',
    marginBottom: 30,
    marginTop: 20,
    textAlign: 'left',
  },
  eventsBox: {
    backgroundColor: 'rgba(182, 199, 170, 0.5)',
    borderRadius: 10,
    padding: 20,
    marginTop: 30,
    maxWidth:450,
    maxHeight: 450,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#7FA1C3',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#03346E',
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#7FA1C3',
  },
  eventText: {
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#03346E',
    marginBottom: 10,
  },
  modalSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#7FA1C3',
    marginVertical: 10,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalLabel: {
    fontWeight: 'bold',
    color: '#03346E',
  },
  modalText: {
    color: '#333',
  },
  datePickerButton: {
    backgroundColor: '#EEE',
    padding: 10,
    borderRadius: 5,
  },
  datePickerButtonText: {
    color: '#333',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  pickerContainer: {
    marginVertical: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#03346E',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  applyButton: {
    backgroundColor: 'rgba(182, 199, 170, 1)',
    padding: 12,
    borderRadius: 5,
  },
  applyButtonText: {
    color: '#FFF',
  },
  clearButton: {
    backgroundColor: '#999',
    padding: 12,
    borderRadius: 5,
  },
  clearButtonText: {
    color: '#FFF',
  },
  closeButton: {
    backgroundColor: '#C80036',
    padding: 12,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFF',
    textAlign: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalCloseButton: {
    marginTop: 30,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(182, 199, 170, 1)',
  },
});