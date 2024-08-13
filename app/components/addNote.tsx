import React, { useEffect, useState} from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Picker } from '@react-native-picker/picker';

interface AddNoteModalProps {
  visible: boolean;
  onClose: () => void;
  onNoteAdded ?: () => void;
  noteType: 'personal' | 'meeting';
}


export default function AddNoteModal({ visible, onClose, onNoteAdded, noteType }: AddNoteModalProps) {
  const { onAddNote, onSearchEvents, authState } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [events, setEvents] = useState([]);

      useEffect(() => {
        if (noteType === 'meeting') {
          fetchEvents();
        }
      }, [noteType]);
    
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
          Alert.alert('Başarılı', 'Not başarıyla eklendi!');
          clearForm();
          if (onNoteAdded) onNoteAdded();
          onClose();
          } else {
            if(!onAddNote) return;
          await onAddNote(title, content);
          Alert.alert('Başarılı', 'Not başarıyla eklendi!');
          if (onNoteAdded) onNoteAdded();
          onClose();
          }
        
        } catch (error) {
          console.error('Error adding note:', error);
          Alert.alert('Hata', 'Not eklenirken bir hata oluştu.');
        }
      };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={()=> {clearForm(); onClose();}} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#81A263" />
          </TouchableOpacity>
          {noteType === 'meeting' && (
            <View style={styles.inputRow}>
              <Text style={styles.label}>Toplantı Seç:</Text>
              <View style={styles.pickerItem}>
              <Picker
                selectedValue={selectedEventId}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedEventId(itemValue)}
              >
                <Picker.Item label="Toplantılarım" value={null}/>
                {events.map((event) => (
                  <Picker.Item key={event.event_id} label={event.title} value={event.event_id} />
                ))}
              </Picker></View>
            </View>
          )}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Başlık:</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>İçerik:</Text>
            <TextInput style={styles.input} value={content} onChangeText={setContent} />
          </View>
          <TouchableOpacity style={styles.applyButton} onPress={handleAddNote}>
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
    marginBottom: 15,
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
    width: '60%',
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
