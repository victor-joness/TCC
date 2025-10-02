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
import { useNavigation, useRoute } from "@react-navigation/native";
import { Url } from "~/Utils/Api";
import axios from "axios";
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
    type: string;
  };
  variacao: boolean;
};

const RecentScreen = () => {
  const route = useRoute();
  const userId = route.params?.userId;

  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState("");
  const [recentWords, setRecentWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRecentWords = async () => {
      if (!userId) return;

      setLoading(true);
      setError(false);
      const token = await AsyncStorage.getItem("Token");

      try {
        const response = await axios.get(`${Url}/view-words/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setRecentWords(response.data);
      } catch (err) {
        console.error("Erro ao buscar palavras recentes:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentWords();
  }, []);

  const handleWordPress = (word: { id: number; word: string }) => {
    //@ts-ignore
    navigation.navigate("surdos/moduloPalavraDetalhes", { word });
  };

  const filteredWords = recentWords.filter((word) =>
    word.word?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Recentes</Text>

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
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={{ marginTop: 10 }}>🔄 Carregando conteúdo...</Text>
        </View>
      ) : error ? (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Text style={{ fontSize: 24 }}>❌</Text>
          <Text style={{ color: "#d9534f", fontWeight: "bold", marginTop: 5 }}>
            Ocorreu um erro ao carregar as palavras.
          </Text>
          <Text style={{ textAlign: "center", marginTop: 5 }}>
            Verifique sua conexão ou tente novamente.
          </Text>
        </View>
      ) : filteredWords.length === 0 ? (
        <Text style={styles.noLikesText}>Nenhuma palavra encontrada.</Text>
      ) : (
        <FlatList
          data={filteredWords}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.wordItem}
              onPress={() => handleWordPress(item)}
            >
              <Text style={styles.wordText}>{item.word}</Text>
            </TouchableOpacity>
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
});

export default RecentScreen;
