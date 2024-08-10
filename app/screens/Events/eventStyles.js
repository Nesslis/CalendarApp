import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  filterIconContainer: {
    position: 'absolute',
    top: 43,
    right: 30,
    zIndex: 1,
  },
  eventContainer: {
          flex: 1,
          justifyContent: 'center',  // Dikeyde ortalar
          alignItems: 'center',       // Yatayda ortalar
        },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03346E',
    marginBottom: 30,
    marginTop: 20,
    textAlign: 'left',
  },
  eventsBox: {
    backgroundColor: 'rgba(182, 199, 170, 0.5)',
    borderRadius: 10,
    padding: 20,
    marginTop: 30,
    width: 350,
    height: 450,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#7FA1C3',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#03346E',
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#7FA1C3',
  },
  eventText: {
    color: '#333',
  },
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
  applyButton: {
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
  closeButton: {
    backgroundColor: '#C80036',
    padding: 12,
    borderRadius: 5,
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
