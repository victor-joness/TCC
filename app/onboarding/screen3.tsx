import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { H1, H2, P } from "~/components/ui/typography";
import { useNavigation } from "@react-navigation/native";
import ProgressIndicator from "~/components/Progresso/Progresso";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OnboardingScreen({ screenNumber = 3 }: any) {
  const totalScreens = 3;
  const navigation = useNavigation();

  const HandleCicle = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      
      navigation.navigate(`auth/login` as never);
    } catch (error) {
      console.error("Erro ao salvar status do onboarding:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.infosContainer}>
            <H2 style={{ textAlign: "center", color: "#000" }}>
              Este aplicativo foi desenvolvido como parte do Trabalho de
              Conclusão de Curso (TCC) por dois alunos. O objetivo principal é
              promover a inclusão e facilitar a comunicação entre pessoas
              surdas.
            </H2>
            <View style={styles.redesocial}>
              <P>Victor Jones Mesquita de Sousa</P>
            </View>
            <View style={styles.redesocial}>
              <P>Victor Jones Mesquita de Sousa</P>
            </View>
          </View>

          <View style={styles.infos}>
            <Text style={styles.infoText}>Apoio</Text>
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <P>A</P>
              </View>
              <View style={styles.gridItem}>
                <P>B</P>
              </View>
              <View style={styles.gridItem}>
                <P>C</P>
              </View>
              <View style={styles.gridItem}>
                <P>D</P>
              </View>
              <View style={styles.gridItem}>
                <P>E</P>
              </View>
              <View style={styles.gridItem}>
                <P>F</P>
              </View>
              <View style={styles.gridItem}>
                <P>G</P>
              </View>
              <View style={styles.gridItem}>
                <P>H</P>
              </View>
            </View>

            <ProgressIndicator
              currentScreen={screenNumber}
              totalScreens={totalScreens}
            />

            <TouchableOpacity style={styles.nextButton} onPress={HandleCicle}>
              <P style={{ color: "#fff" }}>Começar agora</P>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  infosContainer: {
    flex: 1, // Ocupa metade da tela
    paddingHorizontal: 20,
    justifyContent: "space-evenly", // Espaçamento equilibrado
    gap: 10,
    marginTop: 50,
  },
  redesocial: {
    width: "100%",
    height: 40,
    backgroundColor: "#0B8DCD",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    borderRadius: 5, // Melhor estética
  },
  infos: {
    flex: 1, // Parte inferior (apoio e botões)
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  gridItem: {
    width: "45%", // Dois itens por linha
    height: 50,
    backgroundColor: "#0B8DCD",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  nextButton: {
    width: "90%", // Largura ajustada para ficar proporcional
    height: 60,
    backgroundColor: "#24468E",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  infoText: {
    fontSize: 70,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
