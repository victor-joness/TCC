import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Url } from "~/Utils/Api";
import { useFocusEffect } from "expo-router";
import modulosData from "../../Utils/Modulos";
import WordRequestModal from "./WordRequestModal";

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

const ForumInterface = (userParamns: User) => {
  const route = useRoute();
  const user = route.params?.user;

  const [selectedSection, setSelectedSection] = useState("leis");
  const [searchTerm, setSearchTerm] = useState("");
  const [wordToRequest, setWordToRequest] = useState("");
  const [urlToRequest, setUrlToRequest] = useState("");

  const allCategories = [...modulosData.UsoDiario, ...modulosData.UsoTecnico];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [requestedWords, setRequestedWords] = useState<
    {
      id: number;
      title: string;
      resume: string;
      link: string;
      status: string;
    }[]
  >([]);
  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState(false);
  const [Laws, setLaws] = useState([]);
  const [News, setNews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(false);
          const token = await AsyncStorage.getItem("Token");

          const [lawsResponse, newsResponse] = await Promise.all([
            axios.get(`${Url}/laws`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${Url}/news`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          setLaws(lawsResponse.data);
          setNews(newsResponse.data);
        } catch (err) {
          console.error("Erro ao buscar dados:", err);
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  useEffect(() => {
    const fetchRequestedWords = async () => {
      try {
        const token = await AsyncStorage.getItem("Token");
        const response = await axios.get(`${Url}/words/requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const mappedData = response.data.map((item: any) => ({
          id: item.id,
          title: item.word,
          link: item.videoUrl,
          status: item.status,
        }));

        setRequestedWords(mappedData);
      } catch (error) {
        console.error("Erro ao buscar palavras solicitadas:", error);
      }
    };

    fetchRequestedWords();
  }, []);

  const handleWordRequest = async () => {
    const normalizedWord = wordToRequest.trim().toLowerCase();

    const wordExists = requestedWords.some(
      (word) => word.title.toLowerCase() === normalizedWord
    );

    if (wordExists) {
      Alert.alert("Aviso", "Esta palavra já foi solicitada!");
      return;
    }

    const normalizedUrl = urlToRequest.trim().toLowerCase();

    const urlExists = requestedWords.some(
      (word) => word.link.toLowerCase() === normalizedUrl
    );

    if (normalizedUrl && urlExists) {
      Alert.alert("Aviso", "Este link já foi solicitado!");
      return;
    }

    if (normalizedWord) {
      try {
        const token = await AsyncStorage.getItem("Token");
        const response = await axios.post(
          `${Url}/words/request`,
          {
            word: wordToRequest.trim(),
            video_url: urlToRequest.trim(),
            category: selectedCategory,
            request_user_id: user.id,
            status: "PENDING",
            interpreter_id: 0
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          setRequestedWords((prev) => [
            ...prev,
            {
              id: requestedWords.length + 1,
              title: wordToRequest,
              resume: "",
              link: urlToRequest,
              status: "PENDING",
            },
          ]);
          setWordToRequest("");
          setUrlToRequest("");
          Alert.alert("Sucesso", "Palavra solicitada com sucesso!");
        } else {
          Alert.alert("Erro", "Não foi possível solicitar a palavra.");
        }
      } catch (error) {
        console.error("Erro ao solicitar palavra:", error);
        Alert.alert("Erro", "Ocorreu um erro ao enviar a solicitação.");
      }
    }
  };

  const renderItem = ({
    item,
  }: {
    item: {
      id: number;
      title: string;
      resume: string;
      link: string;
      status: string;
    };
  }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "PENDING":
          return "#ffd900";
        case "REJECTED":
          return "#ff0000";
        case "TRANSLATED":
          return "#00ff00";
        default:
          return "gray";
      }
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (item.link) {
            Alert.alert(
              "Abrir Link",
              `Deseja abrir o link relacionado a esta ${
                item.title ? "palavra" : "notícia"
              }?`,
              [
                { text: "Cancelar", style: "cancel" },
                { text: "Abrir", onPress: () => Linking.openURL(item.link!) },
              ]
            );
          } else {
            Alert.alert("Sem URL", "Este item não possui um link associado.");
          }
        }}
      >
        <View style={styles.cardContent}>
          <View style={styles.leftContent}>
            <Text style={styles.cardText}>
              {item.title || (typeof item === "string" ? item : "")}
            </Text>
            {item.link !== "" && (
              <Text style={styles.urlText}>{item.link}</Text>
            )}
          </View>
          {item.status !== undefined && item.status !== "" && (
            <View style={styles.rightContent}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              />
              <Text style={styles.statusText}>
                {item.status === "PENDING"
                  ? "Pendente"
                  : item.status === "TRANSLATED"
                  ? "Em Tradução"
                  : "Rejeitado"}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const filterItems = (
    items: {
      id: number;
      title: string;
      resume: string;
      link: string;
      status?: string;
    }[]
  ): typeof items =>
    items.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const renderContent = () => {
    // Ensure all items have a status property (default to empty string if missing)
    let data: {
      id: number;
      title: string;
      resume: string;
      link: string;
      status: string;
    }[] = [];
    switch (selectedSection) {
      case "leis":
        data = filterItems(Laws).map((item) => ({
          ...item,
          status: "",
        }));
        break;
      case "noticias":
        data = filterItems(News).map((item) => ({
          ...item,
          status: "",
        }));
        break;
      case "palavras":
        data = filterItems(requestedWords).map((item) => ({
          ...item,
          status: item.status ?? "",
        }));
        break;
    }

    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  if (Loading) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>🔄 Carregando conteúdo...</Text>
      </View>
    );
  }

  if (Error) {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedSection}
          onValueChange={(itemValue) => setSelectedSection(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Leis" value="leis" />
          <Picker.Item label="Notícias" value="noticias" />
          <Picker.Item label="Solicitar palavras" value="palavras" />
        </Picker>
      </View>

      {/* {selectedSection === "palavras" && (
        <View style={styles.wordRequestContainer}>
          <Text style={styles.cardInformation}>
            Para solicitar uma nova palavra, você pode enviar apenas o nome da
            palavra ou um link de referência (como um vídeo do YouTube ou um
            arquivo no Google Drive). Isso nos ajudará a compreender melhor o
            contexto e fornecer uma tradução mais precisa.
          </Text>
          <View style={{ flexDirection: "column", height: 220, gap: 8 }}>
            <TextInput
              style={styles.wordInput}
              placeholder="Digite uma nova palavra"
              value={wordToRequest}
              onChangeText={setWordToRequest}
            />
            <TextInput
              style={styles.wordInput}
              placeholder="Digite um Link de referência"
              value={urlToRequest}
              onChangeText={setUrlToRequest}
            />
            <View style={styles.pickerContainerStyle}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                style={styles.pickerStyle}
              >
                <Picker.Item label="Selecione a categoria" value="" />
                {allCategories.map((cat) => (
                  <Picker.Item
                    key={cat.id}
                    label={`${cat.icon} ${cat.name}`}
                    value={cat.name.toString()}
                  />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={styles.requestButton}
              onPress={handleWordRequest}
            >
              <Text style={styles.buttonText}>Solicitar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.buttonTextSolicitation}>
            Palavras já solicitadas : {requestedWords.length}
          </Text>
        </View>
      )}

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
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {renderContent()} */}

      {/* Search e lista de palavras ficam sempre */}
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
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {renderContent()}

      {selectedSection === "palavras" && (
        <View style={styles.wordRequestContainer}>
          <TouchableOpacity
            style={styles.requestButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Solicitar nova palavra</Text>
          </TouchableOpacity>

          <Text style={styles.buttonTextSolicitation}>
            Palavras já solicitadas: {requestedWords.length}
          </Text>

          <WordRequestModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            wordToRequest={wordToRequest}
            setWordToRequest={setWordToRequest}
            urlToRequest={urlToRequest}
            setUrlToRequest={setUrlToRequest}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            allCategories={allCategories}
            handleWordRequest={handleWordRequest}
          />
        </View>
      )}

      

      {/* <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton}>
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text>Forum</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text>Perfil</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
  wordRequestContainer: {
    flexDirection: "column",
    padding: 16,
    paddingTop: 0,
    gap: 4,
    height: 150,
  },
  wordInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  requestButton: {
    backgroundColor: "#999",
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    height: 40,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginTop: 10,
    backgroundColor: "#00b4d8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  navButton: {
    padding: 8,
  },
  cardInformation: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    borderWidth: 1,
    padding: 16,
    borderRadius: 8,
  },
  buttonTextSolicitation: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  urlText: {
    marginTop: 8,
  },
  pickerContainerStyle: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  pickerStyle: {
    height: 55,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftContent: {
    flex: 1,
  },

  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },

  statusText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "bold",
  },
});

export default ForumInterface;
