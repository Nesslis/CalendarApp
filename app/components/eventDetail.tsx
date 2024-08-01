import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';

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
  if (!event) return null;

  const renderDetail = () => {
    switch (event.category_id) {
      case 1: // Toplantı
        return (
          <>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Katılımcı:</Text>
              <Text style={styles.modalText}>{event.participant}</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Yer:</Text>
              <Text style={styles.modalText}>{event.location}</Text>
            </View>
          </>
        );
      case 2: // Ziyaretçi
        return (
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Kişi:</Text>
            <Text style={styles.modalText}>{event.participant}</Text>
          </View>
        );
      case 3: // Denetim
      case 4: // Tören
      case 5: // Basın Toplantısı
      case 6: // Seminer
        return (
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Yer:</Text>
            <Text style={styles.modalText}>{event.location}</Text>
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

  const formatTime = (time: string) => {
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
          <TouchableOpacity style={styles.editIconContainer} onPress={() => console.log('Edit Event')}>
            <Icon name="pencil" size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{event.title}</Text>
          <View style={styles.modalSeparator} />
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Tarih:</Text>
            <Text style={styles.modalText}>{formatDate(event.date)}</Text>
          </View>
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Saat:</Text>
            <Text style={styles.modalText}>{formatTime(event.time)}</Text>
          </View>
          {event.content && (
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>İçerik:</Text>
              <Text style={styles.modalText}>{event.content}</Text>
            </View>
          )}
          {renderDetail()}
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
  