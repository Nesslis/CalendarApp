import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ToastAndroid } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import React, { useEffect, useState } from 'react';
import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

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
interface Note {
  note_id: number;
  event_id?: number;
  user_id: number;
  title: string;
  content: string;
}
interface EventProps {
  event: Event | null ;
  navigation: NavigationProp<ParamListBase>;
}

export default function EventDetail()  {
  const { onEditEvent, onDeleteEvent, onFetchEventNotes } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const route = useRoute();
  const { event } = route.params as EventProps;
  const navigation = useNavigation();
  const [editedEvent, setEditedEvent] = useState(event);
  useEffect(() => {
    if (event?.category_id === 1) {
      fetchNotes();
    }
  }, [event]);

  const fetchNotes = async () => {
    if (!event) return;
    try {
      if(!onFetchEventNotes) return;
      const notesData = await onFetchEventNotes(event.event_id);
      setNotes(notesData);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };
  const handleNoteIconPress = () => {
    if (notes.length > 0) {
      navigation.navigate('NoteDetail', {notes})
    }
  };

  const renderNotesIcon = () => {
    if (notes.length === 0) {
      return (
        <TouchableOpacity >
          <Icon name="minus" size={20} color="#03346E" />
        </TouchableOpacity>
      );
    } else if (notes.length === 1) {
      return (
        <TouchableOpacity onPress={handleNoteIconPress}>
           <Ionicons name="document-text-outline" size={24} color="#03346E" />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={handleNoteIconPress}>
          <Ionicons name="documents-outline" size={24} color="#03346E" />
        </TouchableOpacity>
      );
    }
  };
  
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
      ToastAndroid.show('Etkinlik başarıyla güncellendi', ToastAndroid.SHORT);
      navigation.goBack();
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
      ToastAndroid.show('Etkinlik başarıyla silindi', ToastAndroid.SHORT)
      navigation.goBack();
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

  const openAddNotePage = () => {
    navigation.navigate('AddNote', { noteType:  'meeting', selectedEvent: event });
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
          {isEditMode ? (
            <TextInput
              style={[styles.modalInput, { fontSize: 20, fontWeight: 'bold' }]}
              value={editedEvent?.title || ''}
              onChangeText={(text) => handleChange('title', text)}
            />
          ) : (
            <Text style={styles.modalTitle}>{event.title}</Text>
          )}
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
          {event.category_id === 1 && (
            <>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Toplantı Notları:</Text>
                {renderNotesIcon()}
              </View>
                <TouchableOpacity style={styles.addNoteButton} onPress={openAddNotePage}>
                  <Text style={styles.addNoteButtonText}>Not Ekle</Text>
                </TouchableOpacity>
            </>
          )}
          {isEditMode && (
            <TouchableOpacity style={styles.modalSaveButton} onPress={handleSave}>
            <Text style={styles.modalSaveButtonText}>Kaydet</Text>
          </TouchableOpacity>
          )}
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
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#03346E',
      marginBottom: 10,
    },
    backButton: {
      position: 'absolute',
      top: 40,
      left: 20,
      zIndex: 10,
    },
    modalSeparator: {
      borderBottomWidth: 2,
      borderBottomColor: '#7FA1C3',
      marginVertical: 10,
      marginBottom: 35,
    },
    modalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 17,
    },
    modalLabel: {
      fontSize: 16,
      color: '#03346E',
      marginRight: 15,
    },
    modalText: {
      color: '#333',
    },
    modalButtonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    editIconContainer: {
      position: 'absolute',
      top: 40,
      right: 80,
      zIndex: 1,
    },
    deleteIconContainer: {
      position: 'absolute',
      top: 40,
      right: 30,
      zIndex: 1,
    },
    addNoteButton: {
      marginTop: 30,
      padding: 10,
      borderRadius: 10,
      backgroundColor: '#478CCF',
    },
    addNoteButtonText: {
      color: '#FFF',
      fontSize: 18,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    modalSaveButton: {
      marginTop: 30,
      padding: 10,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#03346E',
    },
    modalSaveButtonText: {
      color: '#03346E',
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    modalInput: {
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
  });
  