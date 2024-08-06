import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Button } from 'react-native';
import DatePicker from 'react-native-neat-date-picker';
import { Picker } from '@react-native-picker/picker';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (category: number | undefined, startDate: string, endDate: string) => void;
  categories: Category[];
  selectedCategory: number | undefined;
  startDate: string;
  endDate: string;
  setSelectedCategory: (categoryId: number | undefined) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

interface Category {
  category_id: number;
  category_name: string;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  categories,
  selectedCategory,
  startDate,
  endDate,
  setSelectedCategory,
  setStartDate,
  setEndDate,
}) => {
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);


  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filtreler</Text>
          
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Kategori Seçiniz" value={undefined} />
            {categories.map((category) => (
              <Picker.Item
                key={category.category_id}
                label={category.category_name}
                value={category.category_id}
              />
            ))}
          </Picker>
          
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
            <Text>{startDate ? startDate : 'Başlangıç Tarihi Seç'}</Text>
          </TouchableOpacity>
          <DatePicker
            isVisible={showStartDatePicker}
            mode="single"
            onCancel={() => setShowStartDatePicker(false)}
            onConfirm={(date) => {
              setStartDate(date.dateString);
              setShowStartDatePicker(false);
            }}
          />
          
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateButton}>
            <Text>{endDate ? endDate : 'Bitiş Tarihi Seç'}</Text>
          </TouchableOpacity>
          <DatePicker
            isVisible={showEndDatePicker}
            mode="single"
            onCancel={() => setShowEndDatePicker(false)}
            onConfirm={(date) => {
              setEndDate(date.dateString);
              setShowEndDatePicker(false);
            }}
          />
          
          <View style={styles.buttonContainer}>
            <Button title="Kapat" onPress={onClose} color="#758694" />
            <Button title="Uygula" onPress={() => onApplyFilters(selectedCategory, startDate, endDate)} color="#478CCF" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    height: 350,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  dateButton: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default FilterModal;
