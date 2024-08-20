import React, { useState, useEffect } from 'react';
import {  View, Text, StyleSheet, TouchableOpacity, TextInput, ToastAndroid } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'native-base';
import { NavigationProp, ParamListBase, useRoute } from '@react-navigation/native';

interface Note {
  note_id: number;
  event_id?: number;
  user_id: number;
  title: string;
  content: string;
}

interface NoteDetailsModalProps {
      note?: Note | null;
      notes?: Note[];
  navigation: NavigationProp<ParamListBase>;
}

export default function NoteDetail({ navigation }: NoteDetailsModalProps) {
  const route = useRoute();
  const {note, notes} = route.params as NoteDetailsModalProps;
  const { onDeleteNote, onEditNote } = useAuth();
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null | undefined>(note);

  useEffect(() => {
    if (notes) {
      setCurrentNoteIndex(0);
      setCurrentNote(notes[0]);
    }
  }, [notes]);

  useEffect(() => {
    if (note) {
      console.log(note);
      setCurrentNote(note);
    }
  }, [note]);

  const handleSave = async () => {
    try {
      if (currentNote) {
        await onEditNote(currentNote.note_id, currentNote.title, currentNote.content);
        setEditMode(false);
        ToastAndroid.show('Not güncellendi!', ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Failed to edit note: ', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!onDeleteNote || !currentNote) return;
      await onDeleteNote(currentNote.note_id); 
      ToastAndroid.show('Not başarı ile silindi', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      console.error('Not silinirken hata oluştu:', error);
    }
  };

  const handleNextNote = () => {
    if (notes) {
      const nextIndex = (currentNoteIndex + 1) % notes.length;
      setCurrentNoteIndex(nextIndex);
      setCurrentNote(notes[nextIndex]);
    }
  };

  const handlePrevNote = () => {
    if (notes) {
      const prevIndex = (currentNoteIndex - 1 + notes.length) % notes.length;
      setCurrentNoteIndex(prevIndex);
      setCurrentNote(notes[prevIndex]);
    }
  };

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleChange = (field: 'title' | 'content', value: string) => {
    setCurrentNote(prevNote => {
      if (prevNote) {
        return { ...prevNote, [field]: value };
      }
      return prevNote;
    });
  };

  if (!currentNote) return null;

  return (
      <View style={styles.modalContainer}>
        <View style={styles.diagonalTop} />
        <View style={styles.diagonalBottom} />
        <View style={styles.diagonalBottom2} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.icons}>
              <TouchableOpacity style={styles.editIconContainer} onPress={handleEdit}>
                <Icon name="pencil" size={22} color="#2E236C" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
            <View style= {styles.container}>
            <View style={styles.header}>
            {editMode ? (
              <TextInput 
                style={styles.modalTitle} 
                value={currentNote.title || ''} 
                onChangeText={(text) => handleChange('title', text)} 
                maxLength={50}
                multiline
              />
            ) : (
              <Text style={styles.modalTitle}>{currentNote.title}</Text>
            )}
            
          </View>
          <View style={styles.separator} />

          <View style={styles.contentContainer}>
         {notes && notes.length > 1 && (
            <TouchableOpacity onPress={handlePrevNote} style={styles.arrowContainer}>
                <Ionicons name="arrow-back-outline" size={24} color="black" />
            </TouchableOpacity>
          )}
          {editMode ? (
            <ScrollView>
            <TextInput 
              style={styles.modalText} 
              value={currentNote.content || ''} 
              onChangeText={(text) => handleChange('content', text)} 
              maxLength={250}
              multiline 
            />
            </ScrollView>
          ) : (
            <ScrollView>
            <Text style={styles.modalText}>{currentNote.content}</Text>
            </ScrollView>
          )}
          {notes && notes.length > 1 && (
           <TouchableOpacity onPress={handleNextNote} style={styles.arrowContainer}>
             <Ionicons name="arrow-forward-outline" size={24} color="black" />
           </TouchableOpacity>
           )}
          </View>
          {editMode ? (
            <View style={styles.editButtons}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseButtonText}>Kapat</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.modalSaveButton}>
                <Text style={styles.modalSaveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => navigation.goBack()}  style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 40,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
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
    marginBottom: 25,
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
  icons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
    marginBottom: 20,
  },
  editIconContainer: {
    marginRight: 10,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  separator: {
    height: 1,
    marginVertical: 10,
    marginBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: '#2E236C',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
    flex: 1,
    textAlign:'center',
  },
  modalText: {
    flex: 1,
    fontSize: 16,
    marginBottom: 20,
    textAlign:'center',
  },
  closeButton: {
    backgroundColor: '#478CCF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalCloseButton: {
    marginTop: 30,
    padding: 10,
    borderRadius: 10,
    width: 120,
    backgroundColor: 'rgba(182, 199, 170, 1)',
    alignItems:'center',
  },
  modalSaveButton: {
    marginTop: 30,
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    width: 120,
    borderColor: 'rgba(182, 199, 170, 1)',
    alignItems:'center',
  },
  modalSaveButtonText: {
    color: 'rgba(182, 199, 170, 1)',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    maxHeight: '70%',
  },
  arrowContainer: {
    padding: 10,
  },
});
