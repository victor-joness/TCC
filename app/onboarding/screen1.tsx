import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { H2, P } from "~/components/ui/typography";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ProgressIndicator from "~/components/Progresso/Progresso";

export default function OnboardingScreen({ screenNumber = 1 }: any) {
  const totalScreens = 3;
  const navigation = useNavigation();

  const handleNext = () => {
    if (screenNumber < totalScreens) {
      navigation.navigate(`onboarding/screen${screenNumber + 1}` as never);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.img}>
        <Image
          source={require("~/assets/images/Screen1.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.infos}>
        <H2 style={{ color: "#fff" }}>Bem-vindo ao nosso app! 🎉</H2>
        <P style={styles.infoText}>
          Deslize para aprender mais. lorem ipsumlorem ipsumlorem ipsumlorem
          ipsumlorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem
          ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum
        </P>

        <ProgressIndicator currentScreen={screenNumber} totalScreens={totalScreens} />

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  img: {
    width: "100%",
    height: "50%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  imgText: {
    marginTop: 10,
    fontSize: 18,
    color: "#0B8DCD",
  },
  infos: {
    width: "100%",
    height: "50%",
    backgroundColor: "#0B8DCD",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  nextButton: {
    width: 60,
    height: 60,
    backgroundColor: "#24468E",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    borderColor: "#fff",
    borderWidth: 2,
  },
  indicator: {
    width: 40,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  active: {
    backgroundColor: "black",
  },
  inactive: {
    backgroundColor: "lightgray",
  }
});
