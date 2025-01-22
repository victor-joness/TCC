import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

type Word = {
  id: number;
  word: string;
  description: string;
  video: string;
};

const ModulosPalavraDetalhesScreen = () => {
  const route = useRoute();

  const routeParams = route.params as {
    word: Word;
  };

  const [playing, setPlaying] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.videoContainer}>
        <YoutubePlayer
          height={200}
          width={350}
          play={playing}
          videoId={routeParams.word.video}
        />
      </View>

      <Text style={styles.title}>{routeParams.word.word}</Text>

      <Text style={styles.description}>
        {routeParams.word.description ||
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
      </Text>
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
    backgroundColor: "#57B1CA",
    borderRadius: 8,
    padding: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#57B1CA",
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
});

export default ModulosPalavraDetalhesScreen;
