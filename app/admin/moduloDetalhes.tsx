import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const mockModules = [
  {
    id: 1,
    words: [
      {
        id: 1,
        word: "Palavra 1.1",
        description:
          "ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum",
        video:
          "vJW2u13VXQk",
          status: "Aprovado",
        modulo: "Básico",
        categoria: "Saudações",
        variacao: true,
      },
      {
        id: 2,
        word: "Palavra 1.2",
        description: "Descrição para a palavra 1.2",
        video: "https://example.com/video1-2",
      },
      {
        id: 3,
        word: "Palavra 1.3",
        description: "Descrição para a palavra 1.3",
        video: "https://example.com/video1-3",
      },
      {
        id: 4,
        word: "Palavra 1.4",
        description: "Descrição para a palavra 1.4",
        video: "https://example.com/video1-4",
      },
    ],
  },
  {
    id: 2,
    words: [
      {
        id: 1,
        word: "Palavra 2.1",
        description: "Descrição para a palavra 2.1",
        video: "https://example.com/video2-1",
      },
      {
        id: 2,
        word: "Palavra 2.2",
        description: "Descrição para a palavra 2.2",
        video: "https://example.com/video2-2",
      },
      {
        id: 3,
        word: "Palavra 2.3",
        description: "Descrição para a palavra 2.3",
        video: "https://example.com/video2-3",
      },
      {
        id: 4,
        word: "Palavra 2.4",
        description: "Descrição para a palavra 2.4",
        video: "https://example.com/video2-4",
      },
    ],
  },
  {
    id: 3,
    words: [
      {
        id: 1,
        word: "Palavra 3.1",
        description: "Descrição para a palavra 3.1",
        video: "https://example.com/video3-1",
      },
      {
        id: 2,
        word: "Palavra 3.2",
        description: "Descrição para a palavra 3.2",
        video: "https://example.com/video3-2",
      },
      {
        id: 3,
        word: "Palavra 3.3",
        description: "Descrição para a palavra 3.3",
        video: "https://example.com/video3-3",
      },
      {
        id: 4,
        word: "Palavra 3.4",
        description: "Descrição para a palavra 3.4",
        video: "https://example.com/video3-4",
      },
    ],
  },
  {
    id: 4,
    words: [
      {
        id: 1,
        word: "Palavra 4.1",
        description: "Descrição 4.1",
        video: "https://example.com/video4-1",
      },
      {
        id: 2,
        word: "Palavra 4.2",
        description: "Descrição 4.2",
        video: "https://example.com/video4-2",
      },
      {
        id: 3,
        word: "Palavra 4.3",
        description: "Descrição 4.3",
        video: "https://example.com/video4-3",
      },
      {
        id: 4,
        word: "Palavra 4.4",
        description: "Descrição 4.4",
        video: "https://example.com/video4-4",
      },
    ],
  },
  {
    id: 5,
    words: [
      {
        id: 1,
        word: "Palavra 5.1",
        description: "Descrição 5.1",
        video: "https://example.com/video5-1",
      },
      {
        id: 2,
        word: "Palavra 5.2",
        description: "Descrição 5.2",
        video: "https://example.com/video5-2",
      },
      {
        id: 3,
        word: "Palavra 5.3",
        description: "Descrição 5.3",
        video: "https://example.com/video5-3",
      },
      {
        id: 4,
        word: "Palavra 5.4",
        description: "Descrição 5.4",
        video: "https://example.com/video5-4",
      },
    ],
  },
  {
    id: 6,
    words: [
      {
        id: 1,
        word: "Palavra 6.1",
        description: "Descrição 6.1",
        video: "https://example.com/video6-1",
      },
      {
        id: 2,
        word: "Palavra 6.2",
        description: "Descrição 6.2",
        video: "https://example.com/video6-2",
      },
      {
        id: 3,
        word: "Palavra 6.3",
        description: "Descrição 6.3",
        video: "https://example.com/video6-3",
      },
      {
        id: 4,
        word: "Palavra 6.4",
        description: "Descrição 6.4",
        video: "https://example.com/video6-4",
      },
    ],
  },
  {
    id: 7,
    words: [
      {
        id: 1,
        word: "Palavra 7.1",
        description: "Descrição 7.1",
        video: "https://example.com/video7-1",
      },
      {
        id: 2,
        word: "Palavra 7.2",
        description: "Descrição 7.2",
        video: "https://example.com/video7-2",
      },
      {
        id: 3,
        word: "Palavra 7.3",
        description: "Descrição 7.3",
        video: "https://example.com/video7-3",
      },
      {
        id: 4,
        word: "Palavra 7.4",
        description: "Descrição 7.4",
        video: "https://example.com/video7-4",
      },
    ],
  },
  {
    id: 8,
    words: [
      {
        id: 1,
        word: "Palavra 8.1",
        description: "Descrição 8.1",
        video: "https://example.com/video8-1",
      },
      {
        id: 2,
        word: "Palavra 8.2",
        description: "Descrição 8.2",
        video: "https://example.com/video8-2",
      },
      {
        id: 3,
        word: "Palavra 8.3",
        description: "Descrição 8.3",
        video: "https://example.com/video8-3",
      },
      {
        id: 4,
        word: "Palavra 8.4",
        description: "Descrição 8.4",
        video: "https://example.com/video8-4",
      },
    ],
  },
];

export default function ModulosDetalhesScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const routeParams = route.params as {
    id: string;
    name: string;
    icon: string;
  };

  const moduleId = parseInt(routeParams.id);
  const module = mockModules.find((mod) => mod.id === moduleId);
  const [savedWords, setSavedWords] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSaveWord = (wordId: number) => {
    setSavedWords((prevState) => ({
      ...prevState,
      [wordId]: !prevState[wordId],
    }));
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const filteredWords = module?.words.filter(({ word }) =>
    word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWordPress = (word: { id: number; word: string }) => {
    //@ts-ignore
    navigation.navigate("admin/moduloPalavraDetalhes", { word });
  };

  if (!module) return <Text>Módulo não encontrado!</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Módulo de{"\n"}
        {routeParams.name} {routeParams.icon}
      </Text>

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
          onChangeText={handleSearchChange}
        />
      </View>

      <FlatList
        data={filteredWords}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.wordItem}
            onPress={() => handleWordPress(item)}
          >
            <Text style={styles.wordText}>{item.word}</Text>
            <TouchableOpacity onPress={() => toggleSaveWord(item.id)}>
              <Ionicons
                name={savedWords[item.id] ? "heart" : "heart-outline"}
                size={24}
                color={savedWords[item.id] ? "red" : "#fff"}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginVertical: 20,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
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
  }
});