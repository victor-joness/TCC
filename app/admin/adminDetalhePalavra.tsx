import { useRoute } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

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
  interprete: string;
  variations: {
    id: number;
    name: string;
    description: string;
    video: string;
  }[];
  interpreterName: string;
};

type RouteParams = {
  word: Word;
};

const adminDetalhePalavra = () => {
  const route = useRoute();
  const { word } = route.params as RouteParams;
  const [playing, setPlaying] = useState(false);

  const extractVideoId = (url: string) => {
    if (!url) return "";
    const regex =
      /(?:\?v=|\/embed\/|\/v\/|youtu\.be\/|\/watch\?v=|\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : "";
  };

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  const onError = useCallback((error: any) => {
    Alert.alert("Erro", "Ocorreu um erro ao carregar o vídeo");
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{word.word}</Text>

      <View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Módulo</Text>
          <Text style={styles.info}>{word.modulo == "UsoDiario" ? "Uso Diário" : "Uso Técnico"}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Categoria</Text>
          <Text style={styles.info}>{word.category.name}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Status</Text>
          <Text
            style={[styles.info, styles[word.status as keyof typeof styles]]}
          >
            {word.status == "PENDING" ? "Pendente" :
              word.status == "APPROVED" ? "Aprovado" :
              word.status == "REJECTED" ? "Rejeitado" : "Desconhecido"}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Intérprete Responsável</Text>
          <Text style={styles.info}>
            {word.interpreterName || "Não informado"}
          </Text>
        </View>

        <View style={styles.variationsContainer}>
          <Text style={styles.sectionTitle}>Variações Linguísticas</Text>
          {Array.isArray(word.variations) && word.variations.length > 0 ? (
            word.variations.map((variacao, index) => (
              <View key={index} style={styles.variationCard}>
                <Text style={styles.variationName}>{variacao.name}</Text>
                <Text style={styles.variationDescription}>
                  {variacao.description
                    ? variacao.description
                    : "Descrição não disponível"}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noVariationText}>
              Ainda não há variações linguísticas cadastradas para esta palavra.
            </Text>
          )}
        </View>
      </View>

      <View style={styles.videoContainer}>
        <Text style={styles.sectionTitle}>Vídeo em Libras</Text>
        {word.video ? (
          <View style={styles.playerWrapper}>
            <YoutubePlayer
              height={200}
              play={playing}
              videoId={extractVideoId(word.video)}
              onChangeState={onStateChange}
              onError={onError}
              webViewProps={{
                androidLayerType: "hardware",
              }}
            />
          </View>
        ) : (
          <View style={styles.noVideoContainer}>
            <Text style={styles.noVideoText}>Nenhum vídeo disponível</Text>
          </View>
        )}
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>Descrição</Text>
        {word.description ? (
          <Text style={styles.description}>{word.description}</Text>
        ) : (
          <Text style={styles.noDescriptionText}>
            Nenhuma descrição disponível
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  info: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
    marginTop: 4,
  },
  pending: {
    color: "#f0ad4e",
  },
  approved: {
    color: "#5cb85c",
  },
  rejected: {
    color: "#d9534f",
  },
  videoContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  playerWrapper: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    overflow: "hidden",
  },
  noVideoContainer: {
    height: 200,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  noVideoText: {
    color: "#666",
    fontSize: 16,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
  },
  noDescriptionText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  variationsContainer: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  variationText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  noVariationText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  variationCard: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  variationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  variationDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
});

export default adminDetalhePalavra;
