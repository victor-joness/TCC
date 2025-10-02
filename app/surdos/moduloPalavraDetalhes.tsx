import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
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
  variacao: boolean;
  variation?: Array<{
        id : number;
        name: string;
        description: string;
        video: string;
      }>;
  variationView?: boolean;
};

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

const ModulosPalavraDetalhesScreen = () => {
  const route = useRoute();
  const userId = route.params?.userId;

  const routeParams = route.params as {
    word: Word;
  };

  console.log("teste", routeParams.word);

  const navigation = useNavigation();
  const [playing, setPlaying] = useState(false);

  // Salvar visualização ao entrar na tela

  if (!routeParams.word.variationView) {
    useEffect(() => {
      const saveWordView = async () => {
        try {
          const token = await AsyncStorage.getItem("Token");

          if (!userId || !token) return;

          await axios.post(
            `${Url}/view-words`,
            {
              userId: userId,
              wordId: routeParams.word.id,
              date: new Date().toISOString(),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        } catch (error) {
          console.error("Erro ao salvar visualização da palavra:", error);
        }
      };

      saveWordView();
    }, [routeParams.word.id]);
  }
  const handleNavigateToVariacao = (word: Word) => {
    //@ts-ignore
    navigation.navigate("surdos/VariacoesLinguisticas", { word });
  };

  const extractVideoId = (url: string) => {
    const regex =
      /(?:\?v=|\/embed\/|\/v\/|youtu\.be\/|\/watch\?v=|\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = extractVideoId(routeParams.word.video);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.videoContainer}>
        <YoutubePlayer
          height={200}
          width={350}
          play={playing}
          videoId={videoId || ""}
          webViewProps={{
            javaScriptEnabled: true,
            domStorageEnabled: true,
          }}
        />
      </View>

      <Text style={styles.title}>{routeParams.word.word}</Text>

      <Text style={styles.description}>{routeParams.word.description}</Text>

      {/* Só mostra a categoria se variationView for false/undefined */}
      {!routeParams.word.variationView && routeParams.word.variacao &&(
        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            <Text style={styles.bold}>Categoria:</Text>{" "}
            {routeParams.word.category.name}
          </Text>
        </View>
      )}

      {/* Só mostra o botão de variações se variationView for false e variacao for true */}
      {!routeParams.word.variationView && routeParams.word.variacao && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNavigateToVariacao(routeParams.word)}
        >
          <Text style={styles.buttonText}>Ver Variações</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  videoContainer: {
    marginVertical: 20,
    alignItems: "center",
    backgroundColor: "#00b4d8",
    borderRadius: 8,
    padding: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#00b4d8",
    padding: 10,
    borderRadius: 8,
    color: "#000",
    width: 370,
  },
  description: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 24,
    lineHeight: 24,
  },
  infoContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: "#333",
    marginVertical: 5,
  },
  bold: {
    fontWeight: "bold",
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

export default ModulosPalavraDetalhesScreen;
