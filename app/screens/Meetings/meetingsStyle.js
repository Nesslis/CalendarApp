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
      marginTop: 20,
    },
    filterIcon: {
      position: 'absolute',
       top: 43,
       right: 30,
       zIndex: 1,
    },
    modalContainer2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent2: {
      width: '80%',
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
    },
    modalRow2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  datePickerButton: {
    backgroundColor: '#EEE',
    padding: 10,
    width: 130,
    textAlign: 'center',
    borderRadius: 5,
  },
  datePickerButtonText: {
    color: '#333',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  pickerContainer: {
    marginVertical: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#03346E',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  applyButton2: {
    backgroundColor: 'rgba(182, 199, 170, 1)',
    padding: 12,
    borderRadius: 5,
  },
  applyButtonText: {
    color: '#FFF',
  },
  clearButton: {
    backgroundColor: '#999',
    padding: 12,
    borderRadius: 5,
  },
  clearButtonText: {
    color: '#FFF',
  },
    searchInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
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
    clearButton2: {
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
    closeButton2: {
      backgroundColor: '#C80036',
      padding: 12,
      borderRadius: 5,
    },
    closeButtonText2: {
      color: '#FFF',
      textAlign: 'center',
    },
    eventsBox: {
      backgroundColor: 'rgba(182, 199, 170, 0.5)',
      borderRadius: 10,
      padding: 20,
      width: 350,
      height: 400,
    },
    eventContainer: {
        flex: 1,
        alignItems: 'center',       // Yatayda ortalar
      },
    textInput: {
      borderColor: '#03346E',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
      color: '#333',
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#7FA1C3',
    },
    headerText: {
      fontSize: 16,
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
    eventTextContainer: {
      flex: 3,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    noteIconContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
    addButton: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      backgroundColor: '#478CCF',
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
  