import React, { useState } from "react";
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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

const ForumInterface = () => {
  const [selectedSection, setSelectedSection] = useState("leis");
  const [searchTerm, setSearchTerm] = useState("");
  const [wordToRequest, setWordToRequest] = useState("");

  const [requestedWords, setRequestedWords] = useState([
    { lei: "Olá", url: "" },
    { lei: "Bom dia", url: "" },
    { lei: "Boa tarde", url: "" },
    { lei: "Boa noite", url: "" },
  ]);

  const [laws, setLaws] = useState([
    {
      lei: "Lei nº 10.436 - Língua Brasileira de Sinais",
      url: "https://www.planalto.gov.br/ccivil_03/leis/2002/l10436.htm",
    },
    {
      lei: "Lei nº 12.319 - Regulamentação da profissão de Tradutor e Intérprete",
      url: "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2010/lei/l12319.htm",
    },
    {
      lei: "Lei nº 13.146 - Lei Brasileira de Inclusão",
      url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm",
    },
  ]);

  const [news, setNews] = useState([
    {
      lei: "UFPR abre vagas para curso de Libras",
      url: "https://www.ufpr.br/curso-libras",
    },
    {
      lei: "Novo aplicativo de tradução para Libras",
      url: "https://www.tecnologiaemlibras.com.br",
    },
    {
      lei: "Evento de inclusão será realizado na cidade",
      url: "https://www.eventos-inclusao.com.br",
    },
  ]);

  const handleWordRequest = () => {
    const normalizedWord = wordToRequest.trim().toLowerCase();
    const wordExists = requestedWords.some(
      (word) => word.lei.toLowerCase() === normalizedWord
    );

    if (wordExists) {
      Alert.alert("Aviso", "Esta palavra já foi solicitada!");
      return;
    }

    if (normalizedWord) {
      setRequestedWords([...requestedWords, { lei: wordToRequest, url: "" }]);
      setWordToRequest("");
      Alert.alert("Sucesso", "Palavra solicitada com sucesso!");
    }
  };

  const filterItems = (items : any) =>
    items.filter((item : any) =>
      item.lei.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderItem = ({ item }: { item: { lei?: string; url?: string; noticia?: string } }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (item.url) {
            // Abre o link no navegador
            Alert.alert(
              "Abrir Link",
              `Deseja abrir o link relacionado a esta ${item.lei ? "lei" : "notícia"}?`,
              [
                { text: "Cancelar", style: "cancel" },
                { text: "Abrir", onPress: () => Linking.openURL(item.url!) },
              ]
            );
          } else {
            Alert.alert("Sem URL", "Este item não possui um link associado.");
          }
        }}
      >
        <Text style={styles.cardText}>{item.lei || item.noticia || (typeof item === 'string' ? item : '')}</Text>
      </TouchableOpacity>
    );

  const renderContent = () => {
    let data = [];
    switch (selectedSection) {
      case "leis":
        data = filterItems(laws);
        break;
      case "noticias":
        data = filterItems(news);
        break;
      case "palavras":
        data = filterItems(requestedWords);
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

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Pesquisar"
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={{ flex: 1 }}
        />
      </View>

      {selectedSection === "palavras" && (
        <View style={styles.wordRequestContainer}>
          <TextInput
            style={styles.wordInput}
            placeholder="Digite uma nova palavra"
            value={wordToRequest}
            onChangeText={setWordToRequest}
          />
          <TouchableOpacity
            style={styles.requestButton}
            onPress={handleWordRequest}
          >
            <Text style={styles.buttonText}>Solicitar</Text>
          </TouchableOpacity>
        </View>
      )}

      {renderContent()}

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton}>
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text>Forum</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text>Perfil</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  wordRequestContainer: {
    flexDirection: "row",
    padding: 16,
    paddingTop: 0,
    gap: 8,
  },
  wordInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  requestButton: {
    backgroundColor: "#00b4d8",
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
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
  searchIcon: {
    marginRight: 8,
    marginLeft: 8,
  },
});

export default ForumInterface;
