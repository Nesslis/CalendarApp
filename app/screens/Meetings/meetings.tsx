import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FloatingAction } from "react-native-floating-action";

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
  location: string;
  participant: string | null;
  created_at: string;
  updated_at: string;
  content: string | null;
}


export default function MeetingsPage() {
  const { onSearchEvents, authState } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);


  const fetchEvents = async () => {
    if (authState?.authenticated) {
      try {
        if (!onSearchEvents) return;
        const startDateString = startDate ? startDate.toISOString().split('T')[0] : '';
        const endDateString = endDate ? endDate.toISOString().split('T')[0] : '';
        const eventsData = await onSearchEvents(1, startDateString, endDateString);
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [startDate, endDate]);

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

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity style={styles.eventRow} onPress={() => handleEventPress(item)}>
      <Text style={styles.eventText}>{item.title || '-'}</Text>
      <Text style={styles.eventText}>{item.date ? new Date(item.date).toLocaleDateString('tr-TR') : '-'}</Text>
      <Text style={styles.eventText}>{item.time ? new Date(`1970-01-01T${item.time}Z`).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-'}</Text>
    </TouchableOpacity>
  );

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
      {selectedEvent && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={!!selectedEvent}
          onRequestClose={() => setSelectedEvent(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
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
        <View style={styles.modalRow}>
          <Text style={styles.modalLabel}>Yer:</Text>
          <Text style={styles.modalText}>{selectedEvent.location || '-'}</Text>
        </View>
        <View style={styles.modalRow}>
          <Text style={styles.modalLabel}>Katılımcı:</Text>
          <Text style={styles.modalText}>{selectedEvent.participant || '-'}</Text>
        </View>
        <View style={styles.modalSeparator} />
          <Text style={styles.modalLabel}>Notlar:</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedEvent(null)}>
                <Text style={styles.closeButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    color: '#03346E',
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: 60,
    marginTop: 40,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },
  dateButton: {
    padding: 10,
    borderRadius: 20,
    width:125,
    backgroundColor: 'transparent',
    borderColor: '#7FA1C3',
    borderWidth: 1,
    marginHorizontal: 5,
  },
  dateButtonText: {
    color: '#7FA1C3',
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#C80036',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  applyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#81A263',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  eventsBox: {
    backgroundColor: 'rgba(182, 199, 170, 0.5)',
    borderRadius: 10,
    padding: 20,
    maxWidth:450,
    maxHeight: 450,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#7FA1C3',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#03346E',
    textAlign: 'center',
    flex: 1,
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#7FA1C3',
  },
  eventText: {
    fontSize: 14,
    color: '#03346E',
    textAlign: 'center',
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    height:350,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    height:350,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginBottom:12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSeparator: {
    borderBottomColor: '#7FA1C3', 
    borderBottomWidth: 1, 
    marginVertical: 10, 
  },
  modalLabel: {
    fontWeight: 'bold', 
  },
  modalText: {
    marginLeft: 10,
  },
  closeButton: {
    marginTop: 30,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(182, 199, 170, 1)',
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
