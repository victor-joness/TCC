import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// Defina o tipo da categoria
type Category = {
  id: number;
  name: string;
  icon: string;
};

interface Props {
  visible: boolean;
  onClose: () => void;
  wordToRequest: string;
  setWordToRequest: (value: string) => void;
  urlToRequest: string;
  setUrlToRequest: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  allCategories: Category[];
  handleWordRequest: () => void;
}

const WordRequestModal: React.FC<Props> = ({
  visible,
  onClose,
  wordToRequest,
  setWordToRequest,
  urlToRequest,
  setUrlToRequest,
  selectedCategory,
  setSelectedCategory,
  allCategories,
  handleWordRequest,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.cardInformation}>
            Para solicitar uma nova palavra, você pode enviar apenas o nome da
            palavra ou um link de referência (como um vídeo do YouTube ou um
            arquivo no Google Drive). Isso nos ajudará a compreender melhor o
            contexto e fornecer uma tradução mais precisa.
          </Text>
          <View style={{ flexDirection: "column", gap: 8 }}>
            <TextInput
              style={styles.wordInput}
              placeholder="Digite uma nova palavra"
              value={wordToRequest}
              onChangeText={setWordToRequest}
            />
            <TextInput
              style={styles.wordInput}
              placeholder="Digite um Link de referência"
              value={urlToRequest}
              onChangeText={setUrlToRequest}
            />
            <View style={styles.pickerContainerStyle}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={setSelectedCategory}
                style={styles.pickerStyle}
              >
                <Picker.Item label="Selecione a categoria" value="" />
                {allCategories.map((cat) => (
                  <Picker.Item
                    key={cat.id}
                    label={`${cat.icon} ${cat.name}`}
                    value={cat.name}
                  />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={styles.requestButton}
              onPress={() => {
                handleWordRequest();
                onClose();
              }}
            >
              <Text style={styles.buttonText}>Solicitar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.requestButton,
                { backgroundColor: "#999", marginTop: 10 },
              ]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  cardInformation: {
    fontSize: 16,
    marginBottom: 10,
  },
  wordInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 8,
  },
  pickerContainerStyle: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 8,
  },
  pickerStyle: {
    height: 52,
    width: "100%",
  },
  requestButton: {
    backgroundColor: "#0B8DCD",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default WordRequestModal;
