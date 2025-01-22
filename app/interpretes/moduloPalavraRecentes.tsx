import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

type Word = {
  id: number;
  word: string;
  description: string;
  video: string;
};

const RecentScreen = () => {
  const route = useRoute();
  const { recentWords } = route.params as {
    recentWords: Word[];
  };

  const navigation = useNavigation();

  const handleWordPress = (word: { id: number; word: string }) => {
    //@ts-ignore
    navigation.navigate("surdos/moduloPalavraDetalhes", { word });
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredWords = recentWords.filter((word) =>
    word.word.toLowerCase().includes(searchQuery.toLowerCase())
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

      {filteredWords.length === 0 ? (
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
