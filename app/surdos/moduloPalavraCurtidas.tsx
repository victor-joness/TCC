import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Url } from "~/Utils/Api";

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
  variations?: Array<{
    id: number;
    name: string;
    description: string;
    video: string;
  }>;
  variationView?: boolean;
  variacao: boolean;
};

const CurtidasScreen = () => {
  const route = useRoute();
  const user = route.params?.user;
  const navigation = useNavigation();

  const [likedWords, setLikedWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLikedWords = async () => {
    try {
      setLoading(true);
      setError(false);
      const token = await AsyncStorage.getItem("Token");
      const response = await axios.get(`${Url}/liked-words/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLikedWords(response.data); // já retorna só as palavras
    } catch (err) {
      console.error("Erro ao buscar palavras curtidas:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Executa toda vez que a tela for focada
  useFocusEffect(
    React.useCallback(() => {
      fetchLikedWords();
    }, [user.id])
  );

  const handleWordPress = (word: Word) => {
    //@ts-ignore
    navigation.navigate("surdos/moduloPalavraDetalhes", {
      word: word.variations && word.variations.length > 0 ? { ...word, variacao: true } : word,
      userId: user.id,
    });
  };

  const filteredWords = likedWords.filter(({ word }) =>
    word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigateToVariacao = (word: Word) => {
    //@ts-ignore
    navigation.navigate("surdos/VariacoesLinguisticas", { word });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Palavras Curtidas</Text>

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

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.noLikesText}>
          Erro ao carregar palavras curtidas.
        </Text>
      ) : filteredWords.length === 0 ? (
        <Text style={styles.noLikesText}>Nenhuma palavra encontrada.</Text>
      ) : (
        <FlatList
          data={filteredWords}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                style={styles.wordItem}
                onPress={() => handleWordPress(item)}
              >
                <Text style={styles.wordText}>{item.word}</Text>
                <Ionicons name="heart" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
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
  noLikesText: {
    fontSize: 16,
    color: "#888",
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
  button: {
    backgroundColor: "#00b4d8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
  },
});

export default CurtidasScreen;
