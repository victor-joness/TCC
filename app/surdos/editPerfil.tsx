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
import { P } from "~/components/ui/typography";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

type RouteParams = {
  params: {
    userInfo: {
      name: string;
      email: string;
      phone: string;
      photo?: string;
      role: string;
    };
  };
};

export default function EditProfileScreen() {
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const navigation = useNavigation();
  const { userInfo: initialUserInfo } = route.params;

  const [form, setForm] = useState({
    name: initialUserInfo?.name || "",
    email: initialUserInfo?.email || "",
    phone: initialUserInfo?.phone || "",
    password: "",
    role: initialUserInfo?.role || "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleEditPhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
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
      console.log("Nova foto selecionada:", pickerResult.assets[0].uri);
    }
  };

  const handleSave = () => {
    console.log("Salvando alterações:", form);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={[styles.card, { borderRadius: 0 }]}>
        <View style={styles.content}>
          <TouchableOpacity
            onPress={handleEditPhoto}
            style={styles.photoContainer}
          >
            <View style={styles.photoWrapper}>
              {initialUserInfo?.photo ? (
                <Image
                  source={{ uri: initialUserInfo.photo }}
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
                value={form.name}
                onChangeText={(value) => handleChange("name", value)}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
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
                value={form.email}
                onChangeText={(value) => handleChange("email", value)}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
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
                value={form.phone}
                onChangeText={(value) => handleChange("phone", value)}
              />
            </View>
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>

          <View style={styles.roleContainer}>
            <Text style={styles.label}>Tipo de Usuário:</Text>
            <View style={styles.roles}>
              <TouchableOpacity
                style={[
                  styles.roleBox,
                  { backgroundColor: "#0B8DCD" },
                  form.role === "Surdo" && styles.roleBoxSelected,
                ]}
                onPress={() => handleChange("role", "Surdo")}
              >
                <View style={styles.img}>
                  <Image
                    source={require("~/assets/images/surdo_register.png")}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.roleText}>Sou surdo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleBox,
                  { backgroundColor: "#49DA80" },
                  form.role === "Interprete" && styles.roleBoxSelected,
                ]}
                onPress={() => handleChange("role", "Interprete")}
              >
                <View style={styles.img}>
                  <Image
                    source={require("~/assets/images/interprete_register.png")}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.roleText}>Sou Intérprete</Text>
              </TouchableOpacity>
            </View>
            {errors.role && (
              <Text style={styles.errorTextRole}>{errors.role}</Text>
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              console.log("Deletar conta");
            }}
          >
            <Text style={styles.deleteButtonText}>Deletar Conta</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  photoContainer: {
    alignItems: "center"
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
    marginBottom: 20,
  },
  deleteButtonText: {
    color: "#0B8DCD",
    fontSize: 16,
    fontWeight: "bold",
  },
});
