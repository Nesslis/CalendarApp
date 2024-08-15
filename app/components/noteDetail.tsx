import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, ToastAndroid } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Note {
  note_id: number;
  event_id?: number;
  user_id: number;
  title: string;
  content: string;
}

interface NoteDetailsModalProps {
  visible: boolean;
  note?: Note | null;
  notes?: Note[];
  onClose: () => void;
}

export default function NoteDetailsModal({ visible, note, notes, onClose }: NoteDetailsModalProps) {
  const { onDeleteNote, onEditNote } = useAuth();
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(note);

  useEffect(() => {
    if (notes) {
      setCurrentNoteIndex(0);
      setCurrentNote(notes[0]);
    }
  }, [notes]);

  useEffect(() => {
    if (note) {
      setCurrentNote(note);
    }
  }, [note]);

  const handleSave = async () => {
    try {
      if (currentNote) {
        await onEditNote(currentNote.note_id, currentNote.title, currentNote.content);
        setEditMode(false);
        ToastAndroid.show('Not güncellendi!', ToastAndroid.SHORT);
        onClose();
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
      onClose();
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
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.icons}>
              <TouchableOpacity style={styles.editIconContainer} onPress={handleEdit}>
                <Icon name="pencil" size={22} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
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
            <TextInput 
              style={styles.modalText} 
              value={currentNote.content || ''} 
              onChangeText={(text) => handleChange('content', text)} 
              multiline 
            />
          ) : (
            <Text style={styles.modalText}>{currentNote.content}</Text>
          )}
          {notes && notes.length > 1 && (
    <TouchableOpacity onPress={handleNextNote} style={styles.arrowContainer}>
      <Ionicons name="arrow-forward-outline" size={24} color="black" />
    </TouchableOpacity>
  )}
</View>
          {editMode ? (
            <View style={styles.editButtons}>
              <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseButtonText}>Kapat</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.modalSaveButton}>
                <Text style={styles.modalSaveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  editIconContainer: {
    marginRight: 10,
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  separator: {
    flex: 1,
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
    backgroundColor: '#7FA1C3',
    padding: 10,
    borderRadius: 5,
    marginTop: 30,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowContainer: {
    padding: 10,
  },
});
