import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { H1 } from "~/components/ui/typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Screen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        /* TODO lembrar de tirar isso */
        await AsyncStorage.clear();
        const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

        if (hasSeenOnboarding === "true") {
          router.push("/auth/login");
        } else {
          router.push("/onboarding/screen1");
        }
      } catch (error) {
        console.error("Erro ao verificar o onboarding:", error);
      }
    };

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 30);

    const timeout = setTimeout(() => {
      checkOnboardingStatus();
      clearInterval(interval);
    }, 3000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <H1 style={styles.logoText}>IMAGEM DA LOGO</H1>

      <ActivityIndicator size="large" color="#fff" style={styles.spinner} />

      <Text style={styles.loadingText}>{`Carregando... ${progress}%`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B8DCD",
  },
  logoText: {
    marginBottom: 20,
    color: "#fff",
  },
  spinner: {
    marginTop: 10,
  },
  loadingText: {
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
  },
});
