import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { modulosData } from "../../Utils/Modulos";

type ModuloItem = {
  id: number;
  name: string;
  icon: string;
};

type ModulosData = {
  Basico: ModuloItem[];
  Medio: ModuloItem[];
  Avancado: ModuloItem[];
  Tecnico: ModuloItem[];
};

type Word = {
  id: number;
  word: string;
  description: string;
  video: string;
  status: string;
  modulo: string;
  categoria: string;
};

const InterpreterWordDetailScreen = () => {
  const route = useRoute();
  const { word } = route.params as { word: Word };

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [wordDescription, setWordDescription] = useState(word.description || "");
  const [selectedModulo, setSelectedModulo] = useState(word.modulo);
  const [selectedCategoria, setSelectedCategoria] = useState(word.categoria || "");
  const [playing, setPlaying] = useState(false);

  const modulos = Object.keys(modulosData as ModulosData);

  const categorias = useMemo(() => {
    const moduloSelecionado = modulosData[selectedModulo as keyof typeof modulosData] || [];
    return moduloSelecionado.map(item => ({
      value: item.name,
      label: `${item.icon} ${item.name}`
    }));
  }, [selectedModulo]);

  const extractVideoId = (url: string) => {
    const regex = /(?:\?v=|\/embed\/|\/v\/|youtu\.be\/|\/watch\?v=|\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = extractVideoId(youtubeUrl);

  const handleConfirm = (currentWord: Word) => {
    const updatedWord: Word = {
      ...currentWord,
      description: wordDescription || currentWord.description,
      video: youtubeUrl || currentWord.video,
      modulo: selectedModulo || currentWord.modulo,
      categoria: selectedCategoria,
    };

    console.log("Objeto atualizado:", updatedWord);
    Alert.alert("Sucesso", "Alterações salvas com sucesso!");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.wordTitle}>{word.word}</Text>

      <View style={styles.wordDetails}>
        <TextInput
          style={styles.input}
          placeholder="Inserir Link do vídeo (YouTube)"
          value={youtubeUrl}
          onChangeText={setYoutubeUrl}
        />

        <View style={styles.videoPreview}>
          {videoId ? (
            <YoutubePlayer
              height={200}
              width={350}
              play={playing}
              videoId={videoId}
              webViewProps={{
                javaScriptEnabled: true,
                domStorageEnabled: true,
              }}
            />
          ) : (
            <Text style={styles.previewText}>
              Insira um link de vídeo válido para pré-visualização.
            </Text>
          )}
        </View>

        <Text style={styles.label}>Selecionar Módulo:</Text>
        <Picker
          selectedValue={selectedModulo}
          onValueChange={(itemValue) => {
            setSelectedModulo(itemValue);
            setSelectedCategoria("");
          }}
          style={styles.picker}
        >
          {modulos.map((modulo) => (
            <Picker.Item key={modulo} label={modulo} value={modulo} />
          ))}
        </Picker>

        <Text style={styles.label}>Selecionar Categoria:</Text>
        <Picker
          selectedValue={selectedCategoria}
          onValueChange={(itemValue) => setSelectedCategoria(itemValue)}
          style={styles.picker}
          enabled={!!selectedModulo}
        >
          <Picker.Item label="Selecione uma categoria" value="" />
          {categorias.map((categoria) => (
            <Picker.Item 
              key={categoria.value} 
              label={categoria.label} 
              value={categoria.value}
            />
          ))}
        </Picker>

        <Text style={styles.label}>Descrição:</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Inserir significado"
          value={wordDescription}
          onChangeText={setWordDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {wordDescription ? (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Preview da Descrição:</Text>
            <Text style={styles.previewText}>{wordDescription}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => handleConfirm(word)}
        >
          <Text style={styles.confirmButtonText}>Confirmar Alterações</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  wordDetails: {
    padding: 16,
    backgroundColor: "#fff",
  },
  wordTitle: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  videoPreview: {
    height: 200,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  previewContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#666",
  },
  previewText: {
    color: "#666",
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: "#00b4d8",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    marginTop: 16,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default InterpreterWordDetailScreen;