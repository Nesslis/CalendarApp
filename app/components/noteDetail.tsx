import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';

interface Note {
  note_id: number;
  event_id?: number;
  user_id: number;
  title: string;
  content: string;
}

interface NoteDetailsModalProps {
  visible: boolean;
  note: Note | null;
  onClose: () => void;
}

export default function NoteDetailsModal({ visible, note, onClose }: NoteDetailsModalProps) {
  const { onDeleteNote } = useAuth();
  if (!note) return null;

  const handleDelete = async () => {
    try {
      if(!onDeleteNote) return;
      await onDeleteNote(note.note_id); 
      Alert.alert("Not başarı ile silindi.");
      onClose(); 
    } catch (error) {
      console.error('Not silinirken hata oluştu:', error);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.modalTitle}>{note.title}</Text>
          <TouchableOpacity onPress={handleDelete}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
            </View>
          <View style={styles.separator} />
          <Text style={styles.modalText}>{note.content}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
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
    marginBottom: 10,
  },
  modalContent: {
    width: '80%',
    height: 350,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  separator: {
    height: 1,
    marginVertical: 10,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#2E236C',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#7FA1C3',
    padding: 10,
    borderRadius: 5,
    marginTop: 135,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
