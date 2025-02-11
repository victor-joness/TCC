import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

type Word = {
  id: number;
  word: string;
  description: string;
  video: string;
  status: string;
  modulo: string;
  categoria: string;
  variacao: boolean;
};

const mockVariations = [
  {
    id: 11,
    word: "Palavra 1.1 - CE",
    description: "lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet",
    video: "",
    status: "Aprovado",
    modulo: "Básico",
    categoria: "Saudações",
    variacao: false,
    parentId: 1,
  },
  {
    id: 12,
    word: "Palavra 1.1 - SP",
    description: "lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet",
    video: "",
    status: "Aprovado",
    modulo: "Básico",
    categoria: "Saudações",
    variacao: false,
    parentId: 1,
  },
  {
    id: 13,
    word: "Palavra 1.1 - RS",
    description: "lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet",
    video: "",
    status: "Aprovado",
    modulo: "Básico",
    categoria: "Saudações",
    variacao: false,
    parentId: 1,
  },
];

const VariacoesLinguisticasScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { word } = route.params as { word: Word };
  const [variacoes, setVariacoes] = useState<Word[]>([]);

  useEffect(() => {
    const fetchedVariations = mockVariations.filter(
      (w) => w.parentId === word.id
    );
    setVariacoes(fetchedVariations);
  }, [word.id]);

  const handleWordPress = (word: Word) => {
    //@ts-ignore
    navigation.navigate("surdos/moduloPalavraDetalhes", { word });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Variações de "{word.word}"</Text>

      {variacoes.length === 0 ? (
        <Text style={styles.noVariations}>Nenhuma variação encontrada.</Text>
      ) : (
        <FlatList
          data={variacoes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => handleWordPress(item)}
            >
              <Text style={styles.itemText}>{item.word}</Text>
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
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  noVariations: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
  itemContainer: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#00b4d8",
    marginBottom: 10,
    alignItems: "center",
  },
  itemText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});

export default VariacoesLinguisticasScreen;
