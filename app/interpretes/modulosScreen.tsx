import { useNavigation } from "@react-navigation/native";
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

const modulesData = {
  Basico: [
    { id: 1, name: "Saudações", icon: "👋" },
    { id: 2, name: "Sentimentos", icon: "❤️" },
    { id: 3, name: "Animais", icon: "🐶" },
    { id: 4, name: "Comida", icon: "🍎" },
    { id: 5, name: "Cores", icon: "🎨" },
    { id: 6, name: "Família", icon: "👨‍👩‍👧" },
    { id: 7, name: "Escola", icon: "🏫" },
    { id: 8, name: "Profissões", icon: "💼" },
  ],
  Medio: [
    { id: 1, name: "Esportes", icon: "⚽" },
    { id: 2, name: "Transporte", icon: "🚗" },
    { id: 3, name: "Tecnologia", icon: "💻" },
    { id: 4, name: "Ciência", icon: "🔬" },
    { id: 5, name: "Música", icon: "🎵" },
    { id: 6, name: "Arte", icon: "🖼️" },
    { id: 7, name: "Clima", icon: "🌤️" },
    { id: 8, name: "Geografia", icon: "🌍" },
  ],
  Avancado: [
    { id: 1, name: "Política", icon: "🏛️" },
    { id: 2, name: "História", icon: "📜" },
    { id: 3, name: "Saúde", icon: "🩺" },
    { id: 4, name: "Economia", icon: "💰" },
    { id: 5, name: "Psicologia", icon: "🧠" },
    { id: 6, name: "Religião", icon: "⛪" },
    { id: 7, name: "Literatura", icon: "📚" },
    { id: 8, name: "Filosofia", icon: "🤔" },
  ],
  Tecnico: [
    { id: 1, name: "Programação", icon: "💻" },
    { id: 2, name: "Engenharia", icon: "🔧" },
    { id: 3, name: "Arquitetura", icon: "🏗️" },
    { id: 4, name: "Robótica", icon: "🤖" },
    { id: 5, name: "Matemática", icon: "➕" },
    { id: 6, name: "Química", icon: "⚗️" },
    { id: 7, name: "Física", icon: "📐" },
    { id: 8, name: "Astronomia", icon: "🌌" },
  ],
};

export default function ModulosScreen() {
  const navigation = useNavigation();

  const [selectedModule, setSelectedModule] =
    useState<keyof typeof modulesData>("Basico");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredModules = modulesData[selectedModule].filter((module) =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const moduleColors: { [key in keyof typeof modulesData]: string } = {
    Basico: "#00b4d8",
    Medio: "#D0BAD7",
    Avancado: "#FFB74D",
    Tecnico: "#8BC34A",
  };

  const handleCardPress = (module: {
    id: number;
    name: string;
    icon: string;
  }) => {
    //@ts-ignore
    navigation.navigate("surdos/moduloDetalhes", module);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: moduleColors[selectedModule] }]}
      key={item.id}
      onPress={() => handleCardPress(item)}
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Oi, Victor</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedModule}
          onValueChange={(value) => setSelectedModule(value)}
          style={styles.picker}
        >
          <Picker.Item label="Básico" value="Basico" />
          <Picker.Item label="Médio" value="Medio" />
          <Picker.Item label="Avançado" value="Avancado" />
          <Picker.Item label="Técnico" value="Tecnico" />
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
    borderColor: '#ddd',
    borderRadius: 8,
    margin: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  picker: {
    height: 60
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
