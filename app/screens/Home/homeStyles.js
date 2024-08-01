import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      padding: 20,
    },
    greeting: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#03346E',
      marginTop: 20,
      marginBottom: 20,
    },
    weekContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
      marginTop: 20,
    },
    dayContainer: {
      alignItems: 'center',
    },
    dayText: {
      color: '#999',
    },
    dateText: {
      color: '#999',
    },
    selectedDay: {
      backgroundColor: '#478CCF',
      borderRadius: 20,
      width: 50,
      padding: 9,
    },
    selectedDayText: {
      color: '#FFF',
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#03346E',
      marginBottom: 20,
    },
    separator: {
      height: 1,
      marginVertical: 10,
      marginBottom: 55,
      borderBottomWidth: 2,
      borderBottomColor: '#2E236C',
    },
  
    eventTime: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#03346E',
    },
  
    eventBox: {
      backgroundColor: '#B6C7AA',
      padding: 10,
      borderRadius: 10,
      marginBottom: 15,
      height: 80,
    },
    eventTitle: {
      fontSize: 16,
      color: '#03346E',
      textAlign: 'center',
    },
    noEvents: {
      fontSize: 16,
      color: '#999',
    },
  });