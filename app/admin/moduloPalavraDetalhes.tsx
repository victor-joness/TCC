import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

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

const ModulosPalavraDetalhesScreen = () => {
  const route = useRoute();

  const routeParams = route.params as {
    word: Word;
  };

  const navigation = useNavigation();

  console.log(routeParams);
  const [playing, setPlaying] = useState(false);

  const handleNavigateToVariacao = (word: Word) => {
    //@ts-ignore
    navigation.navigate("surdos/VariacoesLinguisticas", { word });
  };

  const videoId =
    routeParams.word.video.split("v=")[1] || routeParams.word.video;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.videoContainer}>
        <YoutubePlayer
          height={200}
          width={350}
          play={playing}
          videoId={routeParams.word.video}
          webViewProps={{
            javaScriptEnabled: true,
            domStorageEnabled: true,
          }}
        />
      </View>

      <Text style={styles.title}>{routeParams.word.word}</Text>

      <Text style={styles.description}>
        {routeParams.word.description ||
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
      </Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>
          <Text style={styles.bold}>Status:</Text> {routeParams.word.status}
        </Text>
        <Text style={styles.label}>
          <Text style={styles.bold}>Categoria:</Text>{" "}
          {routeParams.word.categoria}
        </Text>
      </View>

      {routeParams.word.variacao && (
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
