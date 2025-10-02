import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
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
  categoria: string;
  variacao: boolean;
};

const VariacoesLinguisticasScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { word, userId } = route.params as { word: Word; userId: number };
  const [variacoes, setVariacoes] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  console.log(variacoes);

  useEffect(() => {
    const fetchVariacoes = async () => {
      const token = await AsyncStorage.getItem("Token");
      try {
        const response = await axios.get(`${Url}/variations/${word.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const variationsAsWords = response.data.map((variation: any) => ({
          id: variation.id,
          word: variation.name,
          description: variation.description,
          video: variation.video,
          variariationView: true
        }));

        setVariacoes(variationsAsWords);
      } catch (error) {
        console.error("Erro ao buscar variações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVariacoes();
  }, []);

  const handleWordPress = (word: Word) => {
    // Redireciona para detalhes da nova palavra
    //@ts-ignore
    navigation.navigate("surdos/moduloPalavraDetalhes", { word, userId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Variações de "{word.word}"</Text>

      {loading ? (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={{ marginTop: 10 }}>🔄 Carregando conteúdo...</Text>
        </View>
      ) : variacoes.length === 0 ? (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Text style={{ fontSize: 24 }}>📦</Text>
          <Text style={{ fontWeight: "bold", marginTop: 5 }}>
            Variação não encontrado!
          </Text>
          <Text style={{ textAlign: "center", marginTop: 5 }}>
            O conteúdo pode ter sido removido ou está indisponível.
          </Text>
        </View>
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
