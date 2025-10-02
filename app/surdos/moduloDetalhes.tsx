import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Url } from "~/Utils/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    tpe: string;
  };
  variacao: boolean;
  favorited: boolean;
};

export default function ModulosDetalhesScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const routeParams = route.params as {
    id: string;
    name: string;
    icon: string;
    userId: Number;
  };

  const [wordsByModule, setWordsByModule] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [savedWords, setSavedWords] = useState<{ [key: number]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const moduleId = parseInt(routeParams.id);
  const userId = routeParams.userId;

  const requestWordsModule = async (moduleId: number, userId: Number) => {
    try {
      const token = await AsyncStorage.getItem("Token");

      const response = await axios.get(`${Url}/words/category/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId },
      });

      const words = response.data;

      // Atualiza savedWords com base no campo favorited
      const savedMap: Record<number, boolean> = {};
      words.forEach((word: any) => {
        if (word.favorited) {
          savedMap[word.id] = true;
        }
      });

      setSavedWords(savedMap);
      return words;
    } catch (error) {
      console.error("Erro ao buscar palavras:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        setError(false);

        const words = await requestWordsModule(moduleId, userId);

        if (!words || words.length === 0) {
          setWordsByModule([]);
        } else {
          setWordsByModule(words);
        }
      } catch (err) {
        console.error("Erro ao buscar palavras:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [moduleId]);

  const toggleSaveWord = async (wordId: number) => {
    const isAlreadySaved = savedWords[wordId];
    const token = await AsyncStorage.getItem("Token");
    const updatedSavedWords = {
      ...savedWords,
      [wordId]: !isAlreadySaved,
    };

    setSavedWords(updatedSavedWords);
    try {
      await axios.post(
        `${Url}/liked-words`,
        {
          userId: userId,
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
      setSavedWords((prevState) => ({
        ...prevState,
        [wordId]: isAlreadySaved,
      }));
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const filteredWords = wordsByModule.filter(({ word }) =>
    word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWordPress = (word: Word) => {
    //@ts-ignore
    navigation.navigate("surdos/moduloPalavraDetalhes", { word, userId});
  };

  if (loading) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>🔄 Carregando conteúdo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Text style={{ fontSize: 24 }}>❌</Text>
        <Text style={{ color: "#d9534f", fontWeight: "bold", marginTop: 5 }}>
          Ocorreu um erro ao carregar as palavras.
        </Text>
        <Text style={{ textAlign: "center", marginTop: 5 }}>
          Verifique sua conexão ou tente novamente.
        </Text>
      </View>
    );
  }

  if (!module) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Text style={{ fontSize: 24 }}>📦</Text>
        <Text style={{ fontWeight: "bold", marginTop: 5 }}>
          Módulo não encontrado!
        </Text>
        <Text style={{ textAlign: "center", marginTop: 5 }}>
          O conteúdo pode ter sido removido ou está indisponível.
        </Text>
      </View>
    );
  }

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
                color={savedWords[item.id] ? "red" : "#666"}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <Text style={{ fontSize: 18, color: "#888" }}>
              🔍 Nenhuma palavra encontrada
            </Text>
            <Text style={{ textAlign: "center", marginTop: 4 }}>
              Tente ajustar o filtro ou verificar outro módulo.
            </Text>
          </View>
        }
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
    color: "#000",
    fontWeight: "bold",
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
});
