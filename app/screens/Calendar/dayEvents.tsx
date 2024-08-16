import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { NavigationProp, ParamListBase, RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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

type DayEventsPageProps = {
  navigation: NavigationProp<ParamListBase>;
};
type RootStackParamList = {
  Days: { selectedDate: string; events: Event[] };
};

type DayEventsPageRouteProp = RouteProp<RootStackParamList, 'Days'>;

const timeslots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

export default function DayEventsPage({ navigation }: DayEventsPageProps) {
  const route = useRoute<DayEventsPageRouteProp>();
  const { selectedDate, events } = route.params;
  const dateObject = new Date(selectedDate);
  const formattedDate = dateObject.toLocaleDateString();

  const filteredEvents = events.filter(event => new Date(event.date).toDateString() === new Date(selectedDate).toDateString());

  const handleAddEvent = () => {
    navigation.navigate('AddEvent', { selectedDate: selectedDate });
  };
  const handleEventPress = (event: Event) => {
    navigation.navigate('EventDetail', {event})
  };

  return (
    <View style={styles.container}>
         <View style={styles.header}>
           <View style={styles.backButtonContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
               <Ionicons name='arrow-back' size={28} color='#81A263 ' />
              </TouchableOpacity>
            </View>
           <Text style={styles.dateText}>{formattedDate}</Text>
           <View style={styles.emptySpace} />
         </View>
         <View style={styles.separator} />
      <ScrollView style={styles.scrollView}>
        {filteredEvents.length > 0 ? (
          timeslots.map((timeslot, index) => {
            const slotEvents = filteredEvents.filter(event => event.time.startsWith(timeslot.split(':')[0]));
            return (
              <View key={index} style={styles.timeslot}>
                <Text style={styles.timeslotText}>{timeslot}</Text>
                { 
                  slotEvents.map((event, eventIndex) => (
                    <TouchableOpacity key={eventIndex} onPress={() => handleEventPress(event)}>
                    <View  style={styles.eventContainer}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <Text style={styles.eventTime}>{formatTime(event.time)}</Text>
                      <Text style={styles.eventLocation}>{event.location}</Text>
                    </View>
                    </TouchableOpacity>
                  ))
                }
              </View>
            );
          })
        ) : (
          <Text style={styles.noEventsText}>Bu tarihte etkinlik bulunmamaktadır.</Text>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={handleAddEvent}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
  backButtonContainer: {
    flex: 1,
  },
  emptySpace: {
    flex: 1,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#03346E',
    textAlign: 'center',
    flex: 1,
  },
  separator: {
    height: 2,
    backgroundColor: '#2E236C',
    marginTop: 4,
    borderRadius: 1,
    marginLeft: 0,
    marginRight: 16,
  },
  scrollView: {
    flex: 1,
  },
  timeslot: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
    borderStyle: 'dashed',
  },
  timeslotText: {
    fontSize: 16,
    fontWeight: 'regular',
    color: '#03346E',
  },
  eventContainer: {
    padding: 16,
    backgroundColor: 'rgba(182, 199, 170, 0.5)',
    marginBottom: 8,
    borderRadius: 8,
    width: '80%',
    marginLeft: '15%',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#03346E',
  },
  eventTime: {
    color: '#03346E',
  },
  eventLocation: {
    color: '#03346E',
  },
  noEventText: {
    color: '#03346E',
    fontStyle: 'italic',
  },
  noEventsText: {
    color: '#03346E',
    textAlign: 'center',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    backgroundColor: '#81A263',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});