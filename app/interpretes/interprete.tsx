import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

type Word = {
  id: number;
  word: string;
  description: string;
  video: string;
  status: string;
};

const InterpreteScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("palavras");

  const initialWords: Word[] = [
    { id: 1, word: "Palavra 1", description: "Descrição 1", video: "", status: "pending" },
    { id: 2, word: "Palavra 2", description: "Descrição 2", video: "", status: "pending" },
    { id: 3, word: "Palavra 3", description: "Descrição 3", video: "", status: "pending" },
  ];

  const laws = [
    {
      lei: "Lei nº 10.436 - Língua Brasileira de Sinais",
      url: "https://www.planalto.gov.br/ccivil_03/leis/2002/l10436.htm",
    },
    {
      lei: "Lei nº 12.319 - Regulamentação da profissão de Tradutor e Intérprete",
      url: "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2010/lei/l12319.htm",
    },
  ];

  const news = [
    { lei: "UFPR abre vagas para curso de Libras", url: "https://www.ufpr.br/curso-libras" },
    { lei: "Novo aplicativo de tradução para Libras", url: "https://www.tecnologiaemlibras.com.br" },
  ];

  const getFilteredItems = () => {
    if (selectedCategory === "palavras") {
      return initialWords.filter((word) =>
        word.word.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory === "leis") {
      return laws.filter((law) =>
        law.lei.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory === "noticias") {
      return news.filter((newsItem) =>
        newsItem.lei.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return [];
  };

  const handleOpenLink = (url: string) => {
    if (url) {
      Linking.openURL(url);
    } else {
      Alert.alert("Sem URL", "Este item não possui um link associado.");
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    if (selectedCategory === "palavras") {
      return (
        <TouchableOpacity
          style={styles.wordItem}
          onPress={() =>
            //@ts-ignore
            navigation.navigate("interpretes/interpreteDetalhePalavra", { word: item })
          }
        >
          <Text style={styles.wordText}>{item.word}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="check-circle" size={24} color="#8CAF50" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="cancel" size={24} color="#F44336" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.sectionItem}
        onPress={() => handleOpenLink(item.url)}
      >
        <Text style={styles.sectionText}>{item.lei}</Text>
        <Text style={styles.urlText}>{item.url}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
          style={styles.picker}
        >
          <Picker.Item label="Palavras" value="palavras" />
          <Picker.Item label="Leis" value="leis" />
          <Picker.Item label="Notícias" value="noticias" />
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
            placeholder="Pesquisar"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

      <FlatList
        data={getFilteredItems()}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          selectedCategory === "palavras" ? item.id.toString() : index.toString()
        }
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    margin: 8,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    marginHorizontal: 16,
  },
  picker: {
    height: 50,
  },
  list: {
    flex: 1
  },
  wordItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#00b4d8",
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 8,
  },
  wordText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 16,
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  wordDetails: {
    padding: 16,
    backgroundColor: "#fff",
  },
  wordTitle: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  videoPreview: {
    height: 200,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  previewText: {
    color: "#666",
    fontSize: 16,
  },
  descriptionContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    minHeight: 100,
  },
  description: {
    fontSize: 16,
    color: "#333",
  },
  sectionItem: {
    backgroundColor: "#00b4d8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  sectionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
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
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  urlText: {
    marginTop: 8,
  }
});

export default InterpreteScreen;
