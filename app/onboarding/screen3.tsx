import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
  Image
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

  const handleEmailPress = () => {
    Linking.openURL("mailto:contato@app.com");
  };

  const handleInstagramPress = () => {
    Linking.openURL("https://www.instagram.com/seu_perfil");
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
              promover a inclusão e facilitar a comunicação entre pessoas surdas
              e a comunidade.
            </H2>
            <View style={styles.redesocial}>
              <P style={{ color: "#fff", fontWeight: "bold" }}>Contato:</P>
              <TouchableOpacity onPress={handleEmailPress} style={styles.botao}>
                <Text style={styles.textoBotao}>📧 E-mail</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleInstagramPress}
                style={styles.botao}
              >
                <Text style={styles.textoBotao}>📸 Instagram</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infos}>
            <Text style={styles.infoText}>Apoio</Text>
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Image
                  source={ require("~/assets/images/APOIO1.png") }
                  style={styles.image}
                />
              </View>
              <View style={styles.gridItem}>
                <Image
                  source={ require("~/assets/images/APOIO2.png") }
                  style={{ ...styles.image, resizeMode: "cover" }}
                />
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
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-evenly",
    gap: 10,
    marginTop: 50,
  },
  redesocial: {
    width: "100%",
    height: 40,
    backgroundColor: "#0B8DCD",
    alignItems: "center",
    justifyContent: "space-evenly",
    color: "#fff",
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
  },
  infos: {
    flex: 1,
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
    width: "45%",
    height: 50,
    backgroundColor: "#0B8DCD",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  nextButton: {
    width: "90%",
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
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 20,
  },
  botao: {
    backgroundColor: "#0B8DCD",
    padding: 10,
    borderRadius: 5,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },
  image: {
    width: "97%",
    height: 50,
    resizeMode: "contain",
  }
});
