import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Card } from "~/components/ui/card";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Url } from "~/Utils/Api";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen() {
  const route = useRoute();
  const user = route.params?.user;

  const navigation = useNavigation();

  const [errors, setErrors] = useState({
    name: "",
    emailOrPhone: "",
    phone: "",
    password: "",
    role: "",
    photo: "",
  });

  const [userInfo, setUserInfo] = useState<{
    name: string;
    emailOrPhone: string;
    phone: string;
    role: string;
    photo: string | null;
  }>({
    name: user.name,
    emailOrPhone: user.email,
    phone: user.phone,
    role: user.role,
    photo: user.photo,
  });

  const handleChange = (field: string, value: string) => {
    setUserInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleEditPhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("É necessário permissão para acessar a galeria");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const photoUri = pickerResult.assets[0].uri;

      const fileName = photoUri.split("/").pop();
      if (!FileSystem.documentDirectory) {
        Alert.alert("Erro", "Diretório do sistema de arquivos não disponível.");
        return;
      }
      const newPath = FileSystem.documentDirectory + fileName;

      try {
        await FileSystem.copyAsync({
          from: photoUri,
          to: newPath,
        });
      } catch (error) {
        console.error("Erro ao copiar arquivo:", error);
        Alert.alert("Erro", "Não foi possível armazenar a foto localmente.");
        return;
      }

      const updatedUser = { ...userInfo, photo: newPath };

      setUserInfo(updatedUser);

      try {
        const token = await AsyncStorage.getItem("Token");
        await axios.put(`${Url}/users/${user.id}`, updatedUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Alert.alert("Sucesso", "Foto atualizada com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar a foto:", error);
        Alert.alert("Erro", "Não foi possível atualizar a foto.");
      }
    }
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("Token");
      const updatedUser = {
        ...userInfo,
        id: user.id,
        name: userInfo.name,
        email: userInfo.emailOrPhone,
        phone: userInfo.phone,
        photo: userInfo.photo,
      };

      await axios.put(`${Url}/users/${user.id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");

      if (userInfo.role === "SURDO") {
        //@ts-ignore
        navigation.navigate("surdos/modulos", { user: updatedUser });
      } else if (userInfo.role === "INTERPRETE") {
        //@ts-ignore
        navigation.navigate("interpretes/modulos", { user: updatedUser });
      } else if (userInfo.role === "ADMIN") {
        //@ts-ignore
        navigation.navigate("admin/modulos", { user: updatedUser });
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Deletar conta",
      "Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Deletar",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("Token");
              await axios.delete(`${Url}/users/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              Alert.alert("Sucesso", "Sua conta foi deletada com sucesso!");
              //@ts-ignore
              navigation.navigate("auth/login");
            } catch (error) {
              console.error("Erro ao deletar conta:", error);
              Alert.alert("Erro", "Não foi possível deletar a conta.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Card style={[styles.card, { borderRadius: 0 }]}>
          <View style={styles.content}>
            <TouchableOpacity
              onPress={handleEditPhoto}
              style={styles.photoContainer}
            >
              <View style={styles.photoWrapper}>
                {userInfo?.photo ? (
                  <Image
                    source={{ uri: userInfo.photo }}
                    style={styles.photo}
                  />
                ) : (
                  <View style={[styles.photo, styles.photoPlaceholder]} />
                )}
                <View style={styles.editPhotoButton}>
                  <Icon name="pencil" size={20} color="#0B8DCD" />
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome</Text>
              <View style={styles.inputWrapper}>
                <Icon
                  name="account-outline"
                  size={20}
                  color="#0B8DCD"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu nome"
                  placeholderTextColor="#999"
                  value={userInfo.name}
                  onChangeText={(value) => handleChange("name", value)}
                />
              </View>
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputWrapper}>
                <Icon
                  name="email-outline"
                  size={20}
                  color="#0B8DCD"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu e-mail"
                  placeholderTextColor="#999"
                  value={userInfo.emailOrPhone}
                  onChangeText={(value) => handleChange("emailOrPhone", value)}
                  editable={false}
                />
              </View>
              {errors.emailOrPhone && (
                <Text style={styles.errorText}>{errors.emailOrPhone}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Telefone</Text>
              <View style={styles.inputWrapper}>
                <Icon
                  name="phone-outline"
                  size={20}
                  color="#0B8DCD"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu telefone"
                  placeholderTextColor="#999"
                  value={userInfo.phone}
                  onChangeText={(value) => handleChange("phone", value)}
                />
              </View>
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>URL da Foto</Text>
              <View style={styles.inputWrapper}>
                <Icon
                  name="image-outline"
                  size={20}
                  color="#0B8DCD"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Cole a URL da sua foto"
                  placeholderTextColor="#999"
                  value={userInfo.photo ?? ""}
                  onChangeText={(value) => handleChange("photo", value)}
                />
              </View>
              {errors.photo && (
                <Text style={styles.errorText}>{errors.photo}</Text>
              )}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Salvar Alterações</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.deleteButtonText}>Deletar Conta</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  card: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  photoWrapper: {
    position: "relative",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoPlaceholder: {
    backgroundColor: "red",
  },
  editPhotoButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  errorText: {
    fontSize: 12,
    color: "#E74C3C",
    marginTop: 5,
  },
  errorTextRole: {
    fontSize: 16,
    color: "#E74C3C",
    marginTop: 25,
    textAlign: "center",
    fontWeight: "bold",
  },
  roleContainer: {
    marginVertical: 20,
  },
  roles: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roleBox: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    width: 130,
    height: 130,
    marginHorizontal: 10,
  },
  roleBoxSelected: {
    borderColor: "red",
    borderWidth: 2,
  },
  roleText: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
    color: "#0B8DCD",
  },
  img: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  image: {
    width: "100%",
    height: "100%",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#0B8DCD",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#ccc",
  },
  deleteButtonText: {
    color: "#0B8DCD",
    fontSize: 16,
    fontWeight: "bold",
  },
});
