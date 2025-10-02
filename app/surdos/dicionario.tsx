import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Heart, Clock } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { Url } from "~/Utils/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

type Word = {
  id: number;
  word: string;
  description: string;
  video: string;
  status: string;
  modulo: string;
  category: {
    id: number;
    name: string;
    type: string;
  };
  variacao: boolean;
  favorited: boolean;
};

const PAGE_SIZE = 8;

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

export const getLikedWords = async (userId: Number): Promise<Word[]> => {
  try {
    const token = await AsyncStorage.getItem("Token");

    const response = await axios.get(`${Url}/liked-words/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar palavras curtidas:", error);
    return [];
  }
};

const DicionarioScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Dados do usuário
  const user: User = route.params?.user;

  // Estados
  const [searchQuery, setSearchQuery] = useState("");
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recentWords, setRecentWords] = useState<Word[]>([]);

  const PAGE_SIZE = 8;

  useFocusEffect(
    useCallback(() => {
      const fetchAllWords = async () => {
        try {
          const token = await AsyncStorage.getItem("Token");

          const response = await axios.get(`${Url}/words`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { userId: user.id },
          });

          setAllWords(response.data);
          console.log("Todas as palavras:", response.data);
        } catch (error) {
          console.error("Erro ao buscar palavras:", error);
        }
      };

      if (user?.id) {
        fetchAllWords();
      }
    }, [user?.id])
  );

  // Filtra palavras pela busca
  const filteredWords = allWords.filter(({ word }) =>
    word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagina
  const paginatedWords = filteredWords.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Alternar favorito
  const toggleSaveWord = async (wordId: number) => {
    const token = await AsyncStorage.getItem("Token");

    const word = allWords.find((w) => w.id === wordId);
    if (!word) return;

    const isAlreadySaved = word.favorited;

    setAllWords((prevWords) =>
      prevWords.map((w) =>
        w.id === wordId ? { ...w, favorited: !isAlreadySaved } : w
      )
    );

    try {
      await axios.post(
        `${Url}/liked-words`,
        {
          userId: user.id,
          wordId: wordId,
          status: isAlreadySaved ? "REMOVED" : "SAVED",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      ToastAndroid.show(
        isAlreadySaved
          ? "Palavra removida com sucesso!"
          : "Palavra marcada com sucesso!",
        ToastAndroid.SHORT
      );
    } catch (error) {
      console.error("Erro ao salvar palavra:", error);

      setAllWords((prevWords) =>
        prevWords.map((w) =>
          w.id === wordId ? { ...w, favorited: isAlreadySaved } : w
        )
      );
    }
  };

  const handleWordPress = (word: Word) => {
    //@ts-ignore
    navigation.navigate("surdos/moduloPalavraDetalhes", {
      word: word,
      userId: user.id,
    });
  };

  // Resetar página ao alterar busca
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleLikedPress = () => {
    //@ts-ignore
    navigation.navigate("surdos/moduloPalavraCurtidas", { user: user });
  };

  const handleRecentPress = () => {
    //@ts-ignore
    navigation.navigate("surdos/moduloPalavraRecentes", { userId: user.id });
  };

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
            <TouchableOpacity onPress={() => toggleSaveWord(item.id)}>
              <Ionicons
                name={item.favorited ? "heart" : "heart-outline"}
                size={24}
                color={item.favorited ? "red" : "#666"}
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
