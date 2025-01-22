import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Linking
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export type Word = {
  id: number;
  word: string;
  description: string;
  video: string;
  status: string;
  modulo: string;
  categoria: string;
};

const AdminScreen = () => {
  const [selectedSection, setSelectedSection] = useState("palavras");
  const [searchQuery, setSearchQuery] = useState("");
  const [newLaw, setNewLaw] = useState("");
  const [newLawLink, setNewLawLink] = useState("");
  const [newNews, setNewNews] = useState("");
  const [newNewsLink, setNewNewsLink] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialWords: Word[] = [
    {
      id: 1,
      word: 'Olá',
      description: 'Saudação informal em Libras',
      video: 'https://youtube.com/watch?v=example1',
      status: 'pending',
      modulo: 'Basico',
      categoria: 'Saudações',
    },
    {
      id: 2,
      word: 'Bom dia',
      description: 'Saudação matinal em Libras',
      video: 'https://youtube.com/watch?v=example2',
      status: 'pending',
      modulo: 'Basico',
      categoria: 'Saudações',
    },
  ];

  const [laws, setLaws] = useState([
    {
      id: 1,
      text: "Lei nº 10.436 - Língua Brasileira de Sinais",
      link: "http://www.planalto.gov.br/ccivil_03/leis/2002/l10436.htm",
    },
    {
      id: 2,
      text: "Lei nº 12.319 - Regulamentação da profissão de Tradutor e Intérprete",
      link: "http://www.planalto.gov.br/ccivil_03/_ato2007-2010/2010/lei/l12319.htm",
    },
    {
      id: 3,
      text: "Lei nº 13.146 - Lei Brasileira de Inclusão",
      link: "http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm",
    },
  ]);

  const [news, setNews] = useState([
    {
      id: 1,
      text: "UFPR abre vagas para curso de Libras",
      link: "https://www.ufpr.br/noticias",
    },
    {
      id: 2,
      text: "Novo aplicativo de tradução para Libras",
      link: "https://exemplo.com/noticia1",
    },
    {
      id: 3,
      text: "Evento de inclusão será realizado na cidade",
      link: "https://exemplo.com/noticia2",
    },
  ]);

  const getFilteredWords = () => {
    return initialWords.filter((word) =>
      word.word.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getFilteredNews = () => {
    return news.filter((newsItem) =>
      newsItem.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getFilteredLaws = () => {
    return laws.filter((law) =>
      law.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const addNews = () => {
    if (newNews.trim() && newNewsLink.trim()) {
      if (editingId !== null) {
        setNews(
          news.map((item) =>
            item.id === editingId
              ? { ...item, text: newNews, link: newNewsLink }
              : item
          )
        );
        setEditingId(null);
      } else {
        const newId = Math.max(...news.map((item) => item.id), 0) + 1;
        setNews([...news, { id: newId, text: newNews, link: newNewsLink }]);
      }
      setNewNews("");
      setNewNewsLink("");
    } else {
      Alert.alert("Erro", "Por favor, preencha o título e o link da notícia.");
    }
  };

  const addLaw = () => {
    if (newLaw.trim() && newLawLink.trim()) {
      if (editingId !== null) {
        setLaws(
          laws.map((item) =>
            item.id === editingId
              ? { ...item, text: newLaw, link: newLawLink }
              : item
          )
        );
        setEditingId(null);
      } else {
        const newId = Math.max(...laws.map((item) => item.id), 0) + 1;
        setLaws([...laws, { id: newId, text: newLaw, link: newLawLink }]);
      }
      setNewLaw("");
      setNewLawLink("");
    } else {
      Alert.alert("Erro", "Por favor, preencha o título e o link da lei.");
    }
  };

  const handleEdit = (
    id: number,
    text: string,
    link: string,
    type: "law" | "news"
  ) => {
    setEditingId(id);
    if (type === "law") {
      setNewLaw(text);
      setNewLawLink(link);
    } else {
      setNewNews(text);
      setNewNewsLink(link);
    }
  };

  const handleDelete = (id: number, type: "law" | "news") => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este item?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: () => {
            if (type === "law") {
              setLaws(laws.filter((item) => item.id !== id));
            } else {
              setNews(news.filter((item) => item.id !== id));
            }
          },
          style: "destructive",
        },
      ]
    );
  };

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

  const navigation = useNavigation();

  const handleWordInfo = (word: Word) => {
    //@ts-ignore
    navigation.navigate('admin/adminDetalhePalavra', { word });
  };

  const handleWordStatus = (id: number, newStatus: string) => {
    Alert.alert(
      'Confirmar alteração',
      `Deseja alterar o status para ${newStatus}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => {
            Alert.alert('Sucesso', 'Status atualizado com sucesso!');
          },
        },
      ]
    );
  };

  const renderWordItem = ({ item }: { item: Word }) => (
    <View style={styles.wordItem}>
      <Text style={styles.wordText}>{item.word}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleWordStatus(item.id, 'Aprovado')}
        >
          <Icon name="check-circle" size={24} color="#8CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleWordStatus(item.id, 'Rejeitado')}
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
    item: { id: number; text: string; link: string };
    type: "law" | "news";
  }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => handleOpenLink(item.link)}
      >
        <Text style={styles.cardText}>{item.text}</Text>
        <Text style={styles.cardLink}>{item.link}</Text>
      </TouchableOpacity>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEdit(item.id, item.text, item.link, type)}
        >
          <Icon name="edit" size={24} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item.id, type)}
        >
          <Icon name="delete" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNewsList = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="Título da noticia"
          value={newNews}
          onChangeText={setNewNews}
        />
        <TextInput
          style={styles.input}
          placeholder="Link da noticia"
          value={newNewsLink}
          onChangeText={setNewNewsLink}
        />
        <TouchableOpacity
          style={[styles.addButton, editingId !== null && styles.editButton]}
          onPress={addNews}
        >
          <Text style={styles.addButtonText}>
            {editingId !== null ? "Editar" : "Adicionar"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={getFilteredNews()}
          renderItem={({ item }) => renderItem({ item, type: "news" })}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      </View>
    </View>
  );

  const renderLawsList = () => (
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
          style={[styles.addButton, editingId !== null && styles.editButton]}
          onPress={addLaw}
        >
          <Text style={styles.addButtonText}>
            {editingId !== null ? "Editar" : "Adicionar"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={getFilteredLaws()}
          renderItem={({ item }) => renderItem({ item, type: "law" })}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
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
              setEditingId(null);
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
          </Picker>
        </View>
      </View>

      {selectedSection === "palavras" && (
        <FlatList
          data={getFilteredWords()}
          renderItem={renderWordItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      )}
      {selectedSection === "noticias" && renderNewsList()}
      {selectedSection === "leis" && renderLawsList()}
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
    padding: 16,
    marginBottom: 50,
  },
  addButton: {
    backgroundColor: "#49DA80",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: 100,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    margin: 8,
    marginBottom: 16,
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 50,
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
  }
});

export default AdminScreen;
