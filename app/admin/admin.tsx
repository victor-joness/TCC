import React, { useState, useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Url } from "~/Utils/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Word = {
  id: number;
  word: string;
  description: string;
  video: string;
  status: string;
  modulo: string;
  request_word_id: number;
  categoria: string;
  interprete: string;
  variacoes: string[];
};

const api = axios.create({
  baseURL: Url,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const AdminScreen = () => {
  const [selectedSection, setSelectedSection] = useState("palavras");
  const [searchQuery, setSearchQuery] = useState("");

  // Dados do backend
  const [initialWords, setInitialWords] = useState<Word[]>([]);
  const [news, setNews] = useState<
    { id: number; title: string; resume: string; link: string }[]
  >([]);
  const [laws, setLaws] = useState<
    { id: number; title: string; resume: string; link: string }[]
  >([]);
  const [interpreters, setInterpreters] = useState<
    { id: number; name: string; email: string }[]
  >([]);

  // Formulários e estados de edição
  const [newLaw, setNewLaw] = useState("");
  const [newLawLink, setNewLawLink] = useState("");
  const [newNews, setNewNews] = useState("");
  const [newNewsLink, setNewNewsLink] = useState("");
  const [newInterpreterName, setNewInterpreterName] = useState("");
  const [newInterpreterContact, setNewInterpreterContact] = useState("");
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [editingLawId, setEditingLawId] = useState<number | null>(null);
  const [editingInterpreterId, setEditingInterpreterId] = useState<
    number | null
  >(null);

  const navigation = useNavigation();

  // Carrega os dados do backend
  useEffect(() => {
    api
      .get<Word[]>("/words/status/PENDING")
      .then((r) => setInitialWords(r.data))
      .catch(() => Alert.alert("Erro", "Falha ao carregar palavras"));

    api
      .get("/news")
      .then((r) => setNews(r.data))
      .catch(() => Alert.alert("Erro", "Falha ao carregar notícias"));

    api
      .get("/laws")
      .then((r) => setLaws(r.data))
      .catch(() => Alert.alert("Erro", "Falha ao carregar leis"));

    api
      .get("/interpreters")
      .then((r) => setInterpreters(r.data))
      .catch(() => Alert.alert("Erro", "Falha ao carregar intérpretes"));
  }, []);

  // Filtrar palavras, notícias e leis pelo searchQuery
  const getFilteredWords = () =>
    initialWords.filter((word) =>
      word.word.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getFilteredNews = () =>
    news.filter((newsItem) =>
      newsItem.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getFilteredLaws = () =>
    laws.filter((law) =>
      law.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Funções para manipular palavras (status)
  const handleWordStatus = (word: Word, newStatus: string) => {
    Alert.alert(
      "Confirmar alteração",
      `Deseja alterar o status para ${
        newStatus.toUpperCase() == "APPROVED" ? "Aprovado" : "Rejeitado"
      }?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              // Atualiza a tabela de request (request_word)
              await api.put(`/words/${word.request_word_id}/status`, {
                status: newStatus.toUpperCase(),
              });

              await api.put(`/words/${word.id}`, {
                status: newStatus.toUpperCase(),
              });

              setInitialWords((words) => words.filter((w) => w.id !== word.id));

              Alert.alert("Sucesso", "Status atualizado com sucesso!");
            } catch (error) {
              console.log("Erro ao atualizar status:", error);
              Alert.alert("Erro", "Falha ao atualizar status.");
            }
          },
        },
      ]
    );
  };

  const handleWordInfo = (word: Word) => {
    // @ts-ignore
    navigation.navigate("admin/adminDetalhePalavra", { word });
  };

  // Funções para manipular notícias
  const addNews = () => {
    if (newNews.trim() && newNewsLink.trim()) {
      if (editingNewsId !== null) {
        api
          .put(`/news/${editingNewsId}`, {
            title: newNews,
            link: newNewsLink,
            resume: "",
          })
          .then((r) => {
            setNews((n) =>
              n.map((item) => (item.id === editingNewsId ? r.data : item))
            );
            setEditingNewsId(null);
            setNewNews("");
            setNewNewsLink("");
          })
          .catch(() => Alert.alert("Erro", "Falha ao editar notícia"));
      } else {
        api
          .post("/news", {
            id: 0,
            title: newNews,
            link: newNewsLink,
            resume: "",
          })
          .then((r) => {
            setNews((n) => [...n, r.data]);
            setNewNews("");
            setNewNewsLink("");
          })
          .catch(() => Alert.alert("Erro", "Falha ao adicionar notícia"));
      }
    } else {
      Alert.alert("Erro", "Por favor, preencha o título e o link da notícia.");
    }
  };

  const handleEditNews = (id: number, text: string, link: string) => {
    setEditingNewsId(id);
    setNewNews(text);
    setNewNewsLink(link);
  };

  const handleDeleteNews = (id: number) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta notícia?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: () => {
            api
              .delete(`/news/${id}`)
              .then(() => setNews((n) => n.filter((item) => item.id !== id)))
              .catch(() => Alert.alert("Erro", "Falha ao excluir a notícia"));
          },
          style: "destructive",
        },
      ]
    );
  };

  // Funções para manipular leis
  const addLaw = () => {
    if (newLaw.trim() && newLawLink.trim()) {
      if (editingLawId !== null) {
        api
          .put(`/laws/${editingLawId}`, {
            title: newLaw,
            link: newLawLink,
            resume: "",
          })
          .then((r) => {
            setLaws((l) =>
              l.map((item) => (item.id === editingLawId ? r.data : item))
            );
            setEditingLawId(null);
            setNewLaw("");
            setNewLawLink("");
          })
          .catch(() => Alert.alert("Erro", "Falha ao editar lei"));
      } else {
        api
          .post("/laws", {
            id: 0,
            title: newLaw,
            link: newLawLink,
            resume: "",
          })
          .then((r) => {
            setLaws((l) => [...l, r.data]);
            setNewLaw("");
            setNewLawLink("");
          })
          .catch(() => Alert.alert("Erro", "Falha ao adicionar lei"));
      }
    } else {
      Alert.alert("Erro", "Por favor, preencha o título e o link da lei.");
    }
  };

  const handleEditLaw = (id: number, text: string, link: string) => {
    setEditingLawId(id);
    setNewLaw(text);
    setNewLawLink(link);
  };

  const handleDeleteLaw = (id: number) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta lei?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: () => {
            api
              .delete(`/laws/${id}`)
              .then(() => setLaws((l) => l.filter((item) => item.id !== id)))
              .catch(() => Alert.alert("Erro", "Falha ao excluir a lei"));
          },
          style: "destructive",
        },
      ]
    );
  };

  // Funções para manipular intérpretes
  const addInterpreter = () => {
    if (newInterpreterName.trim() && newInterpreterContact.trim()) {
      if (editingInterpreterId !== null) {
        api
          .put(`/interpreters/${editingInterpreterId}`, {
            name: newInterpreterName,
            email: newInterpreterContact,
          })
          .then((r) => {
            setInterpreters((i) =>
              i.map((item) =>
                item.id === editingInterpreterId ? r.data : item
              )
            );
            setEditingInterpreterId(null);
            setNewInterpreterName("");
            setNewInterpreterContact("");
          })
          .catch(() => Alert.alert("Erro", "Falha ao editar intérprete"));
      } else {
        api
          .post("/interpreters", {
            id: 0,
            name: newInterpreterName,
            email: newInterpreterContact,
          })
          .then((r) => {
            setInterpreters((i) => [...i, r.data]);
            setNewInterpreterName("");
            setNewInterpreterContact("");
          })
          .catch(() => Alert.alert("Erro", "Falha ao adicionar intérprete"));
      }
    } else {
      Alert.alert("Erro", "Preencha o nome e o contato do intérprete.");
    }
  };

  const handleEditInterpreter = (id: number, name: string, contact: string) => {
    setEditingInterpreterId(id);
    setNewInterpreterName(name);
    setNewInterpreterContact(contact);
  };

  const handleDeleteInterpreter = (id: number) => {
    Alert.alert("Confirmar exclusão", "Deseja excluir este intérprete?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        onPress: () => {
          api
            .delete(`/interpreters/${id}`)
            .then(() =>
              setInterpreters((i) => i.filter((item) => item.id !== id))
            )
            .catch(() => Alert.alert("Erro", "Falha ao excluir intérprete"));
        },
        style: "destructive",
      },
    ]);
  };

  // Função para abrir link
  const handleOpenLink = async (link: string) => {
    try {
      const supported = await Linking.canOpenURL(link);
      if (supported) {
        await Linking.openURL(link);
      } else {
        Alert.alert("Erro", "Não foi possível abrir este link");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao tentar abrir o link");
    }
  };

  // Render itens Palavras
  const renderWordItem = ({ item }: { item: Word }) => (
    <View style={styles.wordItem}>
      <Text style={styles.wordText}>{item.word}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleWordStatus(item, "APPROVED")}
        >
          <Icon name="check-circle" size={24} color="#8CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleWordStatus(item, "REJECTED")}
        >
          <Icon name="cancel" size={24} color="#F44336" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleWordInfo(item)}
        >
          <Icon name="info" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({
    item,
    type,
  }: {
    item: { id: number; title: string; resume: string; link: string };
    type: "law" | "news";
  }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => handleOpenLink(item.link)}
      >
        <Text style={styles.cardText}>{item.title}</Text>
        <Text style={styles.cardLink}>{item.link}</Text>
      </TouchableOpacity>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            type === "law"
              ? handleEditLaw(item.id, item.title, item.link)
              : handleEditNews(item.id, item.title, item.link)
          }
        >
          <Icon name="edit" size={24} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            type === "law"
              ? handleDeleteLaw(item.id)
              : handleDeleteNews(item.id)
          }
        >
          <Icon name="delete" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderInterpreterItem = ({
    item,
  }: {
    item: { id: number; name: string; email: string };
  }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardText}>{item.name}</Text>
        <Text style={styles.cardLink}>{item.email}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          onPress={() => handleEditInterpreter(item.id, item.name, item.email)}
          style={styles.actionButton}
        >
          <Icon name="edit" size={24} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteInterpreter(item.id)}
          style={styles.actionButton}
        >
          <Icon name="delete" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header com busca e seletor de seção */}
      <View style={styles.header}>
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

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedSection}
            onValueChange={(value) => {
              setSelectedSection(value);
              setEditingLawId(null);
              setEditingNewsId(null);
              setNewLaw("");
              setNewLawLink("");
              setNewNews("");
              setNewNewsLink("");
            }}
            style={styles.picker}
          >
            <Picker.Item label="Palavras" value="palavras" />
            <Picker.Item label="Notícias" value="noticias" />
            <Picker.Item label="Leis" value="leis" />
            <Picker.Item label="Intérprete" value="interprete" />
          </Picker>
        </View>
      </View>

      {/* Seção Palavras */}
      {selectedSection === "palavras" && (
        <FlatList
          data={getFilteredWords()}
          renderItem={renderWordItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      )}

      {/* Seção Notícias */}
      {selectedSection === "noticias" && (
        <View style={styles.sectionContainer}>
          <View style={styles.addContainer}>
            <TextInput
              style={styles.input}
              placeholder="Título da notícia"
              value={newNews}
              onChangeText={setNewNews}
            />
            <TextInput
              style={styles.input}
              placeholder="Link da notícia"
              value={newNewsLink}
              onChangeText={setNewNewsLink}
            />
            <TouchableOpacity
              style={[
                styles.addButton,
                editingNewsId !== null && styles.editButton,
              ]}
              onPress={addNews}
            >
              <Text style={styles.addButtonText}>
                {editingNewsId !== null ? "Editar" : "Adicionar"}
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={getFilteredNews()}
            renderItem={({ item }) => renderItem({ item, type: "news" })}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
          />
        </View>
      )}

      {/* Seção Leis */}
      {selectedSection === "leis" && (
        <View style={styles.sectionContainer}>
          <View style={styles.addContainer}>
            <TextInput
              style={styles.input}
              placeholder="Título da lei"
              value={newLaw}
              onChangeText={setNewLaw}
            />
            <TextInput
              style={styles.input}
              placeholder="Link da lei"
              value={newLawLink}
              onChangeText={setNewLawLink}
            />
            <TouchableOpacity
              style={[
                styles.addButton,
                editingLawId !== null && styles.editButton,
              ]}
              onPress={addLaw}
            >
              <Text style={styles.addButtonText}>
                {editingLawId !== null ? "Editar" : "Adicionar"}
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={getFilteredLaws()}
            renderItem={({ item }) => renderItem({ item, type: "law" })}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
          />
        </View>
      )}

      {/* Seção Intérpretes */}
      {selectedSection === "interprete" && (
        <View style={styles.sectionContainer}>
          <Text style={styles.cardInformation}>
            Aqui você pode adicionar, editar e remover intérpretes do sistema.
            Para acessar, utilize o e-mail geral dos intérpretes. Certifique-se
            de manter as informações sempre atualizadas para um melhor
            gerenciamento.
          </Text>

          <View style={styles.addContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={newInterpreterName}
              onChangeText={setNewInterpreterName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={newInterpreterContact}
              onChangeText={setNewInterpreterContact}
            />
            <TouchableOpacity style={styles.addButton} onPress={addInterpreter}>
              <Text style={styles.addButtonText}>
                {editingInterpreterId !== null ? "Editar" : "Adicionar"}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={interpreters}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderInterpreterItem}
            style={styles.list}
          />
        </View>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  picker: {
    height: 60,
  },
  list: {
    flex: 1,
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
  sectionContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  addButton: {
    backgroundColor: "#49DA80",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: '100%',
    flexShrink: 0, // botão não encolhe abaixo dos 100px
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  addButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 8,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    margin: 8,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#00b4d8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
  },
  cardActions: {
    flexDirection: "row",
    marginLeft: 8,
  },
  actionButton: {
    marginLeft: 8,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 4,
  },
  addContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8, // evitar inputs encostando nas bordas
  },
  input: {
  width: "100%", // usar a largura total
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 10,
  fontSize: 16,
  backgroundColor: "#fff",
},
  addForm: {
    marginBottom: 16,
  },
  cardContent: {
    flex: 1,
    padding: 8,
  },
  cardLink: {
    fontSize: 12,
    marginTop: 4,
  },
  wordRequestContainer: {
    flexDirection: "column",
    padding: 16,
    gap: 8,
  },
  cardInformation: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    borderWidth: 1,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
});

export default AdminScreen;
