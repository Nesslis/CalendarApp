import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      padding: 20,
    },
    welcomeText: {
      fontSize: 24,
      color: '#03346E',
      textAlign: 'left',
      fontWeight: 'bold',
      marginBottom: 60,
      marginTop: 40,
    },
    dateContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      alignItems: 'center',
    },
    dateButton: {
      padding: 10,
      borderRadius: 20,
      width:125,
      backgroundColor: 'transparent',
      borderColor: '#478CCF',
      borderWidth: 1,
      marginHorizontal: 5,
    },
    dateButtonText: {
      color: '#7FA1C3',
    },
    clearButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#C80036',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 5,
    },
    applyButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#81A263',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 5,
    },
    eventsBox: {
      backgroundColor: 'rgba(182, 199, 170, 0.5)',
      borderRadius: 10,
      padding: 20,
      width: 350,
      height: 370,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#7FA1C3',
    },
    headerText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#03346E',
      textAlign: 'center',
      flex: 1,
    },
    eventRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#7FA1C3',
    },
    eventText: {
      fontSize: 14,
      color: '#03346E',
      textAlign: 'center',
      flex: 1,
    },
    modalContainer: {
      flex: 1,
      height:350,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      height:350,
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 15,
    },
    modalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 5,
      marginBottom:12,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalSeparator: {
      borderBottomColor: '#7FA1C3', 
      borderBottomWidth: 1, 
      marginVertical: 10, 
    },
    modalLabel: {
      fontWeight: 'bold', 
    },
    modalText: {
      marginLeft: 10,
    },
    closeButton: {
      marginTop: 30,
      padding: 10,
      borderRadius: 10,
      backgroundColor: 'rgba(182, 199, 170, 1)',
    },
    closeButtonText: {
      color: '#fff',
      textAlign: 'center',
    },
  });
  