import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Url } from "~/Utils/Api";

type Word = {
  id: number;
  word: string;
  description: string;
  video: string;
  status: string;
  interpreterId?: number;
  interpreterName?: string;
};

const InterpreteScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("palavras");

  const [words, setWords] = useState<Word[]>([]);
  const [laws, setLaws] = useState<
    { id: number; title: string; resume: string; link: string }[]
  >([]);
  const [news, setNews] = useState<
    { id: number; title: string; resume: string; link: string }[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const token = await AsyncStorage.getItem("Token");
          const [lawsRes, newsRes, wordsRes] = await Promise.all([
            axios.get(`${Url}/laws`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${Url}/news`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${Url}/words/requests`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          setLaws(lawsRes.data);
          setNews(newsRes.data);
          setWords(wordsRes.data.filter((word: Word) => word.status === "PENDING"));
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
        }
      };

      fetchData();
    }, [])
  );

  const handleUpdateWordStatus = async (
    wordId: number,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      const token = await AsyncStorage.getItem("Token");

      await axios.put(
        `${Url}/words/${wordId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert(
        "Sucesso",
        `Palavra ${status === "APPROVED" ? "aprovada" : "rejeitada"}!`
      );

      // Remove a palavra da lista
      setWords((prev) => prev.filter((w) => w.id !== wordId));
    } catch (error) {
      console.error("Erro ao atualizar palavra:", error);
      Alert.alert("Erro", "Não foi possível atualizar o status.");
    }
  };

  const getFilteredItems = () => {
    if (selectedCategory === "palavras") {
      return words.filter((word) =>
        word.word.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory === "leis") {
      return laws.filter((law) =>
        law.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory === "noticias") {
      return news.filter((newsItem) =>
        newsItem.title.toLowerCase().includes(searchQuery.toLowerCase())
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
            navigation.navigate("interpretes/interpreteDetalhePalavra", {
              word: item,
            })
          }
        >
          <View style={styles.wordContent}>
            <Text style={styles.wordText}>{item.word}</Text>
            {item.interpreterName && (
              <Text style={styles.interpreterText}>
                Intérprete: {item.interpreterName}
              </Text>
            )}
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleUpdateWordStatus(item.id, "REJECTED")}
            >
              <Icon name="cancel" size={24} color="#F44336" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.sectionItem}
        onPress={() => handleOpenLink(item.link)}
      >
        <Text style={styles.sectionText}>{item.title}</Text>
        <Text style={styles.urlText}>{item.link}</Text>
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
          selectedCategory === "palavras"
            ? item.id.toString()
            : index.toString()
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    margin: 16,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
    marginLeft: 8,
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
  wordContent: {
    flex: 1,
  },
  wordText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  interpreterText: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 16,
    backgroundColor: "#fff",
    borderRadius: 50,
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
  urlText: {
    marginTop: 8,
    color: "#333",
  },
  list: {
    flex: 1,
  },
});

export default InterpreteScreen;
