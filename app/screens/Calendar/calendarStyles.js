import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 20,
      },
      header: {
        marginTop:20,
        marginBottom: 20,
        alignItems: 'center',
      },
      headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#03346E',
      },
      monthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
      },
      arrowText: {
        fontSize: 26,
        color: '#03346E',
        marginHorizontal: 70,
      },
      daysOfWeekContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf:'center',
      },
      dayOfWeekContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
      },
      dayOfWeekText: {
        fontSize: 18,
        color: '#03346E',
        fontWeight: 'bold',
      },
      calendarContainer: {
        width: 350,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignSelf:'center',
      },
      dayContainer: {
        width: 40,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 20,
        position: 'relative',
      },
      todayContainer: {
        backgroundColor: '#478CCF', 
        borderRadius: 28, 
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
      },
      dayText: {
        fontSize: 18,
        color: '#03346E',
      },
      todayText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
      dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#478CCF',
        position: 'absolute',
        bottom: 4,
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '80%',
        maxHeight: '60%',
      },
      pickerItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
      },
      pickerText: {
        fontSize: 20,
        color: '#03346E',
      },
      selectedItem: {
        backgroundColor: '#E8F1FA',
      },
      selectedItemText: {
        fontWeight: 'bold',
        color: '#478CCF',
      },
      eventsContainer: {
        flex: 1,
      },
      eventCard: {
        backgroundColor: '#478CCF',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
      },
      eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
      },
      eventTime: {
        fontSize: 16,
        color: '#FFFFFF',
        marginTop: 8,
      },
      eventLocation: {
        fontSize: 14,
        color: '#FFFFFF',
        marginTop: 8,
      },
      noEventsText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#03346E',
        marginTop: 24,
      },
      backButton: {
        alignSelf: 'flex-start',
        marginBottom: 16,
      },
      backButtonText: {
        fontSize: 18,
        color: '#03346E',
      },
});
