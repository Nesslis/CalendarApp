import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import NoteDetailsModal from '../../components/noteDetail';
import AddNoteModal from '../../components/addNote';

interface Note {
  note_id: number;
  event_id?: number | null;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function NotesPage() {
  const { onGetNotes } = useAuth();
  const [personalNotes, setPersonalNotes] = useState<Note[]>([]);
  const [meetingNotes, setMeetingNotes] = useState<Note[]>([]);
  const [selectedTab, setSelectedTab] = useState<'personal' | 'meeting'>('personal');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addNoteModalVisible, setAddNoteModalVisible] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [selectedTab]);

  const openNoteModal = (note: Note) => {
    setSelectedNote(note);
    setModalVisible(true);
  };

  const fetchNotes = async () => {
    if (!onGetNotes) return;
    const { personalNotes, meetingNotes } = await onGetNotes();
    setPersonalNotes(personalNotes);
    setMeetingNotes(meetingNotes);
  };

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity style={styles.noteCard} onPress={() => openNoteModal(item)}>
      <Text style={styles.noteText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'personal' && styles.activeTab]}
          onPress={() => setSelectedTab('personal')}
        >
          <Text style={styles.tabText}>Kişisel Notlar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'meeting' && styles.activeTab]}
          onPress={() => setSelectedTab('meeting')}
        >
          <Text style={styles.tabText}>Toplantı Notları</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={selectedTab === 'personal' ? personalNotes : meetingNotes}
        renderItem={renderNote}
        keyExtractor={(item) => item.note_id.toString()}
        numColumns={2}
      />
      <AddNoteModal visible={addNoteModalVisible} onClose={()=> setAddNoteModalVisible(false)} onNoteAdded={() => fetchNotes}  />
      <TouchableOpacity style={styles.addButton} onPress={() => setAddNoteModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <NoteDetailsModal
        visible={modalVisible}
        note={selectedNote}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    padding: 12,
    marginTop: 15,
  },
  tab: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  activeTab: {
    backgroundColor: '#7FA1C3',
  },
  tabText: {
    color: '#000',
  },
  noteCard: {
    backgroundColor: '#B5CFB7',
    padding: 30,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 20,
    margin: 5,
    flex: 1,
  },
  noteText: {
    color: '#000',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#7FA1C3',
    width: 55,
    height: 55,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 26,
  },
  
});
