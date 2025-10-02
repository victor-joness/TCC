import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import modulesData from "../../Utils/Modulos";

type User = {
  id: Number;
  name: String;
  email: String;
  phone: String;
  code: String;
  verified: boolean;
  password: String;
  photo: String;
  role: String;
};

export default function ModulosScreen(userParamns: User) {
  const route = useRoute();
  let user: User = route.params?.user;
  const navigation = useNavigation();

  const [selectedModule, setSelectedModule] =
    useState<keyof typeof modulesData>("UsoDiario");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredModules = modulesData[selectedModule].filter((module) =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const moduleColors: { [key in keyof typeof modulesData]: string } = {
    UsoDiario: "#00b4d8",
    UsoTecnico: "#D0BAD7",
  };

  const handleCardPress = (
    module: {
      id: number;
      name: string;
      icon: string;
    },
    userId: Number
  ) => {
    console.log("userId", userId);
    //@ts-ignore
    navigation.navigate("surdos/moduloDetalhes", {
      id: module.id,
      name: module.name,
      icon: module.icon,
      userId: userId,
    });
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: moduleColors[selectedModule] }]}
      key={item.id}
      onPress={() => handleCardPress(item, user.id)}
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Oi, {user.name}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedModule}
          onValueChange={(value) => setSelectedModule(value)}
          style={styles.picker}
        >
          <Picker.Item label="Uso diário" value="UsoDiario" />
          <Picker.Item label="Uso técnico" value="UsoTecnico" />
        </Picker>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar módulos..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <FlatList
        data={filteredModules}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarStyle: {
    backgroundColor: "#0B8DCD",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 70,
    position: "absolute",
    borderTopWidth: 0,
  },
  tabBarItemStyle: {
    marginHorizontal: 10,
    marginTop: 7,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    marginBottom: 50,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    margin: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  picker: {
    height: 60,
  },

  label: {
    fontSize: 16,
    marginRight: 8,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1,
  },
  icon: {
    fontSize: 32,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  searchIcon: {
    marginRight: 8,
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
});
