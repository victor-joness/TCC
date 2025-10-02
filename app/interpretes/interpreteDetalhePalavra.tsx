import React, { useState, useMemo, useEffect } from "react";
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
import { useRoute, useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import modulosData from "../../Utils/Modulos";
import { Checkbox } from "~/components/ui/checkbox";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Url } from "~/Utils/Api";

type Interpreter = {
  id: number;
  name: string;
};

type ModuloItem = {
  id: number;
  name: string;
  icon: string;
};

type ModulosData = {
  UsoDiario: ModuloItem[];
  UsoTecnico: ModuloItem[];
};

type VariationPayload = {
  id: number;
  name: string;
  description: string;
  video: string;
  wordId: number;
};

type Word = {
  id: number;
  word: string;
  description: string;
  video: string;
  status: string;
  modulo: string;
  category: string;
  variacao: boolean;
  interpreterId?: number;
};

const InterpreterWordDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { word } = route.params as { word: Word };

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [wordDescription, setWordDescription] = useState(
    word.description || ""
  );
  const [selectedModulo, setSelectedModulo] = useState(word.modulo);
  const [selectedCategoria, setSelectedCategoria] = useState(
    word.category || ""
  );
  const [selectedInterpreter, setSelectedInterpreter] = useState<
    number | undefined
  >(word.interpreterId);
  const [playing, setPlaying] = useState(false);
  const [variacao, setVariacao] = useState(false);
  const [variations, setVariations] = useState([
    { name: "", description: "", video: "" },
  ]);
  const [interpreters, setInterpreters] = useState<Interpreter[]>([]);

  useEffect(() => {
    const fetchInterpreters = async () => {
      try {
        const token = await AsyncStorage.getItem("Token");
        const response = await axios.get(`${Url}/interpreters`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInterpreters(response.data);
      } catch (error) {
        console.error("Erro ao buscar intérpretes:", error);
        Alert.alert("Erro", "Não foi possível carregar os intérpretes.");
      }
    };

    fetchInterpreters();
  }, []);

  const modulos = Object.keys(modulosData as ModulosData);

  const categorias = useMemo(() => {
    const moduloSelecionado =
      modulosData[selectedModulo as keyof typeof modulosData] || [];
    return moduloSelecionado.map((item) => ({
      value: item.name,
      label: `${item.icon} ${item.name}`,
    }));
  }, [selectedModulo]);

  const selectedCategoryId = useMemo(() => {
    const moduloSelecionado =
      modulosData[selectedModulo as keyof typeof modulosData];
    const categoria = moduloSelecionado?.find(
      (item) => item.name === selectedCategoria
    );
    return categoria?.id ?? null;
  }, [selectedModulo, selectedCategoria]);

  const extractVideoId = (url: string) => {
    const regex =
      /(?:\?v=|\/embed\/|\/v\/|youtu\.be\/|\/watch\?v=|\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = extractVideoId(youtubeUrl);

  const handleConfirm = async (currentWord: Word) => {
    const updatedWord = {
      id: 0,
      word: currentWord.word,
      description: wordDescription || currentWord.description,
      video: youtubeUrl || currentWord.video,
      status: "PENDING",
      modulo: selectedModulo,
      categoryId: selectedCategoryId,
      request_word_id: word.id,
    };

    try {
      const token = await AsyncStorage.getItem("Token");
      console.log("Token:", token);
      const response = await axios.post(`${Url}/words`, updatedWord, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newWordId = response.data.id;

      await axios.put(
        `${Url}/words/${word.id}/status`,
        { status: "TRANSLATED", interpreterId: selectedInterpreter },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (variacao) {
        variations.forEach((variation) => {
          const variationWord: VariationPayload = {
            id: 0,
            name: variation.name,
            description: variation.description,
            video: variation.video,
            wordId: newWordId,
          };
          saveVariationToAuxiliaryTable(variationWord);
        });
      }

      Alert.alert("Sucesso", "Palavra atualizada com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Erro ao salvar palavra:", error);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };

  const saveVariationToAuxiliaryTable = async (variation: VariationPayload) => {
    try {
      const token = await AsyncStorage.getItem("Token");

      const response = await axios.post(`${Url}/variations`, variation, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Variação salva com sucesso:", response.data);
    } catch (error) {
      console.error("❌ Erro ao salvar variação:", error);
    }
  };

  const handleAddVariation = () => {
    setVariations([...variations, { name: "", description: "", video: "" }]);
  };

  const handleRemoveVariation = (index: number) => {
    const newVariations = variations.filter((_, i) => i !== index);
    setVariations(newVariations);
  };

  const handleVariationChange = (
    index: number,
    field: keyof (typeof variations)[0],
    value: string
  ) => {
    const updatedVariations = [...variations];
    updatedVariations[index][field] = value;
    setVariations(updatedVariations);
  };

  const selectedInterpreterName = interpreters.find(
    (interpreter) => interpreter.id === selectedInterpreter
  )?.name;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.wordTitle}>{word.word}</Text>
      {selectedInterpreterName && (
        <Text style={styles.interpreterName}>
          Intérprete: {selectedInterpreterName}
        </Text>
      )}

      <View style={styles.wordDetails}>
        <Text style={styles.label}>Selecionar Intérprete:</Text>
        <Picker
          selectedValue={selectedInterpreter}
          onValueChange={(itemValue) => setSelectedInterpreter(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione um intérprete" value={undefined} />
          {interpreters.map((interpreter) => (
            <Picker.Item
              key={interpreter.id}
              label={interpreter.name}
              value={interpreter.id}
            />
          ))}
        </Picker>

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
          {modulos.map((modulo) =>
            modulo == "UsoTecnico" ? (
              <Picker.Item key={modulo} label="Uso Técnico" value={modulo} />
            ) : (
              <Picker.Item key={modulo} label={"Uso diário"} value={modulo} />
            )
          )}
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

        <View style={styles.checkboxContainer}>
          <Checkbox
            onCheckedChange={setVariacao}
            checked={variacao}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>
            Esta palavra tem variações linguísticas
          </Text>
        </View>

        {variacao && (
          <View style={styles.variationsContainer}>
            {variations.map((variation, index) => (
              <View key={index} style={styles.variationContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={`Nome da variaçao ${index + 1}`}
                  value={variation.name}
                  onChangeText={(text) =>
                    handleVariationChange(index, "name", text)
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder={`Descrição da Variação ${index + 1}`}
                  value={variation.description}
                  onChangeText={(text) =>
                    handleVariationChange(index, "description", text)
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder={`Link do Vídeo da Variação ${index + 1}`}
                  value={variation.video}
                  onChangeText={(text) =>
                    handleVariationChange(index, "video", text)
                  }
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveVariation(index)}
                >
                  <Text style={styles.removeButtonText}>Remover Variação</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddVariation}
            >
              <Text style={styles.addButtonText}>Adicionar Variação</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => {
            if (
              !wordDescription.trim() ||
              !youtubeUrl.trim() ||
              !selectedModulo ||
              !selectedCategoria ||
              !selectedInterpreter
            ) {
              Alert.alert(
                "Campos obrigatórios",
                "Preencha todos os campos antes de confirmar."
              );
              return;
            }

            if (variacao) {
              const hasEmpty = variations.some(
                (v) =>
                  !v.name.trim() || !v.description.trim() || !v.video.trim()
              );
              if (hasEmpty) {
                Alert.alert(
                  "Variações incompletas",
                  "Preencha todos os campos das variações."
                );
                return;
              }
            }

            handleConfirm(word);
          }}
        >
          <Text style={styles.confirmButtonText}>Confirmar Alterações</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  wordDetails: { padding: 16, backgroundColor: "#fff" },
  wordTitle: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    textAlign: "center",
  },
  interpreterName: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  descriptionInput: { height: 100, textAlignVertical: "top" },
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
  previewText: { color: "#666", fontSize: 16, lineHeight: 24 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  picker: { height: 50, borderWidth: 1, borderColor: "#ddd", marginBottom: 16 },
  confirmButton: {
    backgroundColor: "#00b4d8",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    marginTop: 16,
  },
  confirmButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkboxLabel: { fontSize: 16, color: "#333" },
  checkbox: { marginRight: 10, color: "#000", borderColor: "#000" },
  variationsContainer: { marginTop: 20 },
  variationContainer: { marginBottom: 16 },
  removeButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  removeButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  addButton: {
    backgroundColor: "#00b4d8",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default InterpreterWordDetailScreen;
