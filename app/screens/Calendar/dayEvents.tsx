import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type DayEventsPageProps = {
  navigation: NavigationProp<ParamListBase>;
};

export default function DayEventsPage({ navigation }: DayEventsPageProps) {
    const route = useRoute();
  const { selectedDate, events } = route.params;
  const dateObject = new Date(selectedDate);
  const formattedDate = dateObject.toLocaleDateString();

  const filteredEvents = events.filter(event => new Date(event.date).toDateString() === new Date(selectedDate).toDateString());

  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === dateObject.toDateString();
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#ECEFEF', padding: 16 }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name='arrow-back' size={28} color='#81A263 ' />
      </TouchableOpacity>
      
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#03346E', marginVertical: 16 }}>
        {formattedDate}
      </Text>

      {dayEvents.length > 0 ? (
        dayEvents.map((event, index) => (
          <View key={index} style={{ padding: 16, backgroundColor: '#C6EBC5', marginBottom: 16, borderRadius: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#03346E' }}>{event.title}</Text>
            <Text style={{ color: '#03346E' }}>{event.time}</Text>
            <Text style={{ color: '#03346E' }}>{event.location}</Text>
          </View>
        ))
      ) : (
        <Text style={{ color: '#03346E' }}>Bu tarihte etkinlik bulunmamaktadır.</Text>
      )}
    </View>
  );
}