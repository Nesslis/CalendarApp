import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Alert } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../context/AuthContext';
import React, { useState } from 'react';

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

interface EventDetailProps {
  event: Event | null;
  onClose: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onClose }) => {
  const { onEditEvent, onDeleteEvent } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedEvent, setEditedEvent] = useState(event);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const handleEdit = () => {
    setIsEditMode(prevMode => !prevMode);
  };

  const handleSave = async () => {
    if (!event || !onEditEvent || !editedEvent) return;

    try {
      await onEditEvent(event.event_id, {
        title: editedEvent.title,
        date: editedEvent.date,
        time: editedEvent.time,
        location: editedEvent.location,
        participant: editedEvent.participant,
        content: editedEvent.content,
        category_id: editedEvent.category_id,
      });
      setIsEditMode(false);
      Alert.alert('Etkinlik başarıyla güncellendi');
      onClose();
    } catch (error) {
      console.error('Failed to edit event:', error);
    }
  };
  const handleChange = (field: keyof Event, value: string) => {
    if (!editedEvent) return;
    setEditedEvent({ ...editedEvent, [field]: value });
  };
  const handleDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (selectedDate) {
      setShowDatePicker(false);
      handleChange('date', selectedDate.toISOString());
    }
  };
  const handleDelete = async() => {
    if(!event || !onDeleteEvent) return;
    try{
      await onDeleteEvent(event.event_id);
      Alert.alert('Etkinlik başarıyla silindi');
      onClose();
    }catch(error) {
      console.error('Failed to delete event ', error)
    }
  }

  if (!event) return null;

  const renderDetail = () => {
    switch (event.category_id) {
      case 1: // Toplantı
        return (
          <>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Katılımcı:</Text>
              {isEditMode ? (
                <TextInput
                  style={styles.modalInput}
                  value={editedEvent?.participant || ''}
                  onChangeText={(text) => handleChange('participant', text)}
                />
              ) : (
                <Text style={styles.modalText}>{event.participant}</Text>
              )}
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Yer:</Text>
               {isEditMode ? (
                <TextInput
                  style={styles.modalInput}
                  value={editedEvent?.location || ''}
                  onChangeText={(text) => handleChange('location', text)}
                />
              ) : (
                <Text style={styles.modalText}>{event.location}</Text>
              )}
            </View>
          </>
        );
      case 2: // Ziyaretçi
        return (
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Kişi:</Text>
            {isEditMode ? (
              <TextInput
                style={styles.modalInput}
                value={editedEvent?.participant || ''}
                onChangeText={(text) => handleChange('participant', text)}
              />
            ) : (
              <Text style={styles.modalText}>{event.participant}</Text>
            )}
          </View>
        );
      case 3: // Denetim
      case 4: // Tören
      case 5: // Basın Toplantısı
      case 6: // Seminer
        return (
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Yer:</Text>
            {isEditMode ? (
              <TextInput
                style={styles.modalInput}
                value={editedEvent?.location || ''}
                onChangeText={(text) => handleChange('location', text)}
              />
            ) : (
              <Text style={styles.modalText}>{event.location}</Text>
            )}
          </View>
        );
      case 7: // Rapor Analizi
        return null;
      case 8: // Diğer
        return null;
      default:
        return null;
    }
  };

  const formatTime = (time: string ) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={!!event}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.editIconContainer} onPress={handleEdit}>
            <Icon name="pencil" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.deleteIconContainer}
              onPress={() =>
                Alert.alert('Sil', 'Bu etkinliği silmek istediğinizden emin misiniz?', [
                  { text: 'Hayır' },
                  { text: 'Evet', onPress: handleDelete }
                ])
              }
            >
              <Icon name="trash" size={22} color="red" />
            </TouchableOpacity>
          <Text style={styles.modalTitle}>
          {isEditMode ? (
            <TextInput
              style={styles.modalInput}
              value={editedEvent?.title || ''}
              onChangeText={(text) => handleChange('title', text)}
            />
          ) : (
            event.title
          )}
          </Text>
          <View style={styles.modalSeparator} />
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Tarih:</Text>
            {isEditMode ? (
              <>
                <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.datePickerButtonText}>
                    {editedEvent?.date ? formatDate(editedEvent.date) : 'Tarih Seçiniz'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={new Date(editedEvent?.date || '')}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </>
            ) : (
              <Text style={styles.modalText}>{formatDate(event.date)}</Text>
            )}
          </View>
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Saat:</Text>
            {isEditMode ? (
              <TextInput
                style={styles.modalInput}
                value={editedEvent?.time || ''}
                onChangeText={(text) => handleChange('time', formatTime(text))}
              />
            ) : (
              <Text style={styles.modalText}>{formatTime(event.time)}</Text>
            )}
          </View>
          {event.content && (
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>İçerik:</Text>
              {isEditMode ? (
                <TextInput
                  style={styles.modalInput}
                  value={editedEvent?.content || ''}
                  onChangeText={(text) => handleChange('content', text)}
                />
              ) : (
                <Text style={styles.modalText}>{event.content}</Text>
              )}
            </View>
          )}
          {renderDetail()}
          {isEditMode && (
            <TouchableOpacity style={styles.modalSaveButton} onPress={handleSave}>
            <Text style={styles.modalSaveButtonText}>Kaydet</Text>
          </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EventDetail;
const styles = StyleSheet.create({
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
      position: 'relative',
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
    modalButtonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    closeButtonText: {
      color: '#FFF',
      fontSize: 18,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    editIconContainer: {
      position: 'absolute',
      top: 20,
      right: 60,
      zIndex: 1,
    },
    deleteIconContainer: {
      position: 'absolute',
      top: 20,
      right: 20,
      zIndex: 1,
    },
    modalCloseButton: {
      marginTop: 30,
      padding: 10,
      borderRadius: 10,
      backgroundColor: 'rgba(182, 199, 170, 1)',
    },
    modalSaveButton: {
      marginTop: 30,
      padding: 10,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: 'rgba(182, 199, 170, 1)',
    },
    modalSaveButtonText: {
      color: 'rgba(182, 199, 170, 1)',
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    modalInput: {
      borderBottomWidth: 1,
      borderBottomColor: '#7FA1C3',
      padding: 5,
      color: '#333',
      width: '80%',
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
  });
  