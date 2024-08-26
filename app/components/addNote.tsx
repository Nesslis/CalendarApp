import React, { useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ToastAndroid} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';

interface AddNoteModalProps {
  noteType: 'personal' | 'meeting';
  selectedEvent?: Event ;
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
  content: string;
}

export default function AddNote() {
  const { onAddNote, onSearchEvents, authState } = useAuth();
  const route = useRoute();
  const { noteType, selectedEvent } = route.params as AddNoteModalProps;
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [events, setEvents] = useState([]);
    const navigation = useNavigation();

      useEffect(() => {
        if (noteType === 'meeting') {
          fetchEvents();
        }
        if (selectedEvent) {
          setSelectedEventId(selectedEvent.event_id);
        }
        else {
          setSelectedEventId(null);
        }
      }, [noteType, selectedEvent]);
    
      const fetchEvents = async () => {
        if (authState?.authenticated) {
          try {
            if (!onSearchEvents) return;
            const eventsData = await onSearchEvents(1);
            setEvents(eventsData);
          } catch (error) {
            console.error('Error fetching events:', error);
          }
        }
      };
      const clearForm = () => {
        setTitle('');
        setContent('');
        setSelectedEventId(null);
      };
      
    
      const handleAddNote = async () => {
        try {
          if(noteType === 'meeting') { // toplantı notları 
             const  event_id= selectedEventId || undefined ;
          if(!onAddNote) return;
          await onAddNote(title, content, event_id);
          ToastAndroid.show('Not başarıyla eklendi!', ToastAndroid.SHORT);
          clearForm();
          navigation.goBack();
          } else {
            if(!onAddNote) return;
          await onAddNote(title, content);
          ToastAndroid.show('Not başarıyla eklendi!', ToastAndroid.SHORT);
          navigation.goBack();
          }
        
        } catch (error) {
          console.error('Error adding note:', error);
          Alert.alert('Hata', 'Not eklenirken bir hata oluştu.');
        }
      };

  return (
        <View style={styles.pageContainer}>
          <View style={styles.diagonalTop} />
          <View style={styles.diagonalBottom} />
          <View style={styles.diagonalBottom2} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style= {styles.container}>
            <Text style={styles.title} >Not ekle</Text>
          {noteType === 'meeting' && (
              <View style={styles.pickerItem}>
              <Picker
                selectedValue={selectedEventId}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedEventId(itemValue)}
              >
                {!selectedEventId && <Picker.Item label=" Toplantı Seç" value={null} />}
                  {selectedEvent && (
                    <Picker.Item label={selectedEvent.title} value={selectedEvent.event_id} />
                  )}
                {events.map((event: Event) => (
                  <Picker.Item key={event.event_id} label={event.title} value={event.event_id} />
                ))}
              </Picker></View>
          )}
            <Text style={styles.label}>Başlık:</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} maxLength={50} />
            <Text style={styles.label}>İçerik:</Text>
            <TextInput style={styles.contentInput} value={content} onChangeText={setContent}  maxLength={450} multiline />
          <TouchableOpacity style={styles.applyButton} onPress={handleAddNote}>
            <Text style={styles.applyButtonText}>Kaydet</Text>
          </TouchableOpacity>
          </View>
        </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 40,
  },
  container: {
    flex: 1,
    borderWidth:1,
    justifyContent: 'center',
    borderColor:'transparent',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    color: '#03346E',
    fontWeight: 'bold',
    alignSelf:'center',
    marginBottom: 20,
  },
  diagonalTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(71, 140, 207, 0.5)',
    transform: [{ skewY: '-10deg' }], 
  },
  diagonalBottom: {
    position: 'absolute',
    bottom: 18,
    left: -15,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(71, 140, 207, 0.2)',
    transform: [{ skewY: '-8deg' }], 
  },
  diagonalBottom2: {
    position: 'absolute',
    bottom: 50,
    left: -15,
    right: 0,
    height: 30,
    backgroundColor: '#478CCF',
    transform: [{ skewY: '10deg' }], 
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  contentInput: {
    height: 120,
    borderColor: '#7FA1C3',
    borderWidth: 1,
    paddingHorizontal: 8,
    fontSize: 16,
    borderRadius: 10,
    width: '100%',
    textAlignVertical: 'top',
    padding: 10,
  },
  label: {
    fontSize: 16,
    color: '#03346E',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    height: 40,
    borderColor: '#7FA1C3',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#7FA1C3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 17,
  },
  pickerItem: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#7FA1C3',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  applyButton: {
    backgroundColor: '#478CCF',
    padding: 12,
    borderRadius: 5,
    marginTop: 50,
    width: '100%',
    alignItems: 'center',
  },
  applyButtonText: {
    fontWeight:'bold',
    color: '#FFF',
  },
});
