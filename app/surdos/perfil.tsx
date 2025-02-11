import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    phone: string;
    role: string;
    photo: string | null;
  }>({
    name: 'Victor',
    email: 'email@exemplo.com',
    phone: '(00) 00000-0000',
    role: 'surdo',
    photo: null
  });

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const handleEditPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('É necessário permissão para acessar a galeria');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setUserInfo(prev => ({...prev, photo: pickerResult.assets[0].uri}));
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sair",
          onPress: () => console.log("Usuário deslogado")
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Deletar conta",
      "Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Deletar",
          onPress: () => console.log("Conta deletada"),
          style: "destructive"
        }
      ]
    );
  };

  const handleEditPerfil = () => {
    //@ts-ignore
    navigation.navigate('surdos/editPerfil', { userInfo })
  };

  const handleClickSobre = () => {
    //@ts-ignore
    navigation.navigate('surdos/sobre')
  };

  const MenuOption = ({ icon, title, onPress, rightElement } : any) => (
    <TouchableOpacity 
      style={styles.menuOption}
      onPress={onPress}
    >
      <View style={styles.menuOptionContent}>
        <Text style={styles.menuOptionText}>{title}</Text>
        {rightElement || <Text style={styles.chevron}>›</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleEditPhoto}>
          <View style={styles.photoContainer}>
            {userInfo.photo ? (
              <Image source={{ uri: userInfo.photo }} style={styles.photo} />
            ) : (
              <View style={[styles.photo, styles.photoPlaceholder]} />
            )}
            <View style={styles.editPhotoButton}>
              <Text style={styles.editPhotoIcon}>✎</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{userInfo.name}</Text>
      </View>

      <View style={styles.menuContainer}>
        {/* <MenuOption title="Estatísticas" onPress={() => {}} /> */}
        <MenuOption title="Editar perfil" onPress={handleEditPerfil} />
        <MenuOption title="Sobre o aplicativo" onPress={handleClickSobre} />
        {/* <MenuOption title="Compartilhar" onPress={() => {}} /> */}
        {/* <MenuOption 
          title="Modo escuro" 
          rightElement={
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          }
        /> */}
       {/*  <MenuOption title="Gerar certificado" onPress={() => {}} /> */}
        <MenuOption title="Sair da conta" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoPlaceholder: {
    backgroundColor: 'red',
  },
  editPhotoButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  editPhotoIcon: {
    fontSize: 16,
    color: '#666',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuOptionText: {
    fontSize: 16,
    color: '#333',
  },
  chevron: {
    fontSize: 20,
    color: '#666',
  },
  bottomTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    padding: 10,
  },
  activeTab: {
    backgroundColor: '#e6f3ff',
    borderRadius: 20,
  },
});

export default ProfileScreen;