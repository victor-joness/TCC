import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Heart, Clock } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const mockModules = [
  {
    id: 1,
    words: [
      {
        id: 1,
        word: "Palavra 1.1",
        description:
          "Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum",
        video:
          "vJW2u13VXQk",
        status: "Aprovado",
        modulo: "Básico",
        categoria: "Saudações",
        variacao: true,
      },
      {
        id: 12,
        word: "Palavra 1.2",
        description: "Descrição para a palavra 1.2",
        video: "https://example.com/video1-2",
      },
      {
        id: 13,
        word: "Palavra 1.3",
        description: "Descrição para a palavra 1.3",
        video: "https://example.com/video1-3",
      },
      {
        id: 14,
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
        id: 21,
        word: "Palavra 2.1",
        description: "Descrição para a palavra 2.1",
        video: "https://example.com/video2-1",
      },
      {
        id: 22,
        word: "Palavra 2.2",
        description: "Descrição para a palavra 2.2",
        video: "https://example.com/video2-2",
      },
      {
        id: 23,
        word: "Palavra 2.3",
        description: "Descrição para a palavra 2.3",
        video: "https://example.com/video2-3",
      },
      {
        id: 24,
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
        id: 31,
        word: "Palavra 3.1",
        description: "Descrição para a palavra 3.1",
        video: "https://example.com/video3-1",
      },
      {
        id: 32,
        word: "Palavra 3.2",
        description: "Descrição para a palavra 3.2",
        video: "https://example.com/video3-2",
      },
      {
        id: 33,
        word: "Palavra 3.3",
        description: "Descrição para a palavra 3.3",
        video: "https://example.com/video3-3",
      },
      {
        id: 34,
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
        id: 41,
        word: "Palavra 4.1",
        description: "Descrição 4.1",
        video: "https://example.com/video4-1",
      },
      {
        id: 42,
        word: "Palavra 4.2",
        description: "Descrição 4.2",
        video: "https://example.com/video4-2",
      },
      {
        id: 43,
        word: "Palavra 4.3",
        description: "Descrição 4.3",
        video: "https://example.com/video4-3",
      },
      {
        id: 44,
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
        id: 51,
        word: "Palavra 5.1",
        description: "Descrição 5.1",
        video: "https://example.com/video5-1",
      },
      {
        id: 52,
        word: "Palavra 5.2",
        description: "Descrição 5.2",
        video: "https://example.com/video5-2",
      },
      {
        id: 53,
        word: "Palavra 5.3",
        description: "Descrição 5.3",
        video: "https://example.com/video5-3",
      },
      {
        id: 54,
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
        id: 61,
        word: "Palavra 6.1",
        description: "Descrição 6.1",
        video: "https://example.com/video6-1",
      },
      {
        id: 62,
        word: "Palavra 6.2",
        description: "Descrição 6.2",
        video: "https://example.com/video6-2",
      },
      {
        id: 63,
        word: "Palavra 6.3",
        description: "Descrição 6.3",
        video: "https://example.com/video6-3",
      },
      {
        id: 64,
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
        id: 71,
        word: "Palavra 7.1",
        description: "Descrição 7.1",
        video: "https://example.com/video7-1",
      },
      {
        id: 72,
        word: "Palavra 7.2",
        description: "Descrição 7.2",
        video: "https://example.com/video7-2",
      },
      {
        id: 73,
        word: "Palavra 7.3",
        description: "Descrição 7.3",
        video: "https://example.com/video7-3",
      },
      {
        id: 74,
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
        id: 81,
        word: "Palavra 8.1",
        description: "Descrição 8.1",
        video: "https://example.com/video8-1",
      },
      {
        id: 82,
        word: "Palavra 8.2",
        description: "Descrição 8.2",
        video: "https://example.com/video8-2",
      },
      {
        id: 83,
        word: "Palavra 8.3",
        description: "Descrição 8.3",
        video: "https://example.com/video8-3",
      },
      {
        id: 84,
        word: "Palavra 8.4",
        description: "Descrição 8.4",
        video: "https://example.com/video8-4",
      },
    ],
  },
];

type Word = {
  id: number;
  word: string;
  description: string;
  video: string;
};

const PAGE_SIZE = 8;

const DicionarioScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [likedWords, setLikedWords] = useState<Word[]>([]);
  const [recentWords, setRecentWords] = useState<Word[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const allWords = mockModules.flatMap((module) => module.words);

  const filteredWords = allWords.filter(({ word }) =>
    word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedWords = filteredWords.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const toggleSaveWord = (word: Word) => {
    setLikedWords((prev) =>
      prev.some((likedWord) => likedWord.id === word.id)
        ? prev.filter((likedWord) => likedWord.id !== word.id)
        : [...prev, word]
    );
  };

  const handleWordPress = (word: Word) => {
    setRecentWords((prev) =>
      prev.some((likedWord) => likedWord.id === word.id)
        ? prev.filter((likedWord) => likedWord.id !== word.id)
        : [...prev, word]
    );

    //@ts-ignore
    navigation.navigate("surdos/moduloPalavraDetalhes", { word });
  };

  const handleLikedPress = () => {
    //@ts-ignore
    navigation.navigate("surdos/moduloPalavraCurtidas", { likedWords });
  };

  const handleRecentPress = () => {
    //@ts-ignore
    navigation.navigate("surdos/moduloPalavraRecentes", { recentWords });
  };

  useEffect(() => setCurrentPage(1), [searchQuery]);

  return (
    <View style={styles.container}>
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

      <View style={styles.containerButton}>
        <TouchableOpacity
          style={[styles.button, styles.likedButton]}
          onPress={() => {
            setSearchQuery("");
            handleLikedPress();
          }}
        >
          <Heart size={16} color="#ffffff" />
          <Text style={styles.likedButtonText}>Curtidos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.recentButton]}
          onPress={() => {
            setSearchQuery("");
            handleRecentPress();
          }}
        >
          <Clock size={16} color="#4A4A4A" />
          <Text style={styles.recentButtonText}>Recentes</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={paginatedWords}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.wordItem}
            onPress={() => handleWordPress(item)}
          >
            <Text style={styles.wordText}>{item.word}</Text>
            <TouchableOpacity onPress={() => toggleSaveWord(item)}>
              <Ionicons
                name={
                  likedWords.some((likedWord) => likedWord.id === item.id)
                    ? "heart"
                    : "heart-outline"
                }
                size={24}
                color={
                  likedWords.some((likedWord) => likedWord.id === item.id)
                    ? "red"
                    : "#666"
                }
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          style={styles.paginationButton}
        >
          <Text style={styles.paginationText}>Anterior</Text>
        </TouchableOpacity>
        <Text style={styles.pageNumber}>{`Página ${currentPage}`}</Text>
        <TouchableOpacity
          onPress={() =>
            setCurrentPage((prev) =>
              currentPage * PAGE_SIZE < filteredWords.length ? prev + 1 : prev
            )
          }
          style={styles.paginationButton}
        >
          <Text style={styles.paginationText}>Próxima</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    marginTop: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  containerButton: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    gap: 6,
  },
  likedButton: {
    backgroundColor: "#ff5a5f",
  },
  likedButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  recentButton: {
    backgroundColor: "#e5e5e5",
  },
  recentButtonText: {
    color: "#4a4a4a",
    fontWeight: "bold",
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
    fontWeight: "bold",
    color: "#000",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 80,
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#00b4d8",
    borderRadius: 8,
    marginHorizontal: 8,
  },
  paginationText: {
    color: "#000",
    fontWeight: "bold",
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default DicionarioScreen;
