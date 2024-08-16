import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { ToastAndroid } from 'react-native'; 
import React, { useState } from 'react';

export default function SettingsPage() {
  const {  onLogout, onEditUserPassword, onDeleteAccount, authState } = useAuth();
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleLogout = async () => {
    try {
      if(!onLogout) return;
      await onLogout();
      ToastAndroid.show(
        'Başarı ile çıkış yapıldı.',
        ToastAndroid.SHORT
      );
    } catch (error) {
      Alert.alert('Hata', 'Çıkış sırasında bir hata oluştu.');
    }
  };

  const handleSavePassword = async () => {
    
    if (!newPassword) {
      Alert.alert('Hata', 'Lütfen yeni şifrenizi girin.');
      return;
    }

    try {
      console.log('121');
      if (!onEditUserPassword) {
        console.log('onEditUserPassword fonksiyonu mevcut değil');
        return;
      }
      if (!authState?.user) {
        console.log('authState.user mevcut değil veya null');
        return;
      }
      console.log('122');
      await onEditUserPassword(authState.user.user_id, newPassword);
      ToastAndroid.show('Şifre başarıyla değiştirildi!', ToastAndroid.SHORT);
      setIsModalVisible(false); 
      setNewPassword(''); 
    } catch (error) {
      console.log('Hata:', error);
      Alert.alert('Hata', 'Şifre güncellenirken bir hata oluştu.');
    }
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setNewPassword('');
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Hesabınızı silmek üzeresiniz",
      "Bu işlemi geri alamazsınız. Emin misiniz?",
      [
        {
          text: "Hayır",
          onPress: () => console.log("Hesap silme işlemi iptal edildi"),
          style: "cancel"
        },
        {
          text: "Evet",
          onPress: async () => {
            try {
              if (!authState?.user) {
                console.log('authState.user mevcut değil veya null');
                return;
              }
              if(!onDeleteAccount) return;
              await onDeleteAccount(authState.user.user_id);
              ToastAndroid.show("Hesabınız başarıyla silindi.", ToastAndroid.SHORT);
              handleLogout(); // Hesap silindiğinde çıkış yap
            } catch (error) {
              Alert.alert('Hata', 'Hesap silinirken bir hata oluştu.');
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRightShape} />
      <View style={styles.bottomLeftShape} />
      <View style={styles.bottomLeftShape2} />

      <View style = {styles.sectionConteiner}>
      <Text style={styles.sectionTitle}>Ayarlar</Text>
      <View style={styles.separator} />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Güncelle')}>
        <Text style={styles.buttonText}>Bilgilerimi Güncelle</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.passButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.buttonText}>Şifremi Değiştir</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon name="log-out-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Çıkış</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Hesabımı Sil</Text>
      </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Şifremi Değiştir</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Yeni Şifre"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="gray" />
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSavePassword}>
                <Text style={styles.buttonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  topRightShape: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 150,
    height: 120,
    backgroundColor: 'rgba(129,162,99, 0.3)',
    borderBottomLeftRadius: 250,
    zIndex: -1,
  },
  bottomLeftShape: {
    position: 'absolute',
    bottom: -70,
    left: -90,
    width: 230,
    height: 230,
    backgroundColor: 'rgba(129, 162, 99, 0.4)',
    borderRadius: 250,
  },
  bottomLeftShape2: {
    position: 'absolute',
    bottom: -110,
    left: -10,
    width: 230,
    height: 230,
    backgroundColor: 'rgba(129, 162, 99, 0.3)',
    borderRadius: 250,
  },
  sectionConteiner: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  sectionTitle: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#03346E',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCC',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#85b2de',
    padding: 15,
    width:270,
    borderRadius: 15,
    margin: 50,
    marginTop:35,
    marginBottom:1,
    alignItems: 'center',
    textAlign:'center',
  },
  passButton: {
    backgroundColor: '#4d83b8',
    padding: 15,
    width:270,
    borderRadius: 15,
    margin: 50,
    marginTop:35,
    marginBottom:1,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#03346E',
    alignItems:'center',
  },
  deleteButton: {
    backgroundColor: '#C80036',
    alignItems:'center',
    alignSelf:'center',
    width:150,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03346E',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#85b2de',
    marginBottom: 20,
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
  },
  cancelButton: {
    backgroundColor: '#abb1b8',
    padding: 10,
    borderRadius: 15,
    width: '45%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4d83b8',
    padding: 10,
    borderRadius: 15,
    width: '45%',
    alignItems: 'center',
  },
});
