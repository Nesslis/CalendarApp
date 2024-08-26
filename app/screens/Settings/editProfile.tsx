import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function EditProfile() {
  const { authState, onEditUser, fetchUser } = useAuth();
  const [firstName, setFirstName] = useState(authState?.user?.firstName || '');
  const [lastName, setLastName] = useState(authState?.user?.lastName || '');
  const [email, setEmail] = useState(authState?.user?.email || '');
  const navigation = useNavigation();

  useEffect(() => {
    if (!fetchUser || !authState?.user?.email) return;
    fetchUser(authState.user.email).then(() => {
      setFirstName(authState?.user?.firstName || '');
      setLastName(authState?.user?.lastName || '');
      setEmail(authState?.user?.email || '');
    });
  }, [authState?.user?.email]);

  const handleUpdate = async () => {
    try {
      const updatedUserData = {
        first_name: firstName,
        last_name: lastName,
        email,
      };

      if (!onEditUser || !authState?.user?.user_id) return;

      await onEditUser(authState.user.user_id, updatedUserData);

      ToastAndroid.show(
        'Kullanıcı bilgileri başarıyla güncellendi!',
        ToastAndroid.SHORT
      );
      navigation.goBack();
    } catch (error) {
      console.error('Kullanıcı bilgileri güncellenirken hata oluştu:', error);
      Alert.alert('Hata', 'Bilgiler güncellenirken bir hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name='arrow-back' size={28} color='#81A263 ' />
        </TouchableOpacity>
      </View>
      <Text style={styles.headerTitle}>Bilgilerimi Güncelle</Text>
      <View style={styles.separator} />

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>İsim :</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Soyisim :</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email :</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Geri</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03346E',
    marginBottom: 20,
    marginTop: 30,
    textAlign: 'center',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 5,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCC',
    marginVertical: 20,
  },
  formContainer: {
    marginTop: 50,
    width: 330,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 35,
  },
  inputLabel: {
    fontSize: 14,
    color: '#03346E',
  },
  input: {
    fontSize: 16,
    color: '#03346E',
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    paddingVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 80,
  },
  backButton: {
    backgroundColor: '#B0B0B0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 25,
  },
  saveButton: {
    backgroundColor: '#478CCF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 25,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
