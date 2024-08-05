import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { FloatingAction } from "react-native-floating-action";

const actions = [
  {
    text: "Etkinlik Ekle",
    name: "bt_accessibility",
    position: 2
  }
];

const CalendarPage = () => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [isYearPickerVisible, setIsYearPickerVisible] = useState(false);
  const [isMonthPickerVisible, setIsMonthPickerVisible] = useState(false);

  const yearScrollViewRef = useRef(null);
  const monthScrollViewRef = useRef(null);

  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const daysOfWeek = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  useEffect(() => {
    if (isYearPickerVisible && yearScrollViewRef.current) {
      const index = selectedYear - (currentDate.getFullYear() - 50);
      yearScrollViewRef.current.scrollTo({
        y: index * 50,
        animated: true,
      });
    }
  }, [isYearPickerVisible]);

  useEffect(() => {
    if (isMonthPickerVisible && monthScrollViewRef.current) {
      monthScrollViewRef.current.scrollTo({
        y: selectedMonth * 50,
        animated: true,
      });
    }
  }, [isMonthPickerVisible]);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const renderDays = () => {
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const days = [];

    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    for (let i = 0; i < startDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayContainer} />
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = 
        selectedYear === currentDate.getFullYear() && 
        selectedMonth === currentDate.getMonth() && 
        i === currentDate.getDate();
      days.push(
        <View key={i} style={[styles.dayContainer, isToday && styles.todayContainer]}>
          <Text style={[styles.dayText, isToday && styles.todayText]}>{i}</Text>
        </View>
      );
    }
    return days;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsYearPickerVisible(true)}>
          <Text style={styles.headerText}>{selectedYear}</Text>
        </TouchableOpacity>
        <Modal
          visible={isYearPickerVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsYearPickerVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsYearPickerVisible(false)}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <ScrollView style={styles.pickerContainer} ref={yearScrollViewRef}>
                  {[...Array(100).keys()].map(i => (
                    <TouchableOpacity 
                      key={i} 
                      style={[
                        styles.pickerItem,
                        selectedYear === currentDate.getFullYear() - 50 + i && styles.selectedItem
                      ]}
                      onPress={() => {
                        setSelectedYear(currentDate.getFullYear() - 50 + i);
                        setIsYearPickerVisible(false);
                      }}
                    >
                      <Text style={[
                        styles.pickerText,
                        selectedYear === currentDate.getFullYear() - 50 + i && styles.selectedItemText
                      ]}>
                        {currentDate.getFullYear() - 50 + i}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        
        <View style={styles.monthContainer}>
          <TouchableOpacity onPress={handlePrevMonth}>
            <Text style={styles.arrowText}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsMonthPickerVisible(true)}>
            <Text style={styles.headerText}>{months[selectedMonth]}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextMonth}>
            <Text style={styles.arrowText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
        <Modal
          visible={isMonthPickerVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsMonthPickerVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsMonthPickerVisible(false)}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <ScrollView style={styles.pickerContainer} ref={monthScrollViewRef}>
                  {months.map((month, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={[
                        styles.pickerItem,
                        selectedMonth === index && styles.selectedItem
                      ]}
                      onPress={() => {
                        setSelectedMonth(index);
                        setIsMonthPickerVisible(false);
                      }}
                    >
                      <Text style={[
                        styles.pickerText,
                        selectedMonth === index && styles.selectedItemText
                      ]}>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>

      <View style={styles.daysOfWeekContainer}>
        {daysOfWeek.map((day, index) => (
          <View key={index} style={styles.dayOfWeekContainer}>
            <Text style={styles.dayOfWeekText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.calendarContainer}>
        {renderDays()}
      </View>
      <FloatingAction
      color='#478CCF'
    actions={actions}
    onPressItem={name => {
      console.log(`selected button: ${name}`);
    }}
  />
    </View>
  );
};

const styles = StyleSheet.create({
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayContainer: {
    width: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 20,
  },
  todayContainer: {
    borderColor: '#03346E',
    borderWidth: 2,
  },
  dayText: {
    fontSize: 18,
    color: '#03346E',
  },
  todayText: {
    color: '#478CCF',
    fontWeight: 'bold',
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
});

export default CalendarPage;
